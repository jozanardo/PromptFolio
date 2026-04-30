import { aboutCommand } from './about';
import { archiveCommand } from './archive';
import { clearCommand } from './clear';
import { contactCommand } from './contact';
import { helpCommand } from './help';
import { lsCommand } from './ls';
import { createCommandRegistry } from './runtime/commandRegistry';
import { skillsCommand } from './skills';
import { startCommand } from './start';
import { whoamiCommand } from './whoami';
import { workCommand } from './work';

export const commandRegistry = createCommandRegistry([
  startCommand,
  helpCommand,
  lsCommand,
  whoamiCommand,
  aboutCommand,
  skillsCommand,
  workCommand,
  archiveCommand,
  contactCommand,
  clearCommand,
]);

export const CommandList = commandRegistry.list().map(
  definition => definition.meta.name
);

export function isCommand(cmd: string): boolean {
  return commandRegistry.get(cmd) !== undefined;
}
