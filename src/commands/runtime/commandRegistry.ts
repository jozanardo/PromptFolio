import type {
  AnyCommandDefinition,
  CommandMeta,
  CommandRegistryLike,
} from '../../types';
import { validateTranslations } from './validateTranslations';

export interface CommandRegistry extends CommandRegistryLike {}

function shouldIncludeOnSurface(
  meta: CommandMeta,
  surface?: keyof NonNullable<CommandMeta['surfaces']>
): boolean {
  if (!surface) {
    return true;
  }

  return meta.surfaces?.[surface] ?? false;
}

export function createCommandRegistry(
  definitions: readonly AnyCommandDefinition[]
): CommandRegistry {
  const map = new Map<string, AnyCommandDefinition>();

  definitions.forEach(definition => {
    const name = definition.meta.name.toLowerCase();

    if (map.has(name)) {
      throw new Error(`Duplicate command definition for '${name}'.`);
    }

    validateTranslations(name, definition.translations);
    map.set(name, definition);
  });

  return {
    get(name: string) {
      return map.get(name.toLowerCase());
    },
    list(surface) {
      return definitions.filter(definition =>
        shouldIncludeOnSurface(definition.meta, surface)
      ) as AnyCommandDefinition[];
    },
  };
}
