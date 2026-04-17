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
});
