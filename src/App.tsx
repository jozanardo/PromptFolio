import React, { ChangeEvent, KeyboardEvent } from 'react';
import Header from './components/Header';
import History from './components/History';
import InputPrompt from './components/InputPrompt';
import LanguageToggle from './components/LanguageToggle';
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
    <div className="min-h-screen flex flex-col bg-dracula-bg text-dracula-fg font-mono text-sm md:text-base">
      <div className="sticky top-0 z-20 bg-dracula-bg py-4 px-5">
        <div className="relative">
          <div className="absolute top-0 right-0">
            <LanguageToggle />
          </div>
          <div className="flex justify-center">
            <Header />
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto px-5 pt-2 pb-5"
        onClick={() => inputRef.current?.focus()}
      >
        <History history={history} />

        <InputPrompt
          input={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
        />

        <div ref={endRef} />
      </div>
    </div>
  );
};

export default App;
