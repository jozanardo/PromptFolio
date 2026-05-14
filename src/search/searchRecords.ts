import { normalizeForSearch, tokenizeSearchQuery } from './normalize';
import type { SearchQuery, SearchRecord, SearchResult } from './types';

function fieldIncludes(values: readonly string[], term: string): boolean {
  return values.some(value => normalizeForSearch(value).includes(term));
}

function scoreRecord(
  record: SearchRecord,
  terms: readonly string[]
): SearchResult | null {
  let score = 0;
  const matchedTerms: string[] = [];

  terms.forEach(term => {
    let termScore = 0;
    const title = normalizeForSearch(record.title);

    if (title === term) {
      termScore += 20;
    } else if (title.includes(term)) {
      termScore += 12;
    }

    if (fieldIncludes(record.keywords, term)) {
      termScore += 10;
    }

    if (fieldIncludes([record.subtitle, record.meta ?? '', ...record.body], term)) {
      termScore += 4;
    }

    if (termScore > 0) {
      matchedTerms.push(term);
      score += termScore;
    }
  });

  if (matchedTerms.length === 0) {
    return null;
  }

  return {
    ...record,
    score: score + record.weight,
    matchedTerms,
  };
}

export function searchRecords(
  records: readonly SearchRecord[],
  query: SearchQuery
): SearchResult[] {
  const terms = tokenizeSearchQuery(query.text);

  if (terms.length === 0) {
    return [];
  }

  return records
    .filter(record => !query.type || record.kind === query.type)
    .map(record => scoreRecord(record, terms))
    .filter((result): result is SearchResult => result !== null)
    .sort((left, right) => {
      if (right.matchedTerms.length !== left.matchedTerms.length) {
        return right.matchedTerms.length - left.matchedTerms.length;
      }

      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.title.localeCompare(right.title);
    })
    .slice(0, query.limit);
}
