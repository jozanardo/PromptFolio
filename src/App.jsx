import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import repositories from './github_repos.json'; // Import the repo data

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
    description: 'Limpa o terminal.',
    usage: 'clear',
  },
  // Removed 'achievements' and 'website'
};

function App() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'output', text: 'Bem-vindo ao meu portfólio terminal!' },
    { type: 'output', text: "Digite 'help' para ver a lista de comandos." },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endOfTerminalRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const processCommand = (commandInput) => {
    const [command, ...args] = commandInput.trim().split(/\s+/);
    const newHistory = [...history, { type: 'input', text: commandInput }];

    if (command === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

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
        // Adicione mais informações se desejar
        break;
      case 'about':
        output.push('Sobre mim:');
        output.push('Sou apaixonado por tecnologia e desenvolvimento de software.');
        output.push('Atualmente estudando Ciência da Computação na UFABC.');
        // Adicione mais detalhes
        break;
      case 'skills':
        output.push('Minhas habilidades incluem:');
        output.push('- Linguagens: TypeScript, JavaScript, Python, Java, C#, Go, Haskell');
        output.push('- Frameworks/Libs: React, Node.js, NestJS, Next.js, Tailwind CSS');
        output.push('- Ferramentas: Git, Docker, Linux');
        // Adicione/remova skills conforme necessário
        break;
      case 'projects':
        // Extrair argumentos de filtro
        let langFilter = null;
        let descFilter = null;
        let nameFilter = null;
        let showHelp = false;
        let showLangs = false;

        for (const arg of args) {
          if (arg.startsWith("--lang=")) {
            langFilter = arg.split("=")[1].toLowerCase();
          } else if (arg.startsWith("--desc=")) {
            descFilter = arg.split("=")[1].toLowerCase();
          } else if (arg.startsWith("--name=")) {
            nameFilter = arg.split("=")[1].toLowerCase();
          } else if (arg === "--help") {
            output.push("Uso: projects [opções]");
            output.push("Opções:");
            output.push("  --lang=<linguagem>  Filtrar por linguagem de programação");
            output.push("  --desc=<texto>      Filtrar por texto na descrição");
            output.push("  --name=<nome>       Filtrar por nome do projeto");
            output.push("  --list-langs        Listar todas as linguagens disponíveis");
            output.push("  --help              Mostrar esta ajuda");
            showHelp = true;
            break; // Exit the loop after showing help
          } else if (arg === "--list-langs") {
            const languages = [...new Set(repositories
              .map(repo => repo.language)
              .filter(lang => lang !== null))];
            
            output.push("Linguagens disponíveis:");
            languages.sort().forEach(lang => {
              const count = repositories.filter(repo => repo.language === lang).length;
              output.push(`  ${lang} (${count} ${count === 1 ? "projeto" : "projetos"})`);
            });
            showLangs = true;
            break; // Exit the loop after listing languages
          }
        }

        if (showHelp || showLangs) break; // Skip filtering and output if help or langs were shown

        // Aplicar filtros
        let filteredRepos = [...repositories];
        
        if (langFilter) {
          filteredRepos = filteredRepos.filter(repo => repo.language && repo.language.toLowerCase() === langFilter);
        }
        if (descFilter) {
          filteredRepos = filteredRepos.filter(repo => repo.description && repo.description.toLowerCase().includes(descFilter));
        }
        if (nameFilter) {
          filteredRepos = filteredRepos.filter(repo => repo.name.toLowerCase().includes(nameFilter));
        }

        // Mostrar resultados
        const filterDescription = [];
        if (langFilter) filterDescription.push(`linguagem: ${langFilter}`);
        if (descFilter) filterDescription.push(`descrição: "${descFilter}"`);
        if (nameFilter) filterDescription.push(`nome: "${nameFilter}"`);
        
        if (filterDescription.length > 0) {
          output.push(`Projetos filtrados por ${filterDescription.join(', ')}:`);
        } else {
          output.push('Todos os projetos:');
        }
        
        if (filteredRepos.length > 0) {
          output.push(`Encontrados ${filteredRepos.length} ${filteredRepos.length === 1 ? 'projeto' : 'projetos'}`);
          filteredRepos.forEach((repo, index) => {
            output.push(`\n[${index + 1}] ${repo.name} (${repo.language || 'N/A'})`);
            if (repo.description) {
              output.push(`    Descrição: ${repo.description}`);
            }
            output.push(`    URL: ${repo.html_url}`);
            output.push(`    Atualizado em: ${new Date(repo.updated_at).toLocaleDateString()}`);
          });
        } else {
          output.push('Nenhum projeto encontrado com os filtros aplicados.');
        }
        
        output.push(`\nDicas de uso:`);
        output.push(`  projects --lang=TypeScript     # Filtrar por linguagem`);
        output.push(`  projects --desc=api            # Filtrar por texto na descrição`);
        output.push(`  projects --name=ignite         # Filtrar por nome do projeto`);
        output.push(`  projects --list-langs          # Listar todas as linguagens`);
        output.push(`  projects --help                # Mostrar ajuda`);
        break;
      case 'contact':
        output.push('Entre em contato:');
        output.push('- GitHub: https://github.com/jozanardo');
        output.push('- LinkedIn: [Seu Link do LinkedIn]'); // Adicione seu link
        output.push('- Email: [Seu Email]'); // Adicione seu email
        break;
      default:
        output.push(`Comando não encontrado: ${command}`);
        output.push("Digite 'help' para ver a lista de comandos.");
    }

    setHistory([...newHistory, ...output.map(line => ({ type: 'output', text: line }))]);
    if (commandInput.trim() !== '') {
        setCommandHistory(prev => [commandInput.trim(), ...prev]);
    }
    setHistoryIndex(-1); // Reset history index on new command
    setInput('');
  };

  const handleKeyDown = (e) => {
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
    <div className="min-h-screen p-5 bg-dracula-bg text-dracula-fg font-mono text-sm md:text-base" onClick={() => inputRef.current?.focus()}>
      {/* Header similar to the image - requires a pixel font or SVG */}
      <div className="mb-4 text-accent text-2xl md:text-4xl font-bold">
        JOAO ZANARDO
      </div>


      {history.map((item, index) => (
        <div key={index} className="whitespace-pre-wrap break-words">
          {item.type === 'input' ? (
            <div>
              <span className="text-accent font-bold mr-2">{'>'}</span>
              <span className="text-dracula-fg">{item.text}</span>
            </div>
          ) : (
            <div className="text-dracula-fg">{item.text}</div>
          )}
        </div>
      ))}

      <div className="flex items-center mt-2">
      <span className="text-accent font-bold mr-2">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
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

