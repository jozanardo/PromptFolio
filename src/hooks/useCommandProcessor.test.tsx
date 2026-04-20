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

vi.mock('../features/whoami/useWhoami', () => ({
  useWhoami: () => ({
    loading: false,
    error: null,
    fetchReadme: vi.fn(),
  }),
}));

import { executeCommand } from '../commands/runtime/executeCommand';

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
});
