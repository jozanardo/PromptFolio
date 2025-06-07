import { useState, useEffect, useRef, RefObject } from 'react';
import { Command, isCommand, CommandMeta } from '../commands';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n';
import { useWhoami } from '../features/whoami/useWhoami';
import { useProjects } from '../features/projects/useProjects';
import {
  HistoryItem,
  HistoryInput,
  HistoryOutput,
  HistoryError,
  HistoryMarkdown,
  HistoryHelp,
} from '../types';

export function useCommandProcessor(): {
  input: string;
  setInput: (value: string) => void;
  history: HistoryItem[];
  inputRef: RefObject<HTMLInputElement | null>;
  endRef: RefObject<HTMLDivElement | null>;
  processCommand: (commandInput: string) => Promise<void>;
} {
  // Estado do terminal
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const { lang } = useLanguage();
  const t = translations[lang];

  const {
    loading: whoamiLoading,
    html: whoamiHtml,
    error: whoamiError,
    loadReadme,
  } = useWhoami();

  const {
    filteredProjects,
    setFilters,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const push = (...items: HistoryItem[]) =>
    setHistory(prev => [...prev, ...items]);

  useEffect(() => {
    if (whoamiHtml) {
      push({ type: 'markdown', html: whoamiHtml } as HistoryMarkdown);
    }
  }, [whoamiHtml]);

  useEffect(() => {
    if (whoamiError) {
      push({
        type: 'output',
        text: `❌ ${whoamiError.message}`,
      } as HistoryOutput);
    }
  }, [whoamiError]);

  async function processCommand(commandInput: string) {
    const [cmd, ...args] = commandInput.trim().split(/\s+/);

    if (cmd === Command.CLEAR) {
      setHistory([]);
      setInput('');
      return;
    }

    push({ type: 'input', text: commandInput } as HistoryInput);

    if (cmd === Command.WHOAMI) {
      push({ type: 'output', text: '🔄 Carregando README do GitHub…' } as HistoryOutput);
      await loadReadme();
      setInput('');
      return;
    }

    if (cmd === Command.PROJECTS) {
      let langFilter: string | null = null;
      let descFilter: string | null = null;
      let nameFilter: string | null = null;
      let showHelp = false;
      let showLangs = false;

      for (const arg of args) {
        if (arg === '--help') showHelp = true;
        else if (arg === '--list-langs') showLangs = true;
        else if (arg.startsWith('--lang=')) langFilter = arg.split('=')[1].toLowerCase();
        else if (arg.startsWith('--desc=')) descFilter = arg.split('=')[1].toLowerCase();
        else if (arg.startsWith('--name=')) nameFilter = arg.split('=')[1].toLowerCase();
      }

      if (showHelp) {
        push({ type: 'output', text: t.projectsHelpUsage } as HistoryOutput);
        setInput('');
        return;
      }

      if (showLangs) {
        if (projectsLoading) {
          push({ type: 'output', text: '🔄 Carregando linguagens…' } as HistoryOutput);
        } else if (projectsError) {
          push({ type: 'output', text: `❌ ${projectsError}` } as HistoryOutput);
        } else {
          const langs = Array.from(
            new Set(filteredProjects.map(r => r.language).filter(Boolean))
          ) as string[];
          const lines: string[] = [t.availableLangsTitle];
          for (const langCode of langs) {
            const count = filteredProjects.filter(r => r.language === langCode).length;
            lines.push(
              `  ${langCode} (${count} ${count === 1 ? t.projectSingular : t.projectPlural})`
            );
          }
          push(...lines.map(text => ({ type: 'output', text } as HistoryOutput)));
        }
        setInput('');
        return;
      }

      setFilters({ lang: langFilter, desc: descFilter, name: nameFilter });

      if (projectsLoading) {
        push({ type: 'output', text: '🔄 Buscando projetos…' } as HistoryOutput);
      } else if (projectsError) {
        push({ type: 'output', text: `❌ ${projectsError}` } as HistoryOutput);
      } else {
        const parts: string[] = [];
        if (langFilter) parts.push(`linguagem: ${langFilter}`);
        if (descFilter) parts.push(`descrição: "${descFilter}"`);
        if (nameFilter) parts.push(`nome: "${nameFilter}"`);

        const header = parts.length
          ? `${t.allProjectsTitle} (${parts.join(', ')})`
          : t.allProjectsTitle;
        push({ type: 'output', text: header } as HistoryOutput);

        if (filteredProjects.length > 0) {
          push({
            type: 'output',
            text: `${t.foundMessage} ${filteredProjects.length} ${
              filteredProjects.length === 1 ? t.projectSingular : t.projectPlural
            }`,
          } as HistoryOutput);

          filteredProjects.forEach((repo, i) => {
            push({
              type: 'output',
              text: `\n[${i + 1}] ${repo.name} (${repo.language || 'N/A'})`,
            } as HistoryOutput);
            if (repo.description) {
              push({
                type: 'output',
                text: `    ${t.descriptionLabel}: ${repo.description}`,
              } as HistoryOutput);
            }
            push({
              type: 'output',
              text: `    URL: ${repo.html_url}`,
            } as HistoryOutput);
            push({
              type: 'output',
              text: `    ${t.updatedLabel}: ${new Date(
                repo.updated_at
              ).toLocaleDateString()}`,
            } as HistoryOutput);
          });
        } else {
          push({ type: 'output', text: t.noProjectsMessage } as HistoryOutput);
        }
      }

      setInput('');
      return;
    }

    if (cmd === Command.HELP || cmd === Command.LS) {
      for (const [key, meta] of CommandMeta.entries()) {
        push({
          type: 'help',
          cmd: key,
          description: meta.description,
          usage: meta.usage,
        } as HistoryHelp);
      }
      setInput('');
      return;
    }

    if (!isCommand(cmd)) {
      push({
        type: 'error',
        cmd,
        message: t.notFoundMessage,
      } as HistoryError);
      setInput('');
      return;
    }

    if (cmd === Command.ABOUT) {
      push({ type: 'output', text: t.aboutTitle } as HistoryOutput);
      push({ type: 'output', text: t.aboutLine1 } as HistoryOutput);
      push({ type: 'output', text: t.aboutLine2 } as HistoryOutput);
      setInput('');
      return;
    }

    if (cmd === Command.SKILLS) {
      push({ type: 'output', text: t.skillsTitle } as HistoryOutput);
      t.skillsList.forEach(line =>
        push({ type: 'output', text: line } as HistoryOutput)
      );
      setInput('');
      return;
    }

    if (cmd === Command.CONTACT) {
      push({ type: 'output', text: t.contactTitle } as HistoryOutput);
      t.contactList.forEach(line =>
        push({ type: 'output', text: line } as HistoryOutput)
      );
      setInput('');
      return;
    }
  }

  return {
    input,
    setInput,
    history,
    inputRef,
    endRef,
    processCommand,
  };
}
