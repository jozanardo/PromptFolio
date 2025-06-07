import { useLanguage } from '../context/LanguageContext';
import usFlag from '../assets/flags/us.png';
import brFlag from '../assets/flags/br.png';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  const base = 'w-8 h-6 cursor-pointer transition-opacity';
  return (
    <div className="flex space-x-2">
      <img
        src={usFlag}
        alt="English"
        onClick={() => setLang('en')}
        className={
          lang === 'en'
            ? `${base} opacity-100 ring-2 ring-blue-500 rounded-sm`
            : `${base} opacity-50 hover:opacity-80`
        }
      />
      <img
        src={brFlag}
        alt="Português"
        onClick={() => setLang('pt')}
        className={
          lang === 'pt'
            ? `${base} opacity-100 ring-2 ring-green-500 rounded-sm`
            : `${base} opacity-50 hover:opacity-80`
        }
      />
    </div>
  );
}
