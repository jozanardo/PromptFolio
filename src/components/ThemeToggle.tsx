import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
      <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 2.5v2.4M12 19.1v2.4M21.5 12h-2.4M4.9 12H2.5M18.7 5.3l-1.7 1.7M7 17l-1.7 1.7M18.7 18.7 17 17M7 7 5.3 5.3"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5">
      <path
        d="M14.8 3.2a8.8 8.8 0 1 0 6 15.3A9.6 9.6 0 0 1 14.8 3.2Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { lang } = useLanguage();

  const options = [
    {
      value: 'light',
      label: lang === 'pt' ? 'Claro' : 'Light',
      icon: <SunIcon />,
    },
    {
      value: 'dark',
      label: lang === 'pt' ? 'Escuro' : 'Dark',
      icon: <MoonIcon />,
    },
  ] as const;

  return (
    <div
      className="control-group"
      role="group"
      aria-label={lang === 'pt' ? 'Seletor de tema' : 'Theme selector'}
    >
      {options.map(option => {
        const active = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setTheme(option.value)}
            className={`control-button ${active ? 'control-button-active' : ''}`}
            aria-pressed={active}
          >
            <span className={`theme-icon ${active ? 'theme-icon-active' : ''}`}>
              {option.icon}
            </span>
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
