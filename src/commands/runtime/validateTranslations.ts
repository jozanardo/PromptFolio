import type { SupportedLocale } from '../../types';

const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'pt'];

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPrimitive(value: unknown): value is string | number | boolean | bigint | symbol | null | undefined {
  return !isObjectLike(value) && !Array.isArray(value);
}

function typeMismatchMessage(
  commandName: string,
  locale: SupportedLocale,
  keyPath: string
) {
  return `Translation value type mismatch at '${keyPath}' for locale '${locale}' in command '${commandName}'.`;
}

function missingTranslationMessage(
  commandName: string,
  locale: SupportedLocale,
  keyPath: string
) {
  return `Missing translation key '${keyPath}' for locale '${locale}' in command '${commandName}'.`;
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
        candidateValue === undefined
          ? missingTranslationMessage(commandName, locale, keyPath)
          : typeMismatchMessage(commandName, locale, keyPath)
      );
    }

    if (candidateValue.length < baseValue.length) {
      throw new Error(
        missingTranslationMessage(commandName, locale, keyPath)
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
        candidateValue === undefined
          ? missingTranslationMessage(commandName, locale, keyPath)
          : typeMismatchMessage(commandName, locale, keyPath)
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

  if (isPrimitive(baseValue)) {
    if (candidateValue === undefined) {
      throw new Error(
        missingTranslationMessage(commandName, locale, keyPath)
      );
    }

    if (typeof candidateValue !== typeof baseValue) {
      throw new Error(typeMismatchMessage(commandName, locale, keyPath));
    }
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
