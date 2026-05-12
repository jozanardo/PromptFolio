import type { LocalizedText, RecordListEntry, SupportedLocale } from '../../types';

export interface NarrativeRecord {
  title: LocalizedText;
  subtitle: LocalizedText;
}

export interface NarrativeSection {
  intro: LocalizedText;
  title: LocalizedText;
  records: NarrativeRecord[];
}

export interface NarrativeContent {
  now: NarrativeSection;
  philosophy: NarrativeSection;
}

export function localizeNarrativeRecords(
  records: readonly NarrativeRecord[],
  lang: SupportedLocale
): RecordListEntry[] {
  return records.map(record => ({
    title: record.title[lang],
    subtitle: record.subtitle[lang],
  }));
}

export function resolveNarrativeContent(
  narrative: NarrativeContent | null | unknown
): NarrativeContent {
  return isNarrativeContent(narrative) ? narrative : narrativeContent;
}

function isNarrativeContent(
  narrative: unknown
): narrative is NarrativeContent {
  return (
    typeof narrative === 'object' &&
    narrative !== null &&
    isNarrativeSection((narrative as NarrativeContent).now) &&
    isNarrativeSection((narrative as NarrativeContent).philosophy)
  );
}

function isNarrativeSection(section: unknown): section is NarrativeSection {
  return (
    typeof section === 'object' &&
    section !== null &&
    isLocalizedText((section as NarrativeSection).intro) &&
    isLocalizedText((section as NarrativeSection).title) &&
    Array.isArray((section as NarrativeSection).records) &&
    (section as NarrativeSection).records.every(isNarrativeRecord)
  );
}

function isNarrativeRecord(record: unknown): record is NarrativeRecord {
  return (
    typeof record === 'object' &&
    record !== null &&
    isLocalizedText((record as NarrativeRecord).title) &&
    isLocalizedText((record as NarrativeRecord).subtitle)
  );
}

function isLocalizedText(text: unknown): text is LocalizedText {
  return (
    typeof text === 'object' &&
    text !== null &&
    typeof (text as LocalizedText).en === 'string' &&
    typeof (text as LocalizedText).pt === 'string'
  );
}

export const narrativeContent: NarrativeContent = {
  now: {
    intro: {
      en: 'Right now, my attention is on backend reliability, applied AI, and keeping PromptFolio as a clear authored archive instead of a decorative portfolio.',
      pt: 'Neste momento, minha atenção está em confiabilidade de backend, IA aplicada e em manter o PromptFolio como um arquivo autoral claro em vez de um portfólio decorativo.',
    },
    title: {
      en: 'Current focus:',
      pt: 'Foco atual:',
    },
    records: [
      {
        title: {
          en: 'backend',
          pt: 'backend',
        },
        subtitle: {
          en: 'Resilient services for international shipping promises, operational clarity, and predictable production behavior.',
          pt: 'Serviços resilientes para promessas de envio internacional, clareza operacional e comportamento previsível em produção.',
        },
      },
      {
        title: {
          en: 'AI',
          pt: 'IA',
        },
        subtitle: {
          en: 'Applied AI in engineering without hiding tradeoffs, context, or responsibility.',
          pt: 'Uso de IA aplicada em engenharia sem esconder tradeoffs, contexto ou responsabilidade.',
        },
      },
      {
        title: {
          en: 'PromptFolio',
          pt: 'PromptFolio',
        },
        subtitle: {
          en: 'Evolving the archive as a localized, theme-aware, commandable, and contained product.',
          pt: 'Evolução do arquivo como produto localizado, theme-aware, comandável e contido.',
        },
      },
      {
        title: {
          en: 'range',
          pt: 'amplitude',
        },
        subtitle: {
          en: 'Keeping Go, Java, C#, TypeScript, Python, and functional programming in dialogue through concrete projects.',
          pt: 'Manter Go, Java, C#, TypeScript, Python e programação funcional em diálogo por projetos concretos.',
        },
      },
    ],
  },
  philosophy: {
    intro: {
      en: 'The engineering philosophy here is practical: software should make constraints visible, reduce operational surprise, and help people decide with more clarity.',
      pt: 'A filosofia de engenharia aqui é prática: software deve tornar restrições visíveis, reduzir surpresa operacional e ajudar pessoas a decidir com mais clareza.',
    },
    title: {
      en: 'Working principles:',
      pt: 'Princípios de trabalho:',
    },
    records: [
      {
        title: {
          en: 'clarity',
          pt: 'clareza',
        },
        subtitle: {
          en: 'Explicit boundaries, legible flows, and names that make the next step calmer.',
          pt: 'Fronteiras explícitas, fluxos legíveis e nomes que deixam o próximo passo mais calmo.',
        },
      },
      {
        title: {
          en: 'reliability',
          pt: 'confiabilidade',
        },
        subtitle: {
          en: 'Latency, fallback, observability, and recovery as part of the product promise.',
          pt: 'Latência, fallback, observabilidade e recuperação como parte da promessa do produto.',
        },
      },
      {
        title: {
          en: 'interfaces',
          pt: 'interfaces',
        },
        subtitle: {
          en: 'Small contracts that are easy to understand, test, and evolve.',
          pt: 'Contratos pequenos, fáceis de entender, testar e evoluir.',
        },
      },
      {
        title: {
          en: 'AI ownership',
          pt: 'IA com autoria',
        },
        subtitle: {
          en: 'AI as leverage to explore, review, and deliver while keeping judgment and responsibility with the engineer.',
          pt: 'IA como alavanca para explorar, revisar e entregar, mantendo julgamento e responsabilidade no engenheiro.',
        },
      },
      {
        title: {
          en: 'constraints',
          pt: 'restrições',
        },
        subtitle: {
          en: 'Calm execution in real systems, with legacy code, deadlines, incomplete knowledge, and production.',
          pt: 'Execução calma em sistemas reais, com legado, prazos, conhecimento incompleto e produção.',
        },
      },
    ],
  },
};
