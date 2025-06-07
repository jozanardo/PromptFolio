import { Command, CommandMeta } from '../../commands';

/**
 * Hook que retorna as linhas de ajuda formatadas para exibir no terminal.
 */
export function useHelp() {
  const commands = Object.values(Command);

  function getHelpLines() {
    const lines = ['Comandos disponíveis:'];
    commands.forEach(cmd => {
      const meta = CommandMeta[cmd];
      lines.push(`  ${cmd.padEnd(12)} - ${meta.description}`);
      lines.push(`    Uso: ${meta.usage}`);
    });
    return lines;
  }

  return { getHelpLines };
}
