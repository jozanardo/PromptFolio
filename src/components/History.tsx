import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n';
import MarkdownRenderer from './MarkdownRenderer';
import { isCommand } from '../commands';
import {
  HistoryItem,
  HistoryHelp
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
    <div className="history-flow space-y-5">
      {history.map((item, idx) => {
        if (item.type === 'input') {
          return (
            <div key={idx} className="relative pl-7 text-primary">
              <span className="prompt-glyph absolute left-0 top-0.5 font-medium">
                {'>'}
              </span>
              <span className="leading-7">{item.text}</span>
            </div>
          );
        }

        if (item.type === 'error') {
          return (
            <div
              key={idx}
              className="history-error ml-7 rounded-2xl border border-subtle bg-surface-2 pl-5 pr-4 py-3"
            >
              <div className="flex items-start gap-2.5 pl-3 leading-7">
                <span className="font-medium text-danger">{item.cmd}</span>
                <span className="text-primary">: {item.message}</span>
              </div>
            </div>
          );
        }

        if (item.type === 'markdown') {
          return <MarkdownRenderer key={idx} html={item.html} />;
        }

        if (item.type === 'help') {
          const help = item as HistoryHelp;
          return (
            <div key={idx} className="ml-3">
              {helpGroupStart.has(idx) && (
                <div className="history-section-label mb-3 ml-4">
                  {t.helpTitle}
                </div>
              )}
              <div className="border-l border-subtle-strong pl-4">
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
                  <span className="min-w-[5.5rem] font-medium text-accent">
                    {help.cmd}
                  </span>
                  <span className="leading-7 text-primary">
                    {t.commandDescriptions[help.cmd]}
                  </span>
                </div>
                <div className="mt-1 text-sm leading-6 text-muted">
                  {t.usageLabel}: {help.usage}
                </div>
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
              <div
                key={idx}
                className="ml-7 whitespace-pre-wrap leading-7 text-primary"
              >
                <span>{leading}</span>
                <span className="font-medium text-accent">{token}</span>
                <span>{rest}</span>
              </div>
            );
          }
          return (
            <div
              key={idx}
              className="ml-7 whitespace-pre-wrap leading-7 text-primary"
            >
              {item.text}
            </div>
          );
        }

        return (
          <div key={idx} className="ml-7 text-primary">
            {JSON.stringify(item)}
          </div>
        );
      })}
    </div>
  );
};

export default History;
