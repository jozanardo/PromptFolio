import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n';

export default function Header() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <header className="mb-4 text-center">
      <h1 className="text-accent neon-accent text-2xl md:text-4xl font-bold">
        JOÃO ZANARDO
      </h1>
      <p>{t.welcome}</p>
      <p className="mt-1">
        {t.promptPre}
        <span className="text-accent neon-accent font-bold">
          '{t.promptCmd}'
        </span>
        {t.promptPost}
      </p>
    </header>
  );
}
