/**
 * Faz o parse de uma string de comando em:
 *  - command: nome do comando
 *  - args: array de argumentos posicionais
 *  - options: mapa de flags (--key=value ou --flag)
 *  - raw: string original
 * @param {string} input  
 * @returns {{ command: string, args: string[], options: Record<string, string|boolean>, raw: string }}
 */
export function parseCommand(input) {
  const raw = input;
  const tokens = input.trim().split(/\s+/);
  const command = tokens.shift() || '';
  const args = [];
  const options = {};

  tokens.forEach(token => {
    if (token.startsWith('--')) {
      const [key, ...rest] = token.slice(2).split('=');
      options[key] = rest.length > 0 ? rest.join('=') : true;
    } else {
      args.push(token);
    }
  });

  return { command, args, options, raw };
}
