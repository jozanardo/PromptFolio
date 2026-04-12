import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

export default function TopBar() {
  const { lang } = useLanguage();

  return (
    <div className="topbar-surface fixed inset-x-0 top-0 z-30 border-b border-subtle backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-[6%] py-3 md:px-[10%] xl:px-[15%]">
        <div className="min-w-0 text-[0.78rem] uppercase tracking-[0.18em] text-muted">
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

        <div className="flex flex-wrap items-center justify-end gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
