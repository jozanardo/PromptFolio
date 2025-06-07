import React, { createContext, ReactNode, useContext } from 'react';
import { useCommandProcessor } from '../hooks/useCommandProcessor';
import { HistoryItem } from '../types';

interface TerminalContextType {
  input: string;
  setInput: (v: string) => void;
  history: HistoryItem[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  endRef: React.RefObject<HTMLDivElement | null>;
  processCommand: (cmd: string) => void;
}

const TerminalContext = createContext<TerminalContextType | null>(null);

export const TerminalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const terminal = useCommandProcessor();
  return (
    <TerminalContext.Provider value={terminal}>
      {children}
    </TerminalContext.Provider>
  );
};

export function useTerminal(): TerminalContextType {
  const ctx = useContext(TerminalContext);
  if (!ctx) throw new Error('useTerminal must be used within TerminalProvider');
  return ctx;
}
