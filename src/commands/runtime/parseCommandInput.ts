import type { ParsedCommandInput } from '../../types';

interface TokenizeResult {
  tokens: string[];
  error: string | null;
}

function tokenize(input: string): TokenizeResult {
  const tokens: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];

    if (quote) {
      if (char === quote) {
        quote = null;
        continue;
      }

      if (char === '\\' && index + 1 < input.length) {
        current += input[index + 1];
        index += 1;
        continue;
      }

      current += char;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    if (char === '\\' && index + 1 < input.length) {
      current += input[index + 1];
      index += 1;
      continue;
    }

    current += char;
  }

  if (current) {
    tokens.push(current);
  }

  if (quote) {
    return {
      tokens,
      error: 'Unclosed quote in command input.',
    };
  }

  return { tokens, error: null };
}

export function parseCommandInput(rawInput: string): ParsedCommandInput {
  const normalized = rawInput.trim();
  const { tokens, error } = tokenize(normalized);
  const [commandName = '', ...argv] = tokens;
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      positionals.push(token);
      continue;
    }

    const body = token.slice(2);
    const equalIndex = body.indexOf('=');

    if (equalIndex >= 0) {
      const key = body.slice(0, equalIndex);
      const value = body.slice(equalIndex + 1);
      flags[key] = value;
      continue;
    }

    const nextToken = argv[index + 1];

    if (nextToken && !nextToken.startsWith('--')) {
      flags[body] = nextToken;
      index += 1;
      continue;
    }

    flags[body] = true;
  }

  return {
    raw: rawInput,
    normalized,
    commandName,
    argv,
    positionals,
    flags,
    tokenizationError: error,
  };
}
