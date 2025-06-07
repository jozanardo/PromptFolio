import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n';
import { CommandMeta } from '../../commands';

export function useHelp() {
  const { lang } = useLanguage();
  const t = translations[lang];

  function getHelpLines(): string[] {
    const lines: string[] = [t.helpTitle];

    for (const [cmd, meta] of CommandMeta.entries()) {
      lines.push(`  ${cmd.padEnd(12)} - ${meta.description}`);
      lines.push(`    ${t.usageLabel}: ${meta.usage}`);
    }

    return lines;
  }

  return { getHelpLines };
}
