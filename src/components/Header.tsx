import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n';

export default function Header() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <header className="max-w-3xl text-left">
      <div className="space-y-4">
        <p className="max-w-2xl text-lg leading-8 text-primary md:text-[1.35rem] md:leading-9">
          {t.welcome}
        </p>

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
