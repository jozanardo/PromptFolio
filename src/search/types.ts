import type { SupportedLocale } from '../types';

export type SearchRecordKind =
  | 'command'
  | 'project'
  | 'timeline'
  | 'journey'
  | 'profile'
  | 'narrative'
  | 'contact';

export interface SearchRecord {
  id: string;
  kind: SearchRecordKind;
  locale: SupportedLocale;
  title: string;
  subtitle: string;
  command: string;
  meta?: string;
  href?: string;
  keywords: string[];
  body: string[];
  weight: number;
}

export interface SearchQuery {
  text: string;
  type: SearchRecordKind | null;
  limit: number;
}

export interface SearchResult extends SearchRecord {
  score: number;
  matchedTerms: string[];
}

export const searchRecordKinds: readonly SearchRecordKind[] = [
  'command',
  'project',
  'timeline',
  'journey',
  'profile',
  'narrative',
  'contact',
];
