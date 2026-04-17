import { clearCommand } from './clear';
import { helpCommand } from './help';
import { legacyCommands } from './legacy';
import { createCommandRegistry } from './runtime/commandRegistry';

export const commandRegistry = createCommandRegistry([
  helpCommand,
  ...legacyCommands,
  clearCommand,
]);

export const CommandList = commandRegistry.list().map(
  definition => definition.meta.name
);

export function isCommand(cmd: string): boolean {
  return commandRegistry.get(cmd) !== undefined;
}
