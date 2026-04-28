import { aboutCommand } from './about';
import { clearCommand } from './clear';
import { contactCommand } from './contact';
import { helpCommand } from './help';
import { legacyCommands } from './legacy';
import { lsCommand } from './ls';
import { createCommandRegistry } from './runtime/commandRegistry';
import { skillsCommand } from './skills';
import { startCommand } from './start';
import { whoamiCommand } from './whoami';

export const commandRegistry = createCommandRegistry([
  startCommand,
  helpCommand,
  lsCommand,
  whoamiCommand,
  aboutCommand,
  skillsCommand,
  ...legacyCommands,
  contactCommand,
  clearCommand,
]);

export const CommandList = commandRegistry.list().map(
  definition => definition.meta.name
);

export function isCommand(cmd: string): boolean {
  return commandRegistry.get(cmd) !== undefined;
}
