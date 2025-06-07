import React, { ChangeEvent, KeyboardEvent } from 'react';
import Header from './components/Header';
import History from './components/History';
import InputPrompt from './components/InputPrompt';
import LanguageToggle from './components/LanguageToggle';
import { useTerminal } from './context/TerminalContext';

const App: React.FC = () => {
  const {
    input,
    setInput,
    history,
    inputRef,
    endRef,
    processCommand,
  } = useTerminal();

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void processCommand(input);
    }
  };

  return (
    <div
      className="relative min-h-screen p-5 bg-dracula-bg text-dracula-fg font-mono text-sm md:text-base text-left"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <Header />

      <History history={history} />

      <InputPrompt
        input={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
      />

      <div ref={endRef} />
    </div>
  );
};

export default App;
