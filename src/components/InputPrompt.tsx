import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n';

export interface InputPromptProps {
  input: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isVisible: boolean;
}

const InputPrompt: React.FC<InputPromptProps> = ({
  input,
  onChange,
  onKeyDown,
  inputRef,
  isVisible,
}) => {
  const { lang } = useLanguage();
  const t = translations[lang];
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || input.length > 0;

  return (
    <div className={`prompt-line ${isActive ? 'prompt-line-active' : ''}`}>
      <span className="prompt-glyph font-medium">{'>'}</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="min-w-0 flex-1 bg-transparent text-primary outline-none placeholder:text-soft caret-accent"
        spellCheck="false"
        autoComplete="off"
        autoCapitalize="none"
        tabIndex={isVisible ? 0 : -1}
        aria-label={t.inputAriaLabel}
      />
    </div>
  );
};

export default InputPrompt;
