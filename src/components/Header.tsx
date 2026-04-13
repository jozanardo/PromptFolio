import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n';

export default function Header() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <header className="max-w-3xl text-left">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="max-w-2xl text-lg leading-8 text-primary md:text-[1.35rem] md:leading-9">
            {t.welcome}
          </p>

          <p className="max-w-3xl text-sm leading-7 text-muted md:text-base">
            {t.intro}
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-[0.82rem] uppercase tracking-[0.16em] text-muted">
            {t.guidance}
          </p>

          <div className="flex flex-wrap gap-2">
            {t.quickStartCommands.map(command => (
              <span
                key={command}
                className="inline-flex items-center rounded-full border border-subtle bg-surface-2 px-3 py-1.5 text-[0.82rem] text-primary"
              >
                <span className="mr-2 text-accent">{'>'}</span>
                <span>{command}</span>
              </span>
            ))}
          </div>
        </div>

        <div className="inline-flex max-w-full flex-wrap items-center gap-2 rounded-full border border-subtle bg-surface-2 px-3 py-2 text-[0.82rem] text-soft">
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
