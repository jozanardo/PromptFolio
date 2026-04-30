import React, { useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n';
import MarkdownRenderer from './MarkdownRenderer';
import { HistoryItem, TerminalBlock } from '../types';

interface HistoryProps {
  history: HistoryItem[];
}

function isSupportedRecordHref(href: string): boolean {
  return /^(https?:\/\/|mailto:)/i.test(href);
}

function isExternalRecordHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
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
          <div key={key} className="history-list">
            <div className="history-section-label ml-4">{block.title}</div>
            {block.items.map(item => (
              <div key={item.command} className="history-list-entry">
                <div className="history-list-main">
                  <span className="history-list-token">{item.command}</span>
                  <span className="history-list-copy">
                    {item.description}
                  </span>
                </div>
                <div className="history-list-meta">
                  {t.usageLabel}: {item.usage}
                </div>
              </div>
            ))}
          </div>
        );
      }

      if (block.type === 'recordList') {
        const renderRecordMain = (
          record: (typeof block.records)[number]
        ) => {
          const content = (
            <>
              <div className="history-list-token-group">
                <div className="history-list-token">{record.title}</div>
                {record.meta ? (
                  <div className="history-list-token-meta">
                    {record.meta}
                  </div>
                ) : null}
              </div>
              {record.subtitle ? (
                <div className="history-list-copy">
                  {record.subtitle}
                </div>
              ) : null}
            </>
          );

          if (record.href && isSupportedRecordHref(record.href)) {
            const isExternal = isExternalRecordHref(record.href);

            return (
              <a
                className="history-list-main history-list-link"
                href={record.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noopener noreferrer' : undefined}
              >
                {content}
              </a>
            );
          }

          return <div className="history-list-main">{content}</div>;
        };

        return (
          <div key={key} className="history-list">
            {block.title ? (
              <div className="history-section-label ml-4">{block.title}</div>
            ) : null}
            {block.records.map(record => (
              <div
                key={`${record.title}-${record.subtitle ?? ''}`}
                className="history-list-entry"
              >
                {renderRecordMain(record)}
                {record.lines && record.lines.length > 0 ? (
                  <div className="history-list-subtokens">
                    {record.lines.map((line, lineIdx) => (
                      <span
                        key={`${line}-${lineIdx}`}
                        className="history-list-subtoken"
                      >
                        {line}
                      </span>
                    ))}
                  </div>
                ) : null}
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
    <div
      id="terminal-history"
      role="log"
      aria-live="polite"
      aria-relevant="additions text"
      aria-label={t.historyAriaLabel}
      className="history-flow space-y-5"
    >
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
