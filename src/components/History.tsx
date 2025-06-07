import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n';
import MarkdownRenderer from './MarkdownRenderer';
import { isCommand } from '../commands';
import {
  HistoryItem,
  HistoryHelp,
  HistoryInput,
  HistoryOutput,
  HistoryError,
  HistoryMarkdown,
} from '../types';

interface HistoryProps {
  history: HistoryItem[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  const { lang } = useLanguage();
  const t = translations[lang];

  const helpGroupStart = useMemo(() => {
    const starts = new Set<number>();
    let prevWasHelp = false;
    history.forEach((item, idx) => {
      if (item.type === 'help') {
        if (!prevWasHelp) starts.add(idx);
        prevWasHelp = true;
      } else {
        prevWasHelp = false;
      }
    });
    return starts;
  }, [history]);

  return (
    <div className="mt-4 space-y-1">
      {history.map((item, idx) => {
        if (item.type === 'input') {
          return (
            <div key={idx} className="flex items-center">
              <span className="text-accent neon-accent font-bold mr-2">
                {'>'}
              </span>
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
              <span className="text-dracula-fg">: {item.message}</span>
            </div>
          );
        }

        if (item.type === 'markdown') {
          return <MarkdownRenderer key={idx} html={item.html} />;
        }

        if (item.type === 'help') {
          const help = item as HistoryHelp;
          return (
            <div key={idx} className="ml-6">
              {helpGroupStart.has(idx) && (
                <div className="mb-1 text-dracula-fg font-semibold">
                  {t.helpTitle}
                </div>
              )}
              <div className="flex items-baseline">
                <span className="text-accent font-semibold mr-2">
                  {help.cmd}
                </span>
                <span className="text-dracula-fg">– {help.description}</span>
              </div>
              <div className="ml-8 text-dracula-fg">
                {t.usageLabel}: {help.usage}
              </div>
            </div>
          );
        }

        if (item.type === 'output') {
          const leading = item.text.match(/^\s*/)?.[0] ?? '';
          const trimmed = item.text.slice(leading.length);
          const token = trimmed.split(/\s+/)[0];
          if (isCommand(token)) {
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
            <div
              key={idx}
              className="text-dracula-fg ml-6 whitespace-pre-wrap"
            >
              {item.text}
            </div>
          );
        }

        return (
          <div key={idx} className="text-dracula-fg ml-6">
            {JSON.stringify(item)}
          </div>
        );
      })}
    </div>
  );
};

export default History;
