import type { Dispatch, SetStateAction } from 'react';
import type { Language } from '../context/LanguageContext';
import type { ProfileContent } from '../content/profile';
import type { ProjectContent } from '../content/projects';
import type { ProjectRepo } from '../features/projects/projectsService';

export type SupportedLocale = Language;

export interface LocalizedText {
  en: string;
  pt: string;
}

export interface CommandParsingOptions {
  booleanFlags?: readonly string[];
  valueFlags?: readonly string[];
}

export interface CommandMeta {
  name: string;
  category: string;
  description: LocalizedText;
  usage: LocalizedText;
  parsing?: CommandParsingOptions;
  surfaces?: {
    help?: boolean;
    ls?: boolean;
    search?: boolean;
  };
}

export interface ParsedCommandInput {
  raw: string;
  normalized: string;
  commandName: string;
  argv: string[];
  positionals: string[];
  flags: Record<string, string | boolean>;
  tokenizationError: string | null;
}

export type CommandParseResult<TArgs> =
  | {
      ok: true;
      args: TArgs;
    }
  | {
      ok: false;
      message: string;
    };

export interface HelpListItem {
  command: string;
  description: string;
  usage: string;
}

export interface RecordListEntry {
  title: string;
  meta?: string;
  subtitle?: string;
  lines?: string[];
  href?: string;
}

export interface TextBlock {
  type: 'text';
  text: string;
}

export interface HelpListBlock {
  type: 'helpList';
  title: string;
  items: HelpListItem[];
}

export interface RecordListBlock {
  type: 'recordList';
  title?: string;
  records: RecordListEntry[];
}

export interface MarkdownBlock {
  type: 'markdown';
  html: string;
}

export interface ErrorBlock {
  type: 'error';
  command?: string;
  message: string;
}

export interface SystemBlock {
  type: 'system';
  text: string;
}

export type TerminalBlock =
  | TextBlock
  | HelpListBlock
  | RecordListBlock
  | MarkdownBlock
  | ErrorBlock
  | SystemBlock;

export interface HistoryInput {
  type: 'input';
  text: string;
}

export interface HistoryOutput {
  type: 'output';
  blocks: TerminalBlock[];
}

export type HistoryItem = HistoryInput | HistoryOutput;

export interface CommandEffectClearHistory {
  type: 'clearHistory';
}

export type CommandEffect = CommandEffectClearHistory;

export interface CommandExecutionResult {
  blocks: TerminalBlock[];
  effects?: CommandEffect[];
  echoInput?: boolean;
}

export interface CommandContext {
  lang: SupportedLocale;
  shellMessages: {
    notFoundMessage: string;
  };
  history: HistoryItem[];
  setHistory: Dispatch<SetStateAction<HistoryItem[]>>;
  content: {
    profile: ProfileContent | null;
    projects: ProjectContent | null;
    narrative: unknown;
    timeline: unknown;
  };
  projectCatalog: {
    repos: ProjectRepo[];
    loading: boolean;
    error: string | null;
  };
  searchIndex: {
    ready: boolean;
    records: unknown[];
  };
  services: Record<string, never>;
  registry: CommandRegistryLike;
}

export interface CommandDefinition<
  TArgs = unknown,
  TTranslations extends Record<SupportedLocale, Record<string, unknown>> = Record<
    SupportedLocale,
    Record<string, unknown>
  >,
> {
  meta: CommandMeta;
  translations: TTranslations;
  parse: (
    input: ParsedCommandInput,
    context: CommandContext
  ) => CommandParseResult<TArgs>;
  execute: (
    args: TArgs,
    context: CommandContext,
    input: ParsedCommandInput
  ) => Promise<CommandExecutionResult> | CommandExecutionResult;
}

export type AnyCommandDefinition = CommandDefinition<
  any,
  Record<SupportedLocale, Record<string, unknown>>
>;

export interface CommandRegistryLike {
  get(name: string): AnyCommandDefinition | undefined;
  list(surface?: keyof NonNullable<CommandMeta['surfaces']>): AnyCommandDefinition[];
}
