export default function InputPrompt({ input, onChange, onKeyDown, inputRef }) {
  return (
    <div className="flex items-center mt-2">
      <span className="text-accent neon-accent font-bold mr-2">{'>'}</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="flex-1 ml-2 bg-transparent border-none outline-none text-dracula-fg caret-dracula-pink"
        autoFocus
        spellCheck="false"
        autoComplete="off"
      />
    </div>
  );
}
