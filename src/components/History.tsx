import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n';
import MarkdownRenderer from './MarkdownRenderer';
import { HistoryItem, TerminalBlock } from '../types';

interface HistoryProps {
  history: HistoryItem[];
}

const History: React.FC<HistoryProps> = ({ history }) => {
  const { lang } = useLanguage();
  const t = translations[lang];

  const renderTextLine = useMemo(
    () => (text: string, key: string) => (
      <div key={key} className="ml-7 whitespace-pre-wrap leading-7 text-primary">
        {text}
      </div>
    ),
    []
  );

  const renderBlock = useMemo(
    () => (block: TerminalBlock, key: string) => {
      if (block.type === 'text' || block.type === 'system') {
        return renderTextLine(block.text, key);
      }

      if (block.type === 'error') {
        return (
          <div
            key={key}
            className="history-error ml-7 rounded-2xl border border-subtle bg-surface-2 pl-5 pr-4 py-3"
          >
            <div className="flex items-start gap-2.5 pl-3 leading-7">
              {block.command ? (
                <span className="font-medium text-danger">{block.command}</span>
              ) : null}
              <span className="text-primary">
                {block.command ? ':' : ''}
                {block.command ? ` ${block.message}` : block.message}
              </span>
            </div>
          </div>
        );
      }

      if (block.type === 'markdown') {
        return <MarkdownRenderer key={key} html={block.html} />;
      }

      if (block.type === 'helpList') {
        return (
          <div key={key} className="ml-3 space-y-3">
            <div className="history-section-label ml-4">{block.title}</div>
            {block.items.map(item => (
              <div key={item.command} className="border-l border-subtle-strong pl-4">
                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-4">
                  <span className="min-w-[5.5rem] font-medium text-accent">
                    {item.command}
                  </span>
                  <span className="leading-7 text-primary">
                    {item.description}
                  </span>
                </div>
                <div className="mt-1 text-sm leading-6 text-muted">
                  {t.usageLabel}: {item.usage}
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (block.type === 'recordList') {
        return (
          <div key={key} className="ml-3 space-y-4">
            {block.title ? (
              <div className="history-section-label ml-4">{block.title}</div>
            ) : null}
            {block.records.map(record => (
              <div
                key={`${record.title}-${record.subtitle ?? ''}`}
                className="border-l border-subtle-strong pl-4"
              >
                <div className="font-medium leading-7 text-primary">
                  {record.title}
                </div>
                {record.subtitle ? (
                  <div className="text-sm leading-6 text-muted">
                    {record.subtitle}
                  </div>
                ) : null}
                {record.lines?.map(line => (
                  <div key={line} className="leading-7 text-primary">
                    {line}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      }

      return null;
    },
    [renderTextLine, t.usageLabel]
  );

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

        if (item.type === 'output') {
          return (
            <div key={idx} className="space-y-5">
              {item.blocks.map((block, blockIdx) =>
                renderBlock(block, `${idx}-${blockIdx}`)
              )}
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
