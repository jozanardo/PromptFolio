import { renderHook, act, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { useCommandProcessor } from './useCommandProcessor';
import { LanguageProvider } from '../context/LanguageContext';
import type { CommandDispatchResult } from '../commands/runtime/executeCommand';

vi.mock('../commands/runtime/executeCommand', () => ({
  executeCommand: vi.fn(),
}));

vi.mock('../features/projects/useProjects', () => ({
  useProjects: () => ({
    repos: [],
    loading: false,
    error: null,
    refreshProjects: vi.fn(),
  }),
}));

import { executeCommand } from '../commands/runtime/executeCommand';

function createDeferred<T>() {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>(res => {
    resolve = res;
  });

  return { promise, resolve };
}

describe('useCommandProcessor', () => {
  beforeEach(() => {
    vi.clearAllMocks();

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

    const wrapper = ({ children }: { children: ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );

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

    const wrapper = ({ children }: { children: ReactNode }) => (
      <LanguageProvider>{children}</LanguageProvider>
    );

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
});
