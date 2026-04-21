import type { CommandEffect, HistoryItem } from '../../types';

export function applyCommandEffects(
  history: HistoryItem[],
  effects: CommandEffect[] = []
): HistoryItem[] {
  return effects.reduce((currentHistory, effect) => {
    if (effect.type === 'clearHistory') {
      return [];
    }

    return currentHistory;
  }, history);
}
