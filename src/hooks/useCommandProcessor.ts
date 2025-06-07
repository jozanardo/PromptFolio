import {
  useState,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  RefObject,
} from 'react';
import { Command, isCommand } from '../commands';
import { useHelp } from '../features/help/useHelp';
import { useWhoami } from '../features/whoami/useWhoami';
import { useProjects } from '../features/projects/useProjects';
import {
  HistoryItem,
  HistoryInput,
  HistoryOutput,
  HistoryError,
  HistoryMarkdown,
} from '../types';

export function useCommandProcessor(): {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  history: HistoryItem[];
  inputRef: RefObject<HTMLInputElement | null>;
  endRef: RefObject<HTMLDivElement | null>;
  processCommand: (commandInput: string) => Promise<void>;
} {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { getHelpLines } = useHelp();
  const {
    loading: whoamiLoading,
    html: whoamiHtml,
    error: whoamiError,
    loadReadme,
  } = useWhoami('jozanardo', 'jozanardo');
  const {
    filteredProjects,
    filters,
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

  const processCommand = async (commandInput: string) => {
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

      args.forEach(arg => {
        if (arg === '--help') showHelp = true;
        else if (arg === '--list-langs') showLangs = true;
        else if (arg.startsWith('--lang=')) langFilter = arg.split('=')[1].toLowerCase();
        else if (arg.startsWith('--desc=')) descFilter = arg.split('=')[1].toLowerCase();
        else if (arg.startsWith('--name=')) nameFilter = arg.split('=')[1].toLowerCase();
      });

      if (showHelp) {
        const helpLines = [
          'Uso: projects [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>] [--list-langs] [--help]',
          'Opções:',
          '  --lang=<linguagem>   Filtrar por linguagem',
          '  --desc=<texto>       Filtrar por texto na descrição',
          '  --name=<nome>        Filtrar por nome do projeto',
          '  --list-langs         Listar linguagens disponíveis',
          '  --help               Mostrar esta ajuda',
        ];
        push(...helpLines.map(line => ({ type: 'output', text: line } as HistoryOutput)));
        setInput('');
        return;
      }

      if (showLangs) {
        if (projectsLoading) {
          push({ type: 'output', text: '🔄 Carregando linguagens…' } as HistoryOutput);
        } else if (projectsError) {
          push({ type: 'output', text: `❌ ${projectsError}` } as HistoryOutput);
        } else {
          const langs = Array.from(new Set(filteredProjects.map(r => r.language).filter(Boolean))).sort() as string[];
          const lines = ['Linguagens disponíveis:'];
          langs.forEach(lang => {
            const count = filteredProjects.filter(r => r.language === lang).length;
            lines.push(`  ${lang} (${count} ${count === 1 ? 'projeto' : 'projetos'})`);
          });
          push(...lines.map(line => ({ type: 'output', text: line } as HistoryOutput)));
        }
        setInput('');
        return;
      }

      setFilters({ lang: langFilter, desc: descFilter, name: nameFilter });

      if (projectsLoading) {
        push({ type: 'output', text: '🔄 Carregando projetos…' } as HistoryOutput);
      } else if (projectsError) {
        push({ type: 'output', text: `❌ ${projectsError}` } as HistoryOutput);
      } else {
        const descParts: string[] = [];
        if (langFilter) descParts.push(`linguagem: ${langFilter}`);
        if (descFilter) descParts.push(`descrição: "${descFilter}"`);
        if (nameFilter) descParts.push(`nome: "${nameFilter}"`);

        const header = descParts.length
          ? `Projetos filtrados por ${descParts.join(', ')}:`
          : 'Todos os projetos:';

        const lines: string[] = [header];
        if (filteredProjects.length > 0) {
          lines.push(
            `Encontrados ${filteredProjects.length} ${
              filteredProjects.length === 1 ? 'projeto' : 'projetos'
            }`
          );
          filteredProjects.forEach((repo, i) => {
            lines.push(`\n[${i + 1}] ${repo.name} (${repo.language || 'N/A'})`);
            if (repo.description) {
              lines.push(`    Descrição: ${repo.description}`);
            }
            lines.push(`    URL: ${repo.html_url}`);
            lines.push(
              `    Atualizado em: ${new Date(repo.updated_at).toLocaleDateString()}`
            );
          });
        } else {
          lines.push('Nenhum projeto encontrado com os filtros informados.');
        }
        push(...lines.map(line => ({ type: 'output', text: line } as HistoryOutput)));
      }

      setInput('');
      return;
    }

    if (cmd === Command.HELP || cmd === Command.LS) {
      const lines = getHelpLines();
      push(...lines.map(line => ({ type: 'output', text: line } as HistoryOutput)));
      setInput('');
      return;
    }

    if (!isCommand(cmd)) {
      push({
        type: 'error',
        cmd,
        message: "command not found. Type 'help' to view available commands.",
      } as HistoryError);
      setInput('');
      return;
    }

    const outputLines: string[] = [];
    switch (cmd) {
      case Command.ABOUT:
        outputLines.push('Sobre mim:');
        outputLines.push('Sou apaixonado por tecnologia e desenvolvimento de software.');
        outputLines.push('Atualmente estudando Ciência da Computação na UFABC.');
        break;
      case Command.SKILLS:
        outputLines.push('Minhas habilidades incluem:');
        outputLines.push('- TypeScript, JavaScript, Python, Java, C#, Go, Haskell');
        outputLines.push('- React, Node.js, NestJS, Next.js, Tailwind CSS');
        outputLines.push('- Git, Docker, Linux');
        break;
      case Command.CONTACT:
        outputLines.push('Entre em contato:');
        outputLines.push('- GitHub: https://github.com/jozanardo');
        outputLines.push('- LinkedIn: [Seu LinkedIn]');
        outputLines.push('- Email: [Seu Email]');
        break;
    }
    push(...outputLines.map(line => ({ type: 'output', text: line } as HistoryOutput)));
    setInput('');
  };

  return { input, setInput, history, inputRef, endRef, processCommand };
}
