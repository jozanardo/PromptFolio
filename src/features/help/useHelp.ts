import { CommandMeta } from '../../commands';

export function useHelp() {
  function getHelpLines(): string[] {
    const lines: string[] = ['Comandos disponíveis:'];
    for (const [cmd, meta] of CommandMeta.entries()) {
      lines.push(`  ${cmd.padEnd(12)} - ${meta.description}`);
      lines.push(`    Uso: ${meta.usage}`);
    }
    return lines;
  }

  return { getHelpLines };
}
