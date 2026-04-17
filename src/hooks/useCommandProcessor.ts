import { useState, useEffect, useRef, RefObject } from 'react';
import { commandRegistry } from '../commands';
import { applyCommandEffects } from '../commands/runtime/effects';
import { executeCommand } from '../commands/runtime/executeCommand';
import { parseCommandInput } from '../commands/runtime/parseCommandInput';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n';
import { useWhoami } from '../features/whoami/useWhoami';
import { useProjects } from '../features/projects/useProjects';
import { CommandContext, HistoryItem, TerminalBlock } from '../types';

export function useCommandProcessor(): {
  input: string;
  setInput: (value: string) => void;
  history: HistoryItem[];
  inputRef: RefObject<HTMLInputElement | null>;
  endRef: RefObject<HTMLDivElement | null>;
  processCommand: (commandInput: string) => Promise<void>;
} {
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const { lang } = useLanguage();
  const whoami = useWhoami();
  const projects = useProjects();

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    endRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  }, [history]);

  const appendInput = (text: string) => {
    setHistory(prev => [...prev, { type: 'input', text }]);
  };

  const appendBlocks = (blocks: TerminalBlock[]) => {
    if (blocks.length === 0) {
      return;
    }

    setHistory(prev => [
      ...prev,
      {
        type: 'output',
        blocks,
      },
    ]);
  };

  const createCommandContext = (): CommandContext => ({
    lang,
    shellMessages: {
      notFoundMessage: translations[lang].notFoundMessage,
    },
    history,
    setHistory,
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

    const parsedPreview = parseCommandInput(normalizedInput);
    const shouldEchoInput = parsedPreview.commandName !== 'clear';

    if (shouldEchoInput) {
      appendInput(normalizedInput);
    }

    setInput('');

    const { result } = await executeCommand(normalizedInput, createCommandContext());

    setHistory(prev => applyCommandEffects(prev, result.effects));
    appendBlocks(result.blocks);
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
