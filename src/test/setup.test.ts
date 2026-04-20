import { describe, expect, it } from 'vitest';

describe('test setup', () => {
  it('can write to localStorage within a test', () => {
    window.localStorage.setItem('lang', 'pt');

    expect(window.localStorage.getItem('lang')).toBe('pt');
  });

  it('clears localStorage before each test', () => {
    expect(window.localStorage.getItem('lang')).toBeNull();
  });
});
