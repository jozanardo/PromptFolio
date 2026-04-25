import { clearCommand } from './clear';
import { helpCommand } from './help';
import { legacyCommands } from './legacy';
import { lsCommand } from './ls';
import { createCommandRegistry } from './runtime/commandRegistry';
import { startCommand } from './start';

export const commandRegistry = createCommandRegistry([
  startCommand,
  helpCommand,
  lsCommand,
  ...legacyCommands,
  clearCommand,
]);

export const CommandList = commandRegistry.list().map(
  definition => definition.meta.name
);

export function isCommand(cmd: string): boolean {
  return commandRegistry.get(cmd) !== undefined;
}
