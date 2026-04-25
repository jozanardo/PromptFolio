import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
                title: 'projects',
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

    expect(screen.getByText('projects')).toHaveClass('history-list-token');
    expect(screen.getByText('Browse selected work.')).toHaveClass(
      'history-list-copy'
    );
    expect(screen.getByText('discovery')).toHaveClass('history-list-token');
    expect(screen.getByText('start')).toHaveClass('history-list-subtoken');
    expect(screen.getByText('help')).toHaveClass('history-list-subtoken');
    expect(screen.getByText('ls')).toHaveClass('history-list-subtoken');
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
                title: 'projects',
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
});
