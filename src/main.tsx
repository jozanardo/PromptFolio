import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { TerminalProvider } from './context/TerminalContext';
import { ThemeProvider } from './context/ThemeContext';
import './assets/App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <TerminalProvider>
          <App />
        </TerminalProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
