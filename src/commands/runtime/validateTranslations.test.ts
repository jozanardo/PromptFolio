import { describe, expect, it } from 'vitest';
import { validateTranslations } from './validateTranslations';

describe('validateTranslations', () => {
  it('accepts translation objects with matching locale coverage', () => {
    expect(() =>
      validateTranslations('help', {
        en: {
          title: 'Help',
          sections: {
            intro: 'Available commands',
          },
        },
        pt: {
          title: 'Ajuda',
          sections: {
            intro: 'Comandos disponíveis',
          },
        },
      })
    ).not.toThrow();
  });

  it('throws when a locale is missing a nested key', () => {
    expect(() =>
      validateTranslations('help', {
        en: {
          title: 'Help',
          sections: {
            intro: 'Available commands',
          },
        },
        pt: {
          title: 'Ajuda',
          sections: {},
        },
      })
    ).toThrow("Missing translation key 'sections.intro' for locale 'pt' in command 'help'.");
  });

  it('throws when a locale changes the primitive value type', () => {
    expect(() =>
      validateTranslations('help', {
        en: {
          title: 'Help',
          usage: 'help',
        },
        pt: {
          title: 123 as any,
          usage: 'help',
        },
      } as any)
    ).toThrow(
      "Translation value type mismatch at 'title' for locale 'pt' in command 'help'."
    );
  });

  it('throws a type mismatch when a nested object is replaced with a primitive', () => {
    expect(() =>
      validateTranslations('help', {
        en: {
          title: 'Help',
          sections: {
            intro: 'Available commands',
          },
        },
        pt: {
          title: 'Ajuda',
          sections: 'broken' as any,
        },
      } as any)
    ).toThrow(
      "Translation value type mismatch at 'sections' for locale 'pt' in command 'help'."
    );
  });
});
