import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  LanguageProvider,
  useLanguage,
} from './LanguageContext';

function LanguageConsumer() {
  const { lang, setLang } = useLanguage();

  return (
    <button type="button" onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}>
      {lang}
    </button>
  );
}

describe('LanguageContext', () => {
  it('sincroniza o idioma do documento com o locale ativo', async () => {
    window.localStorage.setItem('lang', 'pt');
    const user = userEvent.setup();

    render(
      <LanguageProvider>
        <LanguageConsumer />
      </LanguageProvider>
    );

    expect(document.documentElement.lang).toBe('pt');

    await user.click(screen.getByRole('button', { name: 'pt' }));

    expect(document.documentElement.lang).toBe('en');
    expect(window.localStorage.getItem('lang')).toBe('en');
  });
});
