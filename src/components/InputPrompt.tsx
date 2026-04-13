import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n';

export interface InputPromptProps {
  input: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const InputPrompt: React.FC<InputPromptProps> = ({
  input,
  onChange,
  onKeyDown,
  inputRef,
}) => {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="flex items-center gap-3 py-1 text-primary">
      <span className="prompt-glyph font-medium">{'>'}</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="min-w-0 flex-1 bg-transparent text-primary outline-none placeholder:text-soft caret-accent"
        autoFocus
        spellCheck="false"
        autoComplete="off"
        autoCapitalize="none"
        aria-label={t.inputAriaLabel}
      />
    </div>
  );
};

export default InputPrompt;
