import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Header from './Header';
import { LanguageProvider } from '../context/LanguageContext';
import { useTerminal } from '../context/TerminalContext';

vi.mock('../context/TerminalContext', () => ({
  useTerminal: vi.fn(),
}));

describe('Header quick-start commands', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fills the prompt and focuses the input on the next animation frame', () => {
    const animationFrames: FrameRequestCallback[] = [];
    const setInput = vi.fn();
    const focus = vi.fn();
    const setSelectionRange = vi.fn();

    vi.mocked(useTerminal).mockReturnValue({
      input: '',
      setInput,
      history: [],
      inputRef: {
        current: {
          focus,
          setSelectionRange,
        } as unknown as HTMLInputElement,
      },
      endRef: { current: null },
      processCommand: vi.fn(),
    });

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => {
      animationFrames.push(callback);
      return animationFrames.length;
    });

    render(
      <LanguageProvider>
        <Header isContentVisible isPromptVisible />
      </LanguageProvider>
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Fill the prompt with start' })
    );

    expect(setInput).toHaveBeenCalledWith('start');
    expect(animationFrames).toHaveLength(1);

    const firstFrame = animationFrames.shift();
    expect(firstFrame).toBeDefined();
    firstFrame?.(0);

    expect(focus).toHaveBeenCalledTimes(1);
    expect(setSelectionRange).toHaveBeenCalledWith(5, 5);
    expect(animationFrames).toHaveLength(0);
  });

  it('prioritizes the discovery commands in the first-visit chips', () => {
    vi.mocked(useTerminal).mockReturnValue({
      input: '',
      setInput: vi.fn(),
      history: [],
      inputRef: { current: null },
      endRef: { current: null },
      processCommand: vi.fn(),
    });

    render(
      <LanguageProvider>
        <Header isContentVisible isPromptVisible />
      </LanguageProvider>
    );

    expect(
      screen.getAllByRole('button').map(button => button.textContent)
    ).toEqual(['>start', '>work', '>search backend', '>timeline']);
  });
});
