import Header from './components/Header';
import History from './components/History';
import InputPrompt from './components/InputPrompt';
import { useTerminal } from './context/TerminalContext';

export default function App() {
  const {
    input,
    setInput,
    history,
    inputRef,
    endRef,
    processCommand
  } = useTerminal();

  const handleChange = e => setInput(e.target.value);

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processCommand(input);
    }
  };

  return (
    <div
      className="min-h-screen p-5 bg-dracula-bg text-dracula-fg font-mono text-sm md:text-base text-left"
      onClick={() => inputRef.current?.focus()}
    >
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
}
