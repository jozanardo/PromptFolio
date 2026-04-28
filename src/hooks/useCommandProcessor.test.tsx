import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useCommandProcessor } from './useCommandProcessor';
import {
  LanguageProvider,
  useLanguage,
  type Language,
} from '../context/LanguageContext';
import type { CommandDispatchResult } from '../commands/runtime/executeCommand';
import type { ProjectRepo } from '../features/projects/projectsService';

const mockProjectsState = vi.hoisted(() => ({
  current: {
    repos: [] as ProjectRepo[],
    loading: false,
    error: null as string | null,
    refreshProjects: vi.fn(),
  },
}));

vi.mock('../commands/runtime/executeCommand', () => ({
  executeCommand: vi.fn(),
}));

vi.mock('../features/projects/useProjects', () => ({
  useProjects: () => mockProjectsState.current,
}));

import { executeCommand } from '../commands/runtime/executeCommand';

function createDeferred<T>() {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>(res => {
    resolve = res;
  });

  return { promise, resolve };
}

function createCommandResult(
  text: string,
  commandName = 'about'
): CommandDispatchResult {
  return {
    parsedInput: {
      raw: commandName,
      normalized: commandName,
      commandName,
      argv: [],
      positionals: [],
      flags: {},
      tokenizationError: null,
    },
    result: {
      echoInput: true,
      blocks: [
        {
          type: 'text',
          text,
        },
      ],
      effects: [],
    },
  };
}

function createLanguageWrapper(
  captureSetLang?: (setLang: (lang: Language) => void) => void
) {
  const LanguageController = () => {
    const { setLang } = useLanguage();

    useEffect(() => {
      captureSetLang?.(setLang);
    }, [setLang]);

    return null;
  };

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <LanguageProvider>
        <LanguageController />
        {children}
      </LanguageProvider>
    );
  };
}

