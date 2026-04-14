import { useLanguage } from '../context/LanguageContext';
import { useTerminal } from '../context/TerminalContext';
import { translations } from '../i18n';

interface HeaderProps {
  isContentVisible: boolean;
  isPromptVisible: boolean;
}

export default function Header({
  isContentVisible,
  isPromptVisible,
}: HeaderProps) {
  const { lang } = useLanguage();
  const { setInput, inputRef } = useTerminal();
  const t = translations[lang];

  const handleQuickStart = (command: string) => {
    if (!isContentVisible || !isPromptVisible) {
      return;
    }

    setInput(command);
    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(command.length, command.length);
    });
  };

  return (
    <header className="max-w-[38rem] text-left">
      <div className="space-y-8">
        <div
          className={`space-y-4 transition-[opacity,transform] duration-500 ease-out motion-reduce:transform-none ${
            isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <div className="eyebrow">{t.eyebrowLabel}</div>

          <p className="max-w-2xl text-[1.35rem] leading-8 text-primary md:text-[1.65rem] md:leading-10">
            {t.welcome}
          </p>

          <p className="max-w-[34rem] text-sm leading-7 text-muted md:text-base">
            {t.intro}
          </p>
        </div>

        <div
          aria-hidden={!isContentVisible}
          className={`space-y-3 transition-[opacity,transform] duration-500 delay-75 ease-out motion-reduce:transform-none ${
            isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <p className="text-[0.78rem] uppercase tracking-[0.16em] text-muted">
            {t.guidance}
          </p>

          <div className="flex flex-wrap gap-2">
            {t.quickStartCommands.map(command => (
              <button
                key={command}
                type="button"
                onClick={() => handleQuickStart(command)}
                className="quick-command"
                aria-label={`${t.fillPromptAriaLabel} ${command}`}
                disabled={!isContentVisible || !isPromptVisible}
                tabIndex={isContentVisible && isPromptVisible ? 0 : -1}
              >
                <span className="quick-command-glyph">{'>'}</span>
                <span>{command}</span>
              </button>
            ))}
          </div>
        </div>

        <div
          aria-hidden={!isPromptVisible}
          className={`inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-subtle bg-surface-2 px-3 py-2 text-[0.82rem] text-soft transition-[opacity,transform] duration-500 delay-150 ease-out motion-reduce:transform-none ${
            isPromptVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
          }`}
        >
          <span>{t.promptPre}</span>
          <span className="rounded-full bg-accent-soft px-2 py-0.5 text-primary">
            {t.promptCmd}
          </span>
          <span>{t.promptPost}</span>
        </div>
      </div>
    </header>
  );
}
