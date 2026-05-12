import { describe, expect, it } from 'vitest';
import {
  localizeNarrativeRecords,
  narrativeContent,
  resolveNarrativeContent,
} from '.';

const placeholderPattern = /\b(TBD|TODO|placeholder|\[Your|\[Seu)\b/i;

describe('narrative content', () => {
  it('contains complete localized now and philosophy content without placeholders', () => {
    expect(narrativeContent.now.records).toHaveLength(4);
    expect(narrativeContent.philosophy.records).toHaveLength(5);

    const serialized = JSON.stringify(narrativeContent);

    expect(serialized).not.toMatch(placeholderPattern);
    expect(narrativeContent.now.intro.en).toBe(
      'Right now, my attention is on backend reliability, applied AI, and keeping PromptFolio as a clear authored archive instead of a decorative portfolio.'
    );
    expect(narrativeContent.now.intro.pt).toBe(
      'Neste momento, minha atenção está em confiabilidade de backend, IA aplicada e em manter o PromptFolio como um arquivo autoral claro em vez de um portfólio decorativo.'
    );
    expect(narrativeContent.philosophy.intro.en).toBe(
      'The engineering philosophy here is practical: software should make constraints visible, reduce operational surprise, and help people decide with more clarity.'
    );
    expect(narrativeContent.philosophy.intro.pt).toBe(
      'A filosofia de engenharia aqui é prática: software deve tornar restrições visíveis, reduzir surpresa operacional e ajudar pessoas a decidir com mais clareza.'
    );
  });

  it('localizes narrative records into terminal record entries', () => {
    expect(localizeNarrativeRecords(narrativeContent.now.records, 'en')).toEqual([
      {
        title: 'backend',
        subtitle:
          'Resilient services for international shipping promises, operational clarity, and predictable production behavior.',
      },
      {
        title: 'AI',
        subtitle:
          'Applied AI in engineering without hiding tradeoffs, context, or responsibility.',
      },
      {
        title: 'PromptFolio',
        subtitle:
          'Evolving the archive as a localized, theme-aware, commandable, and contained product.',
      },
      {
        title: 'range',
        subtitle:
          'Keeping Go, Java, C#, TypeScript, Python, and functional programming in dialogue through concrete projects.',
      },
    ]);

    expect(
      localizeNarrativeRecords(narrativeContent.philosophy.records, 'pt')
    ).toEqual([
      {
        title: 'clareza',
        subtitle:
          'Fronteiras explícitas, fluxos legíveis e nomes que deixam o próximo passo mais calmo.',
      },
      {
        title: 'confiabilidade',
        subtitle:
          'Latência, fallback, observabilidade e recuperação como parte da promessa do produto.',
      },
      {
        title: 'interfaces',
        subtitle:
          'Contratos pequenos, fáceis de entender, testar e evoluir.',
      },
      {
        title: 'IA com autoria',
        subtitle:
          'IA como alavanca para explorar, revisar e entregar, mantendo julgamento e responsabilidade no engenheiro.',
      },
      {
        title: 'restrições',
        subtitle:
          'Execução calma em sistemas reais, com legado, prazos, conhecimento incompleto e produção.',
      },
    ]);
  });

  it('falls back to the local narrative source when context content is missing', () => {
    expect(resolveNarrativeContent(null)).toBe(narrativeContent);
    expect(resolveNarrativeContent({})).toBe(narrativeContent);
  });
});
