import type { Command } from '../commands';

export interface HistoryInput {
  type: 'input';
  text: string;
}

export interface HistoryOutput {
  type: 'output';
  text: string;
}

export interface HistoryError {
  type: 'error';
  cmd: string;
  message: string;
}

export interface HistoryMarkdown {
  type: 'markdown';
  html: string;
}

export interface HistoryHelp {
  type: 'help';
  cmd: Command;
  description: string;
  usage: string;
}

export type HistoryItem =
  | HistoryInput
  | HistoryOutput
  | HistoryError
  | HistoryMarkdown
  | HistoryHelp;
