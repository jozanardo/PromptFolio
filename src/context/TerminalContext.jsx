import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Command, isCommand, CommandMeta } from '../commands';
import repositories from '../github_repos.json';
import { filterProjects } from '../features/projects/projectsService';

const TerminalContext = createContext();

export function TerminalProvider({ children }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const processCommand = commandInput => {
    const [cmd, ...args] = commandInput.trim().split(/\s+/);

    if (cmd === Command.CLEAR) {
      setHistory([]);
      setInput('');
      return;
    }

    setHistory(prev => [...prev, { type: 'input', text: commandInput }]);

    if (cmd === Command.WHOAMI) {
      setHistory(prev => [
        ...prev,
        { type: 'output', text: '🔄 Carregando README do GitHub...' }
      ]);
      fetch('https://api.github.com/repos/jozanardo/jozanardo/readme', {
        headers: { Accept: 'application/vnd.github.v3.html' }
      })
        .then(res => res.text())
        .then(html => {
          setHistory(prev => [...prev, { type: 'markdown', html }]);
        })
        .catch(() => {
          setHistory(prev => [
            ...prev,
            { type: 'output', text: '❌ Não foi possível carregar o README.' }
          ]);
        });
      setInput('');
      return;
    }

    if (cmd === Command.PROJECTS) {
      const helpLines = [
        'Uso: projects [--lang=<linguagem>] [--desc=<texto>] [--name=<nome>] [--list-langs] [--help]',
        'Opções:',
        '  --lang=<linguagem>   Filtrar por linguagem',
        '  --desc=<texto>       Filtrar por texto na descrição',
        '  --name=<nome>        Filtrar por nome do projeto',
        '  --list-langs         Listar todas as linguagens disponíveis',
        '  --help               Mostrar esta ajuda',
      ];

      let langFilter = null;
      let descFilter = null;
      let nameFilter = null;
      let showHelp = false;
      let showLangs = false;

      for (const arg of args) {
        if (arg === '--help') {
          showHelp = true;
        } else if (arg === '--list-langs') {
          showLangs = true;
        } else if (arg.startsWith('--lang=')) {
          langFilter = arg.split('=')[1].toLowerCase();
        } else if (arg.startsWith('--desc=')) {
          descFilter = arg.split('=')[1].toLowerCase();
        } else if (arg.startsWith('--name=')) {
          nameFilter = arg.split('=')[1].toLowerCase();
        }
      }

      if (showHelp) {
        setHistory(prev => [
          ...prev,
          ...helpLines.map(line => ({ type: 'output', text: line }))
        ]);
        setInput('');
        return;
      }

      if (showLangs) {
        const langs = Array.from(
          new Set(repositories.map(r => r.language).filter(Boolean))
        ).sort();
        const lines = ['Linguagens disponíveis:'];
        langs.forEach(lang => {
          const count = repositories.filter(r => r.language === lang).length;
          lines.push(`  ${lang} (${count} ${count === 1 ? 'projeto' : 'projetos'})`);
        });
        setHistory(prev => [
          ...prev,
          ...lines.map(line => ({ type: 'output', text: line }))
        ]);
        setInput('');
        return;
      }

      const filters = { lang: langFilter, desc: descFilter, name: nameFilter };
      const results = filterProjects(repositories, filters);
      const descParts = [];
      if (langFilter) descParts.push(`linguagem: ${langFilter}`);
      if (descFilter) descParts.push(`descrição: "${descFilter}"`);
      if (nameFilter) descParts.push(`nome: "${nameFilter}"`);

      const header = descParts.length
        ? `Projetos filtrados por ${descParts.join(', ')}:`
        : 'Todos os projetos:';

      let lines = [header];
      if (results.length > 0) {
        lines.push(`Encontrados ${results.length} ${results.length === 1 ? 'projeto' : 'projetos'}`);
        results.forEach((repo, i) => {
          lines.push(`\n[${i + 1}] ${repo.name} (${repo.language || 'N/A'})`);
          if (repo.description) {
            lines.push(`    Descrição: ${repo.description}`);
          }
          lines.push(`    URL: ${repo.html_url}`);
          lines.push(`    Atualizado em: ${new Date(repo.updated_at).toLocaleDateString()}`);
        });
      } else {
        lines.push('Nenhum projeto encontrado com os filtros informados.');
      }

      setHistory(prev => [
        ...prev,
        ...lines.map(line => ({ type: 'output', text: line }))
      ]);
      setInput('');
      return;
    }

    if (!isCommand(cmd)) {
      setHistory(prev => [
        ...prev,
        {
          type: 'error',
          cmd,
          message: "command not found. Type 'help' to view a list of available commands.",
        },
      ]);
      setInput('');
      return;
    }

    let output = [];
    switch (cmd) {
      case Command.HELP:
      case Command.LS:
        output.push('Comandos disponíveis:');
        Object.values(Command).forEach(c => {
          const meta = CommandMeta[c];
          output.push(`  ${c.padEnd(12)} - ${meta.description}`);
          output.push(`    Uso: ${meta.usage}`);
        });
        break;
      case Command.ABOUT:
        output.push('Sobre mim:');
        output.push('Sou apaixonado por tecnologia e desenvolvimento de software.');
        output.push('Atualmente estudando Ciência da Computação na UFABC.');
        break;
      case Command.SKILLS:
        output.push('Minhas habilidades incluem:');
        output.push('- TypeScript, JavaScript, Python, Java, C#, Go, Haskell');
        output.push('- React, Node.js, NestJS, Next.js, Tailwind CSS');
        output.push('- Git, Docker, Linux');
        break;
      case Command.CONTACT:
        output.push('Entre em contato:');
        output.push('- GitHub: https://github.com/jozanardo');
        output.push('- LinkedIn: [Seu LinkedIn]');
        output.push('- Email: [Seu Email]');
        break;
    }

    setHistory(prev => [
      ...prev,
      ...output.map(line => ({ type: 'output', text: line })),
    ]);
    setInput('');
  };

  return (
    <TerminalContext.Provider
      value={{
        input,
        setInput,
        history,
        inputRef,
        endRef,
        processCommand,
      }}
    >
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error('useTerminal must be used within TerminalProvider');
  }
  return context;
}
