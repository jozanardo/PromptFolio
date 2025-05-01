import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import repositories from './../github_repos.json';

const COMMANDS = {
  help: {
    description: 'Lista todos os comandos disponíveis.',
    usage: 'help',
  },
  ls: {
    description: 'Lista todos os comandos disponíveis.',
    usage: 'help',
  },
  whoami: {
    description: 'Quem sou eu.',
    usage: 'whoami',
  },
  about: {
    description: 'Saiba mais sobre mim.',
    usage: 'about',
  },
  skills: {
    description: 'Quais tecnologias eu uso.',
    usage: 'skills',
  },
  projects: {
    description: 'Veja meus projetos (use filtros: [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>]).',
    usage: 'projects [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>]',
  },
  contact: {
    description: 'Quer dizer algo?',
    usage: 'contact',
  },
  clear: {
    description: 'Limpa o histórico (header fixo).',
    usage: 'clear',
  },
};

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const endOfTerminalRef = useRef(null);

  // Scroll automático ao final sempre que history muda
  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Auto-focus no input ao montar
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processCommand = commandInput => {
    const [command, ...args] = commandInput.trim().split(/\s+/);

    // clear: limpa só o histórico dinâmico
    if (command === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    // adiciona a linha de input
    setHistory(prev => [
      ...prev,
      { type: 'input', text: commandInput },
    ]);

    // comando não reconhecido
    if (!Object.hasOwn(COMMANDS, command)) {
      setHistory(prev => [
        ...prev,
        {
          type: 'error',
          cmd: command,
          message: "command not found. Type 'help' to view a list of available commands.",
        },
      ]);
      if (commandInput.trim()) {
        setCommandHistory(prev => [commandInput.trim(), ...prev]);
        setHistoryIndex(-1);
      }
      setInput('');
      return;
    }

    // comando válido: montar output
    let output = [];
    switch (command) {
      case 'help':
      case 'ls':
        output.push('Comandos disponíveis:');
        Object.entries(COMMANDS).forEach(([cmd, details]) => {
          output.push(`  ${cmd.padEnd(12)} `);
          output.push(`    - ${details.description}`);
        });
        break;

      case 'whoami':
        output.push('Sou João Zanardo, um desenvolvedor de software.');
        break;

      case 'about':
        output.push('Sobre mim:');
        output.push('Sou apaixonado por tecnologia e desenvolvimento de software.');
        output.push('Atualmente estudando Ciência da Computação na UFABC.');
        break;

      case 'skills':
        output.push('Minhas habilidades incluem:');
        output.push('- Linguagens: TypeScript, JavaScript, Python, Java, C#, Go, Haskell');
        output.push('- Frameworks/Libs: React, Node.js, NestJS, Next.js, Tailwind CSS');
        output.push('- Ferramentas: Git, Docker, Linux');
        break;

      case 'projects':
        // --- bloco de filtro e listagem de projects ---
        let langFilter = null,
            descFilter = null,
            nameFilter = null,
            showHelp = false,
            showLangs = false;

        for (const arg of args) {
          if (arg.startsWith('--lang=')) {
            langFilter = arg.split('=')[1].toLowerCase();
          } else if (arg.startsWith('--desc=')) {
            descFilter = arg.split('=')[1].toLowerCase();
          } else if (arg.startsWith('--name=')) {
            nameFilter = arg.split('=')[1].toLowerCase();
          } else if (arg === '--help') {
            output.push('Uso: projects [opções]');
            output.push('Opções:');
            output.push('  --lang=<linguagem>     Filtrar por linguagem');
            output.push('  --desc=<texto>         Filtrar por descrição');
            output.push('  --name=<nome>          Filtrar por nome');
            output.push('  --list-langs           Listar linguagens disponíveis');
            output.push('  --help                 Mostrar esta ajuda');
            showHelp = true;
            break;
          } else if (arg === '--list-langs') {
            const languages = [...new Set(
              repositories.map(r => r.language).filter(l => l != null)
            )].sort();
            output.push('Linguagens disponíveis:');
            languages.forEach(lang => {
              const count = repositories.filter(r => r.language === lang).length;
              output.push(`  ${lang} (${count} ${count === 1 ? 'projeto' : 'projetos'})`);
            });
            showLangs = true;
            break;
          }
        }
        if (showHelp || showLangs) break;

        // aplicar filtros
        let filtered = [...repositories];
        if (langFilter) {
          filtered = filtered.filter(r => r.language?.toLowerCase() === langFilter);
        }
        if (descFilter) {
          filtered = filtered.filter(r =>
            r.description?.toLowerCase().includes(descFilter)
          );
        }
        if (nameFilter) {
          filtered = filtered.filter(r =>
            r.name.toLowerCase().includes(nameFilter)
          );
        }

        if (langFilter || descFilter || nameFilter) {
          const parts = [];
          if (langFilter) parts.push(`linguagem: ${langFilter}`);
          if (descFilter) parts.push(`descrição: "${descFilter}"`);
          if (nameFilter) parts.push(`nome: "${nameFilter}"`);
          output.push(`Projetos filtrados por ${parts.join(', ')}:`);
        } else {
          output.push('Todos os projetos:');
        }

        if (filtered.length) {
          output.push(`Encontrados ${filtered.length} ${filtered.length === 1 ? 'projeto' : 'projetos'}`);
          filtered.forEach((r, i) => {
            output.push(`\n[${i + 1}] ${r.name} (${r.language || 'N/A'})`);
            if (r.description) output.push(`    Descrição: ${r.description}`);
            output.push(`    URL: ${r.html_url}`);
            output.push(`    Atualizado em: ${new Date(r.updated_at).toLocaleDateString()}`);
          });
        } else {
          output.push('Nenhum projeto encontrado com os filtros informados.');
        }

        output.push('');
        output.push('Dicas de uso:');
        output.push('  projects --lang=TypeScript     # filtrar por linguagem');
        output.push('  projects --desc=api            # filtrar por texto');
        output.push('  projects --name=ignite         # filtrar por nome');
        output.push('  projects --list-langs          # listar linguagens');
        output.push('  projects --help                # mostrar ajuda');
        break;

      case 'contact':
        output.push('Entre em contato:');
        output.push('- GitHub: https://github.com/jozanardo');
        output.push('- LinkedIn: [Seu LinkedIn]');
        output.push('- Email: [Seu Email]');
        break;
    }

    // adiciona saída
    setHistory(prev => [
      ...prev,
      ...output.map(line => ({ type: 'output', text: line })),
    ]);

    // atualiza historyIndex / commandHistory
    if (commandInput.trim()) {
      setCommandHistory(prev => [commandInput.trim(), ...prev]);
      setHistoryIndex(-1);
    }
    setInput('');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      processCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length) {
        const ni = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(ni);
        setInput(commandHistory[ni]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const ni = Math.max(historyIndex - 1, -1);
        setHistoryIndex(ni);
        setInput(ni === -1 ? '' : commandHistory[ni]);
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setHistory([]);
      setInput('');
    }
  };

  return (
    <div
      className="min-h-screen p-5 bg-dracula-bg text-dracula-fg font-mono text-sm md:text-base"
      onClick={() => inputRef.current?.focus()}
    >
      {/* HEADER FIXO */}
      <div className="mb-4 text-accent neon-accent text-2xl md:text-4xl font-bold">
        JOAO ZANARDO
      </div>
      <p>Bem-vindo ao meu portfólio terminal!</p>
      <p>
        Digite{' '}
        <span className="text-accent neon-accent font-bold">'help'</span>{' '}
        para ver a lista de comandos.
      </p>

      {/* HISTÓRICO DINÂMICO */}
      <div className="mt-4 space-y-1">
        {history.map((item, idx) => {
          if (item.type === 'input') {
            return (
              <div key={idx} className="flex items-center">
                <span className="text-accent neon-accent font-bold mr-2">{'>'}</span>
                <span className="text-dracula-fg">{item.text}</span>
              </div>
            );
          }
          if (item.type === 'error') {
            return (
              <div key={idx} className="flex items-center">
                <span className="text-red-500 neon-error font-bold mr-2">
                  {item.cmd}
                </span>
                <span className="text-dracula-fg"> : {item.message}</span>
              </div>
            );
          }
          // Saída padrão: highlight dinâmico de comandos no help
          const leading = item.text.match(/^\s*/)[0];
          const trimmed = item.text.slice(leading.length);
          const token = trimmed.split(/\s+/)[0];
          if (COMMANDS[token]) {
            const rest = trimmed.slice(token.length);
            return (
              <div key={idx} className="ml-6 whitespace-pre-wrap">
                <span>{leading}</span>
                <span className="text-accent font-semibold">{token}</span>
                <span>{rest}</span>
              </div>
            );
          }
          return (
            <div key={idx} className="text-dracula-fg ml-6 whitespace-pre-wrap">
              {item.text}
            </div>
          );
        })}
      </div>

      {/* PROMPT DE ENTRADA */}
      <div className="flex items-center mt-2">
        <span className="text-accent neon-accent font-bold mr-2">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 ml-2 bg-transparent border-none outline-none text-dracula-fg caret-dracula-pink"
          autoFocus
          spellCheck="false"
          autoComplete="off"
        />
      </div>

      <div ref={endOfTerminalRef} />
    </div>
  );
}

export default App;
