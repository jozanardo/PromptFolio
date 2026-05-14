import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import History from './History';
import { LanguageProvider } from '../context/LanguageContext';
import type { HistoryItem } from '../types';

describe('History', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('expõe a saída como um log acessível para tecnologias assistivas', () => {
    window.localStorage.setItem('lang', 'pt');

    render(
      <LanguageProvider>
        <History
          history={[{ type: 'output', blocks: [{ type: 'text', text: 'Olá, mundo' }] }]}
        />
      </LanguageProvider>
    );

    const log = screen.getByRole('log', { name: 'Histórico do terminal' });

    expect(log).toHaveAttribute('aria-live', 'polite');
    expect(log).toHaveAttribute('aria-relevant', 'additions text');
  });

  it('renders a helpList block with the shared command-list grammar', () => {
    const history: HistoryItem[] = [
      { type: 'input', text: 'help' },
      {
        type: 'output',
        blocks: [
          {
            type: 'helpList',
            title: 'Available commands:',
            items: [
              {
                command: 'help',
                description: 'List all available commands.',
                usage: 'help',
              },
            ],
          },
        ],
      },
    ];

    render(
      <LanguageProvider>
        <History history={history} />
      </LanguageProvider>
    );

    const commandToken = screen.getAllByText('help')[1];

    expect(screen.getByText('Available commands:')).toHaveClass(
      'history-section-label'
    );
    expect(commandToken).toHaveClass('history-list-token');
    expect(screen.getByText('List all available commands.')).toHaveClass(
      'history-list-copy'
    );
    expect(screen.getByText('Usage: help')).toHaveClass('history-list-meta');
  });

  it('renders regular output text without command highlighting', () => {
    const history: HistoryItem[] = [
      {
        type: 'output',
        blocks: [
          {
            type: 'text',
            text: 'About me:',
          },
        ],
      },
    ];

    const { container } = render(
      <LanguageProvider>
        <History history={history} />
      </LanguageProvider>
    );

    expect(screen.getByText('About me:')).toBeInTheDocument();
    expect(container.querySelector('.text-accent')).toBeNull();
  });

  it('renders record lists with the same structural grammar used by help', () => {
    const history: HistoryItem[] = [
      {
        type: 'output',
        blocks: [
          {
            type: 'recordList',
            title: 'Start exploring:',
            records: [
              {
                title: 'work',
                subtitle: 'Browse selected work.',
              },
              {
                title: 'discovery',
                lines: ['start', 'help', 'ls'],
              },
            ],
          },
        ],
      },
    ];

    render(
      <LanguageProvider>
        <History history={history} />
      </LanguageProvider>
    );

    expect(screen.getByText('work')).toHaveClass('history-list-token');
    expect(screen.getByText('Browse selected work.')).toHaveClass(
      'history-list-copy'
    );
    expect(screen.getByText('discovery')).toHaveClass('history-list-token');
    expect(screen.getByText('start')).toHaveClass('history-list-subtoken');
    expect(screen.getByText('help')).toHaveClass('history-list-subtoken');
    expect(screen.getByText('ls')).toHaveClass('history-list-subtoken');
  });

  it('renders record metadata below the title using the quiet label color', () => {
    const history: HistoryItem[] = [
      {
        type: 'output',
        blocks: [
          {
            type: 'recordList',
            title: 'Trajetória:',
            records: [
              {
                title: 'Santander',
                meta: 'abril de 2021 - março de 2022',
                subtitle: 'Segurança cibernética e auditoria.',
              },
            ],
          },
        ],
      },
    ];

    render(
      <LanguageProvider>
        <History history={history} />
      </LanguageProvider>
    );

    expect(screen.getByText('Santander')).toHaveClass('history-list-token');
    expect(screen.getByText('abril de 2021 - março de 2022')).toHaveClass(
      'history-list-token-meta'
    );
  });

  it('renders duplicated record lines without React key warnings', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    const history: HistoryItem[] = [
      {
        type: 'output',
        blocks: [
          {
            type: 'recordList',
            records: [
              {
                title: 'work',
                lines: ['same line', 'same line'],
              },
            ],
          },
        ],
      },
    ];

    render(
      <LanguageProvider>
        <History history={history} />
      </LanguageProvider>
    );

    expect(screen.getAllByText('same line')).toHaveLength(2);
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Encountered two children with the same key')
    );
  });

  it('renders record hrefs as accessible links without changing the list grammar', () => {
    const history = [
      {
        type: 'output',
        blocks: [
          {
            type: 'recordList',
            records: [
              {
                title: 'LinkedIn',
                subtitle: 'https://www.linkedin.com/in/joão-zanardo/',
                href: 'https://www.linkedin.com/in/joão-zanardo/',
              },
              {
                title: 'Email',
                subtitle: 'jozanardo@gmail.com',
                href: 'mailto:jozanardo@gmail.com',
              },
            ],
          },
        ],
      },
    ] as HistoryItem[];

    render(
      <LanguageProvider>
        <History history={history} />
      </LanguageProvider>
    );

    const linkedIn = screen.getByRole('link', { name: /LinkedIn/ });
    const email = screen.getByRole('link', { name: /Email/ });

    expect(linkedIn).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/joão-zanardo/'
    );
    expect(email).toHaveAttribute('href', 'mailto:jozanardo@gmail.com');
    expect(screen.getByText('LinkedIn')).toHaveClass('history-list-token');
    expect(screen.getByText('jozanardo@gmail.com')).toHaveClass(
      'history-list-copy'
    );
  });

  it('renders search results with the shared record list grammar', () => {
    render(
      <LanguageProvider>
        <History
          history={[
            {
              type: 'output',
              blocks: [
                {
                  type: 'recordList',
                  title: 'Search results:',
                  records: [
                    {
                      title: 'promptfolio',
                      meta: 'project · TypeScript · 2026 · active',
                      subtitle:
                        'Command-guided portfolio shaped as a calm personal archive.',
                      href: 'https://github.com/jozanardo/PromptFolio',
                      lines: ['> work --name promptfolio', '#promptfolio'],
                    },
                  ],
                },
              ],
            },
          ]}
        />
      </LanguageProvider>
    );

    expect(screen.getByText('promptfolio')).toHaveClass('history-list-token');
    expect(screen.getByText('> work --name promptfolio')).toHaveClass(
      'history-list-subtoken'
    );
  });

  it('does not render unsupported record href protocols as links', () => {
    const history = [
      {
        type: 'output',
        blocks: [
          {
            type: 'recordList',
            records: [
              {
                title: 'Unsafe',
                subtitle: 'javascript:alert(1)',
                href: 'javascript:alert(1)',
              },
            ],
          },
        ],
      },
    ] as HistoryItem[];

    render(
      <LanguageProvider>
        <History history={history} />
      </LanguageProvider>
    );

    expect(screen.queryByRole('link', { name: /Unsafe/ })).toBeNull();
    expect(screen.getByText('Unsafe')).toHaveClass('history-list-token');
  });

  it('keeps long record titles from collapsing into the description column', () => {
    const css = readFileSync(
      `${process.cwd()}/src/assets/App.css`,
      'utf8'
    );

    expect(css).toContain('--history-list-token-width: 9.75rem;');
    expect(css).toContain(
      'grid-template-columns: var(--history-list-token-width) minmax(0, 1fr);'
    );
    expect(css).toContain('.history-list-token-meta');
    expect(css).toContain('@apply mt-0.5 text-[0.72rem] leading-5 text-muted;');
  });
});
