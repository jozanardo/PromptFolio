import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { isCommand, Command } from '../commands';
import { HistoryItem } from '../types'; 

interface HistoryProps {
  history: HistoryItem[];
}

export const History: React.FC<HistoryProps> = ({ history }) => (
  <div className="mt-4 space-y-1">
    {history.map((item, idx) => {
      switch (item.type) {
        case 'input':
          return <InputLine key={idx} text={item.text} />;

        case 'error':
          return <ErrorLine key={idx} cmd={item.cmd} message={item.message} />;

        case 'markdown':
          return <MarkdownRenderer key={idx} html={item.html} />;

        case 'output':
          return <OutputLine key={idx} text={item.text} />;

        default:
          return null;
      }
    })}
  </div>
);

const InputLine: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center">
    <span className="text-accent neon-accent font-bold mr-2">{'>'}</span>
    <span className="text-dracula-fg">{text}</span>
  </div>
);

const ErrorLine: React.FC<{ cmd: string; message: string }> = ({ cmd, message }) => (
  <div className="flex items-center">
    <span className="text-red-500 neon-error font-bold mr-2">{cmd}</span>
    <span className="text-dracula-fg">: {message}</span>
  </div>
);

const OutputLine: React.FC<{ text: string }> = ({ text }) => {
  const { leading, token, rest } = splitLeadingToken(text);

  if (isCommand(token as string)) {
    return (
      <div className="ml-6 whitespace-pre-wrap">
        <span>{leading}</span>
        <span className="text-accent font-semibold">{token}</span>
        <span>{rest}</span>
      </div>
    );
  }

  return (
    <div className="text-dracula-fg ml-6 whitespace-pre-wrap">
      {text}
    </div>
  );
};

function splitLeadingToken(text: string) {
  const match = text.match(/^\s*/)!;
  const leading = match[0];
  const trimmed = text.slice(leading.length);
  const [token, ...restParts] = trimmed.split(/(\s+)/, 2);
  const rest = restParts.length > 1 ? restParts[1] + trimmed.slice(token.length + restParts[1].length) : '';
  return { leading, token, rest };
}

export default History;
