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

  it('waits an extra animation frame before executing a quick-start command', () => {
    const animationFrames: FrameRequestCallback[] = [];
    const setInput = vi.fn();
    const processCommand = vi.fn().mockResolvedValue(undefined);
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
      processCommand,
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
      screen.getByRole('button', { name: 'Fill prompt with about' })
    );

    expect(setInput).toHaveBeenCalledWith('about');
    expect(processCommand).not.toHaveBeenCalled();
    expect(animationFrames).toHaveLength(1);

    const firstFrame = animationFrames.shift();
    expect(firstFrame).toBeDefined();
    firstFrame?.(0);

    expect(focus).toHaveBeenCalledTimes(1);
    expect(setSelectionRange).toHaveBeenCalledWith(5, 5);
    expect(processCommand).not.toHaveBeenCalled();
    expect(animationFrames).toHaveLength(1);

    const secondFrame = animationFrames.shift();
    expect(secondFrame).toBeDefined();
    secondFrame?.(16);

    expect(processCommand).toHaveBeenCalledWith('about');
  });
});
