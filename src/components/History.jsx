import MarkdownRenderer from './MarkdownRenderer';
import { isCommand } from '../commands';

export default function History({ history }) {
  return (
    <div className="mt-4 space-y-1">
      {history.map((item, idx) => {
        if (item.type === 'input') {
          return (
            <div key={idx} className="flex items-center">
              <span className="text-accent neon-accent font-bold mr-2">{'>'}</span>
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
              <span className="text-dracula-fg"> : {item.message}</span>
            </div>
          );
        }
        if (item.type === 'markdown') {
          return <MarkdownRenderer key={idx} html={item.html} />;
        }
        
        const leading = item.text.match(/^\s*/)[0];
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
          <div key={idx} className="text-dracula-fg ml-6 whitespace-pre-wrap">
            {item.text}
          </div>
        );
      })}
    </div>
  );
}
