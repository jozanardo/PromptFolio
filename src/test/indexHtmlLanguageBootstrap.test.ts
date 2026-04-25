import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { describe, expect, it } from 'vitest';

function renderIndexWithLanguage({
  storedLang,
  navigatorLanguage,
  storageThrows = false,
}: {
  storedLang?: string;
  navigatorLanguage: string;
  storageThrows?: boolean;
}) {
  const html = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8');

  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'https://promptfolio.test/',
    beforeParse(window) {
      Object.defineProperty(window.navigator, 'language', {
        configurable: true,
        value: navigatorLanguage,
      });

      if (storageThrows) {
        Object.defineProperty(window, 'localStorage', {
          configurable: true,
          get() {
            throw new Error('Storage unavailable');
          },
        });
        return;
      }

      if (storedLang) {
        window.localStorage.setItem('lang', storedLang);
      }
    },
  });

  return dom.window.document.documentElement.lang;
}

describe('index.html language bootstrap', () => {
  it('uses the stored language before React mounts', () => {
    expect(
      renderIndexWithLanguage({
        storedLang: 'pt',
        navigatorLanguage: 'en-US',
      })
    ).toBe('pt');
  });

  it('falls back to browser Portuguese when no stored language exists', () => {
    expect(
      renderIndexWithLanguage({
        navigatorLanguage: 'pt-BR',
      })
    ).toBe('pt');
  });

  it('keeps the English fallback when storage is unavailable', () => {
    expect(
      renderIndexWithLanguage({
        navigatorLanguage: 'en-US',
        storageThrows: true,
      })
    ).toBe('en');
  });
});
