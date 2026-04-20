import { useState, useEffect, useRef, RefObject } from 'react';
import { commandRegistry } from '../commands';
import { applyCommandEffects } from '../commands/runtime/effects';
import { executeCommand } from '../commands/runtime/executeCommand';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n';
import { useWhoami } from '../features/whoami/useWhoami';
import { useProjects } from '../features/projects/useProjects';
import { CommandContext, HistoryItem } from '../types';

export function useCommandProcessor(): {
  input: string;
  setInput: (value: string) => void;
  history: HistoryItem[];
  inputRef: RefObject<HTMLInputElement | null>;
  endRef: RefObject<HTMLDivElement | null>;
  processCommand: (commandInput: string) => Promise<void>;
} {
  const [input, setInput] = useState<string>('');
  const [history, setHistoryState] = useState<HistoryItem[]>([]);
  const historyRef = useRef<HistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const { lang } = useLanguage();
  const whoami = useWhoami();
  const projects = useProjects();

  const setHistory: CommandContext['setHistory'] = update => {
    const nextHistory =
      typeof update === 'function' ? update(historyRef.current) : update;

    historyRef.current = nextHistory;
    setHistoryState(nextHistory);
  };

  useEffect(() => {
    historyRef.current = history;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    endRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [history]);

  const createCommandContext = (
    setHistoryOverride: CommandContext['setHistory'] = setHistory
  ): CommandContext => ({
    lang,
    shellMessages: {
      notFoundMessage: translations[lang].notFoundMessage,
    },
    get history() {
      return historyRef.current;
    },
    setHistory: setHistoryOverride,
    content: {
      profile: null,
      narrative: null,
      timeline: null,
    },
    projectCatalog: {
      repos: projects.repos,
      loading: projects.loading,
      error: projects.error,
    },
    searchIndex: {
      ready: false,
      records: [],
    },
    services: {
      whoami,
    },
    registry: commandRegistry,
  });

  async function processCommand(commandInput: string) {
    const normalizedInput = commandInput.trim();

    if (!normalizedInput) {
      setInput('');
      return;
    }

    const inputEntry: HistoryItem = {
      type: 'input',
      text: normalizedInput,
    };

    setInput('');
    setHistory(prev => [...prev, inputEntry]);

    const { result } = await executeCommand(
      normalizedInput,
      createCommandContext(setHistory)
    );

    setHistory(prev => {
      let nextHistory =
        result.echoInput ?? true
          ? prev
          : prev.filter(item => item !== inputEntry);

      nextHistory = applyCommandEffects(nextHistory, result.effects);

      if (result.blocks.length > 0) {
        nextHistory = [
          ...nextHistory,
          {
            type: 'output',
            blocks: result.blocks,
          },
        ];
      }

      return nextHistory;
    });
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
