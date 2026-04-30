import { describe, expect, it } from 'vitest';
import { parseCommandInput } from './parseCommandInput';

describe('parseCommandInput', () => {
  it('parses named flags and quoted values', () => {
    const parsed = parseCommandInput(
      'work --lang=TypeScript --name "Prompt Folio"',
      {
        booleanFlags: ['help', 'list-langs'],
        valueFlags: ['lang', 'desc', 'name'],
      }
    );

    expect(parsed.commandName).toBe('work');
    expect(parsed.argv).toEqual(['--lang=TypeScript', '--name', 'Prompt Folio']);
    expect(parsed.flags).toEqual({
      lang: 'TypeScript',
      name: 'Prompt Folio',
    });
    expect(parsed.positionals).toEqual([]);
    expect(parsed.tokenizationError).toBeNull();
  });

  it('parses positional arguments and boolean flags', () => {
    const parsed = parseCommandInput('search "machine learning" --featured', {
      booleanFlags: ['featured'],
    });

    expect(parsed.commandName).toBe('search');
    expect(parsed.positionals).toEqual(['machine learning']);
    expect(parsed.flags).toEqual({ featured: true });
    expect(parsed.tokenizationError).toBeNull();
  });

  it('keeps declared boolean flags boolean when followed by positionals', () => {
    const parsed = parseCommandInput('work --help extra', {
      booleanFlags: ['help', 'list-langs'],
      valueFlags: ['lang', 'desc', 'name'],
    });

    expect(parsed.flags).toEqual({ help: true });
    expect(parsed.positionals).toEqual(['extra']);
  });

  it('captures tokenization errors for unclosed quotes', () => {
    const parsed = parseCommandInput('work --name "Prompt Folio');

    expect(parsed.commandName).toBe('work');
    expect(parsed.tokenizationError).toBe('Unclosed quote in command input.');
  });
});
