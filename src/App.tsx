import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react';
import Header from './components/Header';
import History from './components/History';
import InputPrompt from './components/InputPrompt';
import TopBar from './components/TopBar';
import { useTerminal } from './context/TerminalContext';

const REVEAL_TIMINGS = {
  shell: 40,
  content: 180,
  prompt: 320,
} as const;

const App: React.FC = () => {
  const { input, setInput, history, inputRef, endRef, processCommand } =
    useTerminal();
  const hasHistory = history.length > 0;
  const shellContentSpacing = hasHistory
    ? 'py-8 md:py-9'
    : 'pt-3 pb-8 md:pt-4 md:pb-9';
  const [prefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  });
  const [shellVisible, setShellVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [promptInteractive, setPromptInteractive] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShellVisible(true);
      setContentVisible(true);
      setPromptVisible(true);
      setPromptInteractive(true);
      return;
    }

    setPromptInteractive(false);

    const shellTimer = window.setTimeout(
      () => setShellVisible(true),
      REVEAL_TIMINGS.shell
    );
    const contentTimer = window.setTimeout(
      () => setContentVisible(true),
      REVEAL_TIMINGS.content
    );
    const promptTimer = window.setTimeout(
      () => setPromptVisible(true),
      REVEAL_TIMINGS.prompt
    );

    return () => {
      window.clearTimeout(shellTimer);
      window.clearTimeout(contentTimer);
      window.clearTimeout(promptTimer);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!promptInteractive) {
      return;
    }

    const focusInputIfIdle = () => {
      const activeElement = document.activeElement;

      if (
        inputRef.current &&
        (!activeElement ||
          activeElement === document.body ||
          activeElement === document.documentElement)
      ) {
        inputRef.current.focus();
      }
    };

    const focusFrame = window.requestAnimationFrame(() => {
      focusInputIfIdle();
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
    };
  }, [inputRef, promptInteractive]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void processCommand(input);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-canvas font-mono text-[15px] text-primary md:text-base">
      <div aria-hidden="true" className="page-atmosphere" />

      <div className="relative z-10">
        <TopBar />

        <div className="mx-auto flex min-h-screen w-full max-w-[1380px] px-[6%] pb-10 pt-32 md:px-[10%] md:pt-28 xl:px-[15%]">
          <div
            className={`terminal-shell flex w-full flex-col overflow-hidden rounded-[28px] border border-subtle bg-surface transition-[opacity,transform,box-shadow] duration-700 ease-[cubic-bezier(0.18,0.88,0.32,1)] motion-reduce:transform-none ${shellVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
              }`}
          >
            <div className="border-b border-subtle px-6 py-8 sm:px-8 md:px-12 md:py-10 lg:px-16">
              <Header
                isContentVisible={contentVisible}
                isPromptVisible={promptInteractive}
              />
            </div>

            <div
              className={`flex-1 px-6 sm:px-8 md:px-12 lg:px-16 ${shellContentSpacing}`}
              onClick={() => {
                if (promptInteractive) {
                  inputRef.current?.focus();
                }
              }}
            >
              <div
                className={`transition-[opacity,transform] duration-500 ease-out motion-reduce:transform-none ${contentVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-3 opacity-0'
                  }`}
              >
                <History history={history} />
              </div>

              <div
                aria-hidden={!promptInteractive}
                onTransitionEnd={event => {
                  if (
                    prefersReducedMotion ||
                    promptInteractive ||
                    !promptVisible ||
                    event.target !== event.currentTarget ||
                    event.propertyName !== 'opacity'
                  ) {
                    return;
                  }

                  setPromptInteractive(true);
                }}
                className={`${hasHistory ? 'mt-10' : 'mt-2'} transition-[opacity,transform] duration-500 ease-out motion-reduce:transform-none ${promptVisible
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-3 opacity-0'
                  } ${promptInteractive ? '' : 'pointer-events-none'}`}
              >
                <InputPrompt
                  input={input}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  inputRef={inputRef}
                  isVisible={promptInteractive}
                />
              </div>

              <div ref={endRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
