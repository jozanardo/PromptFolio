export function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function tokenizeSearchQuery(query: string): string[] {
  const seen = new Set<string>();

  return normalizeForSearch(query)
    .split(' ')
    .filter(Boolean)
    .filter(term => {
      if (seen.has(term)) {
        return false;
      }

      seen.add(term);
      return true;
    });
}
