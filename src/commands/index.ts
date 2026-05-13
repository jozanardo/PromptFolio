import { aboutCommand } from './about';
import { archiveCommand } from './archive';
import { clearCommand } from './clear';
import { contactCommand } from './contact';
import { helpCommand } from './help';
import { journeyCommand } from './journey';
import { lsCommand } from './ls';
import { nowCommand } from './now';
import { philosophyCommand } from './philosophy';
import { searchCommand } from './search';
import { createCommandRegistry } from './runtime/commandRegistry';
import { skillsCommand } from './skills';
import { startCommand } from './start';
import { timelineCommand } from './timeline';
import { whoamiCommand } from './whoami';
import { workCommand } from './work';

export const commandRegistry = createCommandRegistry([
  startCommand,
  helpCommand,
  lsCommand,
  searchCommand,
  whoamiCommand,
  aboutCommand,
  skillsCommand,
  workCommand,
  archiveCommand,
  timelineCommand,
  journeyCommand,
  nowCommand,
  philosophyCommand,
  contactCommand,
  clearCommand,
]);

export const CommandList = commandRegistry.list().map(
  definition => definition.meta.name
);

export function isCommand(cmd: string): boolean {
  return commandRegistry.get(cmd) !== undefined;
}
