import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { TerminalProvider } from './context/TerminalContext';
import { ThemeProvider } from './context/ThemeContext';

vi.mock('./features/projects/useProjects', () => ({
  useProjects: () => ({
    repos: [],
    loading: false,
    error: null,
    refreshProjects: vi.fn(),
  }),
}));

describe('App quick-start commands', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();

    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
        removeItem: (key: string) => {
          storage.delete(key);
        },
        clear: () => {
          storage.clear();
        },
      },
    });

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

  it('executes a quick-start command after filling the prompt', async () => {
    render(
      <ThemeProvider>
        <LanguageProvider>
          <TerminalProvider>
            <App />
          </TerminalProvider>
        </LanguageProvider>
      </ThemeProvider>
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Fill prompt with about' })
    );

    await waitFor(() => {
      expect(
        screen.getByText((_, element) => element?.textContent === 'About me:')
      ).toBeInTheDocument();
    });

    expect(
      screen.getByRole('textbox', { name: 'Terminal input' })
    ).toHaveValue('');
  });
});
