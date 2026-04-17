import type { SupportedLocale } from '../../types';

const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'pt'];

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function walkLocaleShape(
  commandName: string,
  locale: SupportedLocale,
  baseValue: unknown,
  candidateValue: unknown,
  path: string[] = []
) {
  const keyPath = path.join('.');

  if (Array.isArray(baseValue)) {
    if (!Array.isArray(candidateValue)) {
      throw new Error(
        `Missing translation key '${keyPath}' for locale '${locale}' in command '${commandName}'.`
      );
    }

    if (candidateValue.length < baseValue.length) {
      throw new Error(
        `Missing translation key '${keyPath}' for locale '${locale}' in command '${commandName}'.`
      );
    }

    baseValue.forEach((item, index) => {
      walkLocaleShape(
        commandName,
        locale,
        item,
        candidateValue[index],
        [...path, String(index)]
      );
    });

    return;
  }

  if (isObjectLike(baseValue)) {
    if (!isObjectLike(candidateValue)) {
      throw new Error(
        `Missing translation key '${keyPath}' for locale '${locale}' in command '${commandName}'.`
      );
    }

    Object.entries(baseValue).forEach(([key, nestedValue]) => {
      walkLocaleShape(
        commandName,
        locale,
        nestedValue,
        candidateValue[key],
        [...path, key]
      );
    });

    return;
  }

  if (candidateValue === undefined) {
    throw new Error(
      `Missing translation key '${keyPath}' for locale '${locale}' in command '${commandName}'.`
    );
  }
}

export function validateTranslations<
  TTranslations extends Record<SupportedLocale, Record<string, unknown>>,
>(commandName: string, translations: TTranslations): TTranslations {
  const baseLocale = SUPPORTED_LOCALES[0];
  const baseShape = translations[baseLocale];

  SUPPORTED_LOCALES.slice(1).forEach(locale => {
    walkLocaleShape(commandName, locale, baseShape, translations[locale]);
  });

  return translations;
}
