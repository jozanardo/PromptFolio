import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import History from './History';
import { LanguageProvider } from '../context/LanguageContext';
import type { HistoryItem } from '../types';

describe('History', () => {
  it('renders a helpList block with localized usage labels', () => {
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

    expect(screen.getByText('Available commands:')).toBeInTheDocument();
    expect(screen.getAllByText('help')).toHaveLength(2);
    expect(screen.getByText('Usage: help')).toBeInTheDocument();
  });
});
