import { describe, expect, it } from 'vitest';

describe('test setup', () => {
  it('can write to localStorage within a test', () => {
    window.localStorage.setItem('lang', 'pt');

    expect(window.localStorage.getItem('lang')).toBe('pt');
  });

  it('clears localStorage before each test', () => {
    expect(window.localStorage.getItem('lang')).toBeNull();
  });

  it('fails fast when a test fetches an unmocked URL', async () => {
    await expect(fetch('https://example.test/unmocked')).rejects.toThrow(
      'Unexpected fetch request in test setup: https://example.test/unmocked'
    );
  });

  it('keeps the shared GitHub endpoint stubs available', async () => {
    const response = await fetch('https://api.github.com/users/jozanardo/repos');

    await expect(response.json()).resolves.toEqual([]);
  });
});
