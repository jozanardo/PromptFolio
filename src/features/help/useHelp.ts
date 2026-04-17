import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n';
import { commandRegistry } from '../../commands';

export function useHelp() {
  const { lang } = useLanguage();
  const t = translations[lang];

  function getHelpLines(): string[] {
    const lines: string[] = [t.helpTitle];

    commandRegistry.list('help').forEach(definition => {
      lines.push(
        `  ${definition.meta.name.padEnd(12)} - ${
          definition.meta.description[lang]
        }`
      );
      lines.push(`    ${t.usageLabel}: ${definition.meta.usage[lang]}`);
    });

    return lines;
  }

  return { getHelpLines };
}
