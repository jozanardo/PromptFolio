import React, { useState, useEffect, useRef } from 'react';
import './index.css';

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
    description: 'Veja meus projetos (com filtros!).',
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

  // Scroll até o fim a cada update de history
  useEffect(() => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Auto-focus no input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processCommand = commandInput => {
    const [command, ...args] = commandInput.trim().split(/\s+/);
    const entryInput = { type: 'input', text: commandInput };

    // clear: limpa só o histórico dinâmico
    if (command === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    // --- Comando não reconhecido ---
    if (!Object.hasOwn(COMMANDS, command)) {
      setHistory(prev => [
        ...prev,
        entryInput,
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

    // --- Comando reconhecido ---
    setHistory(prev => [...prev, entryInput]);

    let output = [];
    switch (command) {
      case 'help':
      case 'ls':
        output.push('Comandos disponíveis:');
        Object.entries(COMMANDS).forEach(([cmd, details]) => {
          output.push(`  ${cmd.padEnd(12)} - ${details.description}`);
          output.push(`    Uso: ${details.usage}`);
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
        // ... (seu bloco de projects exatamente como está hoje) ...
        break;

      case 'contact':
        output.push('Entre em contato:');
        output.push('- GitHub: https://github.com/jozanardo');
        output.push('- LinkedIn: [Seu Link do LinkedIn]');
        output.push('- Email: [Seu Email]');
        break;
    }

    // adiciona saída ao history
    setHistory(prev => [
      ...prev,
      ...output.map(line => ({ type: 'output', text: line })),
    ]);

    // atualiza historyIndex para navegação com ↑/↓
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
      if (commandHistory.length > 0) {
        const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = Math.max(historyIndex - 1, -1);
        setHistoryIndex(newIndex);
        setInput(newIndex === -1 ? '' : commandHistory[newIndex]);
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
      {/* Header fixo */}
      <div className="mb-4 text-accent text-2xl neon-accent md:text-4xl font-bold">
        JOAO ZANARDO
      </div>
      <p>Bem-vindo ao meu portfólio terminal!</p>
      <p>Digite 'help' para ver a lista de comandos.</p>

      {/* Histórico dinâmico */}
      <div className="mt-4 space-y-1">
        {history.map((item, idx) => {
          if (item.type === 'input') {
            return (
              <div key={idx} className="flex items-center">
                <span className="text-accent font-bold neon-accent mr-2">{'>'}</span>

                <span className="text-dracula-fg">{item.text}</span>
              </div>
            );
          }
          if (item.type === 'error') {
            return (
              <div key={idx} className="flex items-center">
                <span className="text-red-500 font-bold neon-error mr-2">{item.cmd}</span>
                <span className="text-dracula-fg"> : {item.message}</span>
              </div>
            );
          }
          // type === 'output'
          return (
            <div key={idx} className="text-dracula-fg ml-6 whitespace-pre-wrap">
              {item.text}
            </div>
          );
        })}
      </div>

      {/* Prompt de entrada */}
      <div className="flex items-center mt-2">
      <span className="text-accent font-bold neon-accent mr-2">{'>'}</span>
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