describe('useCommandProcessor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProjectsState.current = {
      repos: [],
      loading: false,
      error: null,
      refreshProjects: vi.fn(),
    };

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    });
  });

  it('uses the runtime echoInput flag when appending command input to history', async () => {
    vi.mocked(executeCommand).mockResolvedValue({
      parsedInput: {
        raw: 'silent',
        normalized: 'silent',
        commandName: 'silent',
        argv: [],
        positionals: [],
        flags: {},
        tokenizationError: null,
      },
      result: {
        echoInput: false,
        blocks: [
          {
            type: 'text',
            text: 'done',
          },
        ],
        effects: [],
      },
    } satisfies CommandDispatchResult);

    const wrapper = createLanguageWrapper();
    const { result } = renderHook(() => useCommandProcessor(), { wrapper });

    await act(async () => {
      await result.current.processCommand('silent');
    });

    await waitFor(() => {
      expect(result.current.history).toEqual([
        {
          type: 'output',
          blocks: [
            {
              type: 'text',
              text: 'done',
            },
          ],
        },
      ]);
    });
  });

  it('applies command history updates immediately while execution is still in flight', async () => {
    const deferred = createDeferred<CommandDispatchResult>();

    vi.mocked(executeCommand).mockImplementation(async (_, context) => {
      expect(context.history).toEqual([
        {
          type: 'input',
          text: 'whoami',
        },
      ]);

      context.setHistory(prev => [
        ...prev,
        {
          type: 'output',
          blocks: [
            {
              type: 'system',
              text: 'loading',
            },
          ],
        },
      ]);

      expect(context.history).toEqual([
        {
          type: 'input',
          text: 'whoami',
        },
        {
          type: 'output',
          blocks: [
            {
              type: 'system',
              text: 'loading',
            },
          ],
        },
      ]);

      return deferred.promise;
    });

    const wrapper = createLanguageWrapper();
    const { result } = renderHook(() => useCommandProcessor(), { wrapper });

    let execution!: Promise<void>;

    await act(async () => {
      execution = result.current.processCommand('whoami');
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.history).toEqual([
        {
          type: 'input',
          text: 'whoami',
        },
        {
          type: 'output',
          blocks: [
            {
              type: 'system',
              text: 'loading',
            },
          ],
        },
      ]);
    });

    deferred.resolve({
      parsedInput: {
        raw: 'whoami',
        normalized: 'whoami',
        commandName: 'whoami',
        argv: [],
        positionals: [],
        flags: {},
        tokenizationError: null,
      },
      result: {
        echoInput: true,
        blocks: [
          {
            type: 'markdown',
            html: '<p>done</p>',
          },
        ],
        effects: [],
      },
    });

    await act(async () => {
      await execution;
    });

    await waitFor(() => {
      expect(result.current.history).toEqual([
        {
          type: 'input',
          text: 'whoami',
        },
        {
          type: 'output',
          blocks: [
            {
              type: 'system',
              text: 'loading',
            },
          ],
        },
        {
          type: 'output',
          blocks: [
            {
              type: 'markdown',
              html: '<p>done</p>',
            },
          ],
        },
      ]);
    });
  });

  it('does not cancel language replay when project state changes during rebuild', async () => {
    let setLang!: (lang: Language) => void;
    const replay = createDeferred<CommandDispatchResult>();

    vi.mocked(executeCommand).mockImplementation(async (_, context) => {
      if (context.lang === 'pt') {
        return replay.promise;
      }

      return createCommandResult('english about');
    });

    const wrapper = createLanguageWrapper(nextSetLang => {
      setLang = nextSetLang;
    });
    const { result, rerender } = renderHook(() => useCommandProcessor(), {
      wrapper,
    });

    await act(async () => {
      await result.current.processCommand('about');
    });

    await waitFor(() => {
      expect(result.current.history).toEqual([
        {
          type: 'input',
          text: 'about',
        },
        {
          type: 'output',
          blocks: [
            {
              type: 'text',
              text: 'english about',
            },
          ],
        },
      ]);
    });

    await act(async () => {
      setLang('pt');
      await Promise.resolve();
    });

    mockProjectsState.current = {
      repos: [
        {
          name: 'PromptFolio',
          html_url: 'https://github.com/jozanardo/PromptFolio',
          description: 'Portfolio',
          language: 'TypeScript',
          updated_at: '2026-04-28T00:00:00Z',
        },
      ],
      loading: false,
      error: null,
      refreshProjects: vi.fn(),
    };

    rerender();

    await act(async () => {
      replay.resolve(createCommandResult('sobre em português'));
      await replay.promise;
    });

    await waitFor(() => {
      expect(result.current.history).toEqual([
        {
          type: 'input',
          text: 'about',
        },
        {
          type: 'output',
          blocks: [
            {
              type: 'text',
              text: 'sobre em português',
            },
          ],
        },
      ]);
    });
  });

  it('preserves commands submitted while language replay is rebuilding history', async () => {
    let setLang!: (lang: Language) => void;
    const replay = createDeferred<CommandDispatchResult>();

    vi.mocked(executeCommand).mockImplementation(async (commandInput, context) => {
      if (commandInput === 'about' && context.lang === 'pt') {
        return replay.promise;
      }

      if (commandInput === 'skills') {
        return createCommandResult('skills em português', 'skills');
      }

      return createCommandResult('english about');
    });

    const wrapper = createLanguageWrapper(nextSetLang => {
      setLang = nextSetLang;
    });
    const { result } = renderHook(() => useCommandProcessor(), {
      wrapper,
    });

    await act(async () => {
      await result.current.processCommand('about');
    });

    await waitFor(() => {
      expect(result.current.history).toEqual([
        {
          type: 'input',
          text: 'about',
        },
        {
          type: 'output',
          blocks: [
            {
              type: 'text',
              text: 'english about',
            },
          ],
        },
      ]);
    });

    await act(async () => {
      setLang('pt');
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.processCommand('skills');
    });

    await waitFor(() => {
      expect(result.current.history).toEqual([
        {
          type: 'input',
          text: 'about',
        },
        {
          type: 'output',
          blocks: [
            {
              type: 'text',
              text: 'english about',
            },
          ],
        },
        {
          type: 'input',
          text: 'skills',
        },
        {
          type: 'output',
          blocks: [
            {
              type: 'text',
              text: 'skills em português',
            },
          ],
        },
      ]);
    });

    await act(async () => {
      replay.resolve(createCommandResult('sobre em português'));
      await replay.promise;
    });

    await waitFor(() => {
      expect(result.current.history).toEqual([
        {
          type: 'input',
          text: 'about',
        },
        {
          type: 'output',
          blocks: [
            {
              type: 'text',
              text: 'sobre em português',
            },
          ],
        },
        {
          type: 'input',
          text: 'skills',
        },
        {
          type: 'output',
          blocks: [
            {
              type: 'text',
              text: 'skills em português',
            },
          ],
        },
      ]);
    });
  });

  it('ignores stale command output when language replay replaces the same input', async () => {
    let setLang!: (lang: Language) => void;
    const originalCommand = createDeferred<CommandDispatchResult>();
    const replay = createDeferred<CommandDispatchResult>();

    vi.mocked(executeCommand).mockImplementation(async (_, context) => {
      if (context.lang === 'pt') {
        return replay.promise;
      }

      return originalCommand.promise;
    });

    const wrapper = createLanguageWrapper(nextSetLang => {
      setLang = nextSetLang;
    });
    const { result } = renderHook(() => useCommandProcessor(), {
      wrapper,
    });

    let originalExecution!: Promise<void>;

    await act(async () => {
      originalExecution = result.current.processCommand('about');
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(result.current.history).toEqual([
        {
          type: 'input',
          text: 'about',
        },
      ]);
    });

    await act(async () => {
      setLang('pt');
      await Promise.resolve();
    });

    await act(async () => {
      originalCommand.resolve(createCommandResult('english about'));
      await originalCommand.promise;
      await originalExecution;
    });

    await waitFor(() => {
      expect(result.current.history).toEqual([
        {
          type: 'input',
          text: 'about',
        },
      ]);
    });

    await act(async () => {
      replay.resolve(createCommandResult('sobre em português'));
      await replay.promise;
    });

    await waitFor(() => {
      expect(result.current.history).toEqual([
        {
          type: 'input',
          text: 'about',
        },
        {
          type: 'output',
          blocks: [
            {
              type: 'text',
              text: 'sobre em português',
            },
          ],
        },
      ]);
    });
  });
});
