import {
  useCallback,
  useState,
  useEffect,
  useRef,
  RefObject,
} from 'react';
import { commandRegistry } from '../commands';
import { applyCommandEffects } from '../commands/runtime/effects';
import { executeCommand } from '../commands/runtime/executeCommand';
import { useLanguage } from '../context/LanguageContext';
import { profileContent } from '../content/profile';
import { translations } from '../i18n';
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
  const projects = useProjects();

  const setHistory = useCallback<CommandContext['setHistory']>(update => {
    const nextHistory =
      typeof update === 'function' ? update(historyRef.current) : update;

    historyRef.current = nextHistory;
    setHistoryState(nextHistory);
  }, []);

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

  const createCommandContext = useCallback(
    (
      setHistoryOverride: CommandContext['setHistory'] = setHistory,
      historySource: () => HistoryItem[] = () => historyRef.current
    ): CommandContext => ({
      lang,
      shellMessages: {
        notFoundMessage: translations[lang].notFoundMessage,
      },
      get history() {
        return historySource();
      },
      setHistory: setHistoryOverride,
      content: {
        profile: profileContent,
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
      services: {},
      registry: commandRegistry,
    }),
    [lang, projects.error, projects.loading, projects.repos, setHistory]
  );

  const previousLangRef = useRef(lang);

  useEffect(() => {
    if (previousLangRef.current === lang) {
      return;
    }

    previousLangRef.current = lang;

    const commandsToReplay = historyRef.current.flatMap(item =>
      item.type === 'input' ? [item.text] : []
    );

    if (commandsToReplay.length === 0) {
      return;
    }

    let cancelled = false;

    async function rebuildHistoryForLanguage() {
      let rebuiltHistory: HistoryItem[] = [];

      const setReplayHistory: CommandContext['setHistory'] = update => {
        rebuiltHistory =
          typeof update === 'function' ? update(rebuiltHistory) : update;
      };

      for (const commandInput of commandsToReplay) {
        const inputEntry: HistoryItem = {
          type: 'input',
          text: commandInput,
        };

        rebuiltHistory = [...rebuiltHistory, inputEntry];

        const { result } = await executeCommand(
          commandInput,
          createCommandContext(setReplayHistory, () => rebuiltHistory)
        );

        let nextHistory =
          result.echoInput ?? true
            ? rebuiltHistory
            : rebuiltHistory.filter(item => item !== inputEntry);

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

        rebuiltHistory = nextHistory;
      }

      if (!cancelled) {
        setHistory(rebuiltHistory);
      }
    }

    void rebuildHistoryForLanguage();

    return () => {
      cancelled = true;
    };
  }, [createCommandContext, lang, setHistory]);

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
