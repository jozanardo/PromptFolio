import { describe, expect, it } from 'vitest';
import { parseCommandInput } from './parseCommandInput';

describe('parseCommandInput', () => {
  it('parses named flags and quoted values', () => {
    const parsed = parseCommandInput(
      'projects --lang=TypeScript --name "Prompt Folio"'
    );

    expect(parsed.commandName).toBe('projects');
    expect(parsed.argv).toEqual(['--lang=TypeScript', '--name', 'Prompt Folio']);
    expect(parsed.flags).toEqual({
      lang: 'TypeScript',
      name: 'Prompt Folio',
    });
    expect(parsed.positionals).toEqual([]);
    expect(parsed.tokenizationError).toBeNull();
  });

  it('parses positional arguments and boolean flags', () => {
    const parsed = parseCommandInput('search "machine learning" --featured');

    expect(parsed.commandName).toBe('search');
    expect(parsed.positionals).toEqual(['machine learning']);
    expect(parsed.flags).toEqual({ featured: true });
    expect(parsed.tokenizationError).toBeNull();
  });

  it('captures tokenization errors for unclosed quotes', () => {
    const parsed = parseCommandInput('projects --name "Prompt Folio');

    expect(parsed.commandName).toBe('projects');
    expect(parsed.tokenizationError).toBe('Unclosed quote in command input.');
  });
});
