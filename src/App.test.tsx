import { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

function setMatchMedia(prefersReducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: prefersReducedMotion && query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

function renderApp() {
  return render(
    <ThemeProvider>
      <LanguageProvider>
        <TerminalProvider>
          <App />
        </TerminalProvider>
      </LanguageProvider>
      </ThemeProvider>
  );
}

describe('App quick-start commands', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.setItem('lang', 'en');
    setMatchMedia(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fills the prompt and moves focus when clicking a quick-start command', () => {
    renderApp();

    fireEvent.click(
      screen.getByRole('button', { name: 'Fill the prompt with start' })
    );

    act(() => {
      vi.runAllTimers();
    });

    const input = screen.getByRole('textbox', { name: 'Command prompt' });
    expect(input).toHaveValue('start');
    expect(input).toHaveFocus();
  });
});

describe('App onboarding', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.setItem('lang', 'pt');
    setMatchMedia(false);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('orienta a primeira interação com linguagem clara e instrução explícita', async () => {
    const { container } = renderApp();

    await act(async () => {
      await Promise.resolve();
    });

    act(() => {
      vi.advanceTimersByTime(800);
    });

    const promptReveal = container.querySelector(
      '[aria-hidden="true"].mt-2, [aria-hidden="true"].mt-10'
    );
    if (!promptReveal) {
      throw new Error('Prompt reveal container not found');
    }

    act(() => {
      fireEvent.transitionEnd(promptReveal, { propertyName: 'opacity' });
    });

    expect(
      screen.getByRole('heading', {
        name: 'Explore meu trabalho, trajetória e formas de contato.',
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Clique em uma sugestão para preencher o prompt. Depois, pressione Enter.'
      )
    ).toBeInTheDocument();

    const input = screen.getByRole('textbox', { name: 'Prompt de comando' });
    expect(input).toHaveAttribute(
      'placeholder',
      'Digite um comando e pressione Enter'
    );
    expect(input).toHaveAccessibleDescription(
      /Ou digite\s*help\s*e pressione Enter para ver todas as opções disponíveis\./i
    );

    const promptContainer = input.parentElement?.parentElement;
    expect(promptContainer).not.toBeNull();
    expect(promptContainer?.className).toContain('mt-2');

    const contentSection = promptContainer?.parentElement;
    expect(contentSection).not.toBeNull();
    expect(contentSection?.className).toContain('pt-3');
  });
});
