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

const App: React.FC = () => {
  const { input, setInput, history, inputRef, endRef, processCommand } =
    useTerminal();
  const [shellVisible, setShellVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);

  useEffect(() => {
    const shellTimer = window.setTimeout(() => setShellVisible(true), 40);
    const contentTimer = window.setTimeout(() => setContentVisible(true), 180);
    const promptTimer = window.setTimeout(() => setPromptVisible(true), 320);
    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 430);

    return () => {
      window.clearTimeout(shellTimer);
      window.clearTimeout(contentTimer);
      window.clearTimeout(promptTimer);
      window.clearTimeout(focusTimer);
    };
  }, [inputRef]);

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

        <div className="mx-auto flex min-h-screen w-full max-w-[1240px] px-[6%] pb-10 pt-32 md:px-[10%] md:pt-28 xl:px-[15%]">
          <div
            className={`terminal-shell flex w-full flex-col overflow-hidden rounded-[28px] border border-subtle bg-surface transition-[opacity,transform,box-shadow] duration-700 ease-[cubic-bezier(0.18,0.88,0.32,1)] motion-reduce:transform-none ${
              shellVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <div className="border-b border-subtle px-6 py-8 sm:px-8 md:px-12 md:py-10 lg:px-16">
              <Header
                isContentVisible={contentVisible}
                isPromptVisible={promptVisible}
              />
            </div>

            <div
              className="flex-1 px-6 py-8 sm:px-8 md:px-12 md:py-9 lg:px-16"
              onClick={() => inputRef.current?.focus()}
            >
              <div
                className={`transition-[opacity,transform] duration-500 ease-out motion-reduce:transform-none ${
                  contentVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-3 opacity-0'
                }`}
              >
                <History history={history} />
              </div>

              <div
                className={`mt-10 transition-[opacity,transform] duration-500 ease-out motion-reduce:transform-none ${
                  promptVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-3 opacity-0'
                }`}
              >
                <InputPrompt
                  input={input}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  inputRef={inputRef}
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
