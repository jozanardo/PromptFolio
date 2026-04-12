import React, { ChangeEvent, KeyboardEvent } from 'react';
import Header from './components/Header';
import History from './components/History';
import InputPrompt from './components/InputPrompt';
import TopBar from './components/TopBar';
import { useTerminal } from './context/TerminalContext';

const App: React.FC = () => {
  const { input, setInput, history, inputRef, endRef, processCommand } =
    useTerminal();

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
    <div className="min-h-screen bg-canvas text-primary font-mono text-[15px] md:text-base">
      <TopBar />

      <div className="mx-auto flex min-h-screen w-full px-[6%] pb-8 pt-24 md:px-[10%] md:pt-28 xl:px-[15%]">
        <div className="terminal-shell flex w-full flex-col overflow-hidden rounded-[28px] border border-subtle bg-surface">
          <div className="border-b border-subtle px-6 py-7 sm:px-8 md:px-12 md:py-9 lg:px-16">
            <Header />
          </div>

          <div
            className="flex-1 px-6 py-7 sm:px-8 md:px-12 md:py-8 lg:px-16"
            onClick={() => inputRef.current?.focus()}
          >
            <History history={history} />

            <div className="mt-8 pt-2">
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
  );
};

export default App;
