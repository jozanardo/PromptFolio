export enum Command {
  HELP     = 'help',
  LS       = 'ls',
  WHOAMI   = 'whoami',
  ABOUT    = 'about',
  SKILLS   = 'skills',
  PROJECTS = 'projects',
  CONTACT  = 'contact',
  CLEAR    = 'clear',
}

export interface CommandMetaType {
  description: string;
  usage: string;
}

export const commandMetaEntries = [
  [Command.HELP, { 
    description: 'Lista todos os comandos disponíveis.', 
    usage: 'help',
  }],
  [Command.LS, {
    description: 'Lista todos os comandos disponíveis.',
    usage: 'help',
  }],
  [Command.WHOAMI, {
    description: 'Quem sou eu.',
    usage: 'whoami',
  }],
  [Command.ABOUT, {
    description: 'Saiba mais sobre mim.',
    usage: 'about',
  }],
  [Command.SKILLS, {
    description: 'Quais tecnologias eu uso.',
    usage: 'skills',
  }],
  [Command.PROJECTS, {
    description:
      'Veja meus projetos (use filtros: [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>]).',
    usage: 'projects [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>]',
  }],
  [Command.CONTACT, {
    description: 'Quer dizer algo?',
    usage: 'contact',
  }],
  [Command.CLEAR, {
    description: 'Limpa o histórico (header fixo).',
    usage: 'clear',
  }],
] as const satisfies readonly (readonly [Command, CommandMetaType])[]; 

export const CommandMeta = new Map<Command, CommandMetaType>(commandMetaEntries);

export const CommandList = Array.from(CommandMeta.keys()) as Command[];

export function isCommand(cmd: string): cmd is Command {
  return CommandList.includes(cmd as Command);
}
