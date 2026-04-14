import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

export default function TopBar() {
  const { lang } = useLanguage();

  return (
    <div className="topbar-surface fixed inset-x-0 top-0 z-30 border-b border-subtle backdrop-blur-xl">
      <div className="flex w-full flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 md:px-8">
        <div className="min-w-0 text-[0.72rem] uppercase tracking-[0.18em] text-muted sm:text-[0.78rem]">
          <span className="text-primary">PromptFolio</span>
          {lang === 'pt' ? (
            <>
              <span className="mx-2 text-accent">por</span>
              <span className="text-primary">João Zanardo</span>
            </>
          ) : (
            <>
              <span className="mx-2 text-accent">powered by</span>
              <span className="text-primary">João Zanardo</span>
            </>
          )}
        </div>

        <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:justify-end">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
