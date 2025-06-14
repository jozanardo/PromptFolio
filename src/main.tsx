import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { TerminalProvider } from './context/TerminalContext';
import './assets/App.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <TerminalProvider>
        <App />
      </TerminalProvider>
    </LanguageProvider>
  </React.StrictMode>
);
