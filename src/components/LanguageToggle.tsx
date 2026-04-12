import { useLanguage } from '../context/LanguageContext';

const options = [
  { value: 'pt', label: 'PT' },
  { value: 'en', label: 'EN' },
] as const;

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="control-group"
      role="group"
      aria-label="Language selector"
    >
      {options.map(option => {
        const active = lang === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLang(option.value)}
            className={`control-button ${active ? 'control-button-active' : ''}`}
            aria-pressed={active}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
