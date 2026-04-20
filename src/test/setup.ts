import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

const storage = new Map<string, string>();

if (
  typeof window !== 'undefined' &&
  typeof window.localStorage?.getItem !== 'function'
) {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => {
        storage.clear();
      },
    },
  });
}

beforeEach(() => {
  storage.clear();
});
