import type { LocalizedText } from '../../types';

export type TimelineKind = 'career' | 'project' | 'study';
export type TimelineCycle = 'active-craft' | 'technical-range' | 'critical-systems';

export interface TimelineEntry {
  id: string;
  startYear: number;
  endYear?: number;
  groupYear?: number;
  current?: boolean;
  order: number;
  kind: TimelineKind;
  cycle: TimelineCycle;
  cycleLabel: LocalizedText;
  period: LocalizedText;
  title: LocalizedText;
  summary: LocalizedText;
  relatedProjects: string[];
  tags: string[];
}

export interface JourneySection {
  id: TimelineCycle;
  order: number;
  title: LocalizedText;
  summary: LocalizedText;
  references: string[];
}

export interface TimelineContent {
  entries: TimelineEntry[];
  journey: JourneySection[];
}

export function resolveTimelineContent(
  timeline: TimelineContent | null | unknown
): TimelineContent {
  return isTimelineContent(timeline) ? timeline : timelineContent;
}

function isTimelineContent(timeline: unknown): timeline is TimelineContent {
  return (
    typeof timeline === 'object' &&
    timeline !== null &&
    Array.isArray((timeline as TimelineContent).entries) &&
    Array.isArray((timeline as TimelineContent).journey)
  );
}

export const timelineContent: TimelineContent = {
  entries: [
    {
      id: 'promptfolio-archive',
      startYear: 2026,
      order: 10,
      kind: 'project',
      cycle: 'active-craft',
      cycleLabel: {
        en: 'active craft',
        pt: 'ofício atual',
      },
      period: {
        en: '2026',
        pt: '2026',
      },
      title: {
        en: 'Archive system',
        pt: 'Arquivo de comandos',
      },
      summary: {
        en: 'PromptFolio becomes a command archive where reading, localization, themes, and project discovery share one interface.',
        pt: 'PromptFolio se torna um arquivo de comandos onde leitura, localização, temas e descoberta de projetos compartilham uma única interface.',
      },
      relatedProjects: ['promptfolio'],
      tags: ['portfolio', 'typescript'],
    },
    {
      id: 'mercado-livre',
      startYear: 2025,
      current: true,
      order: 20,
      kind: 'career',
      cycle: 'active-craft',
      cycleLabel: {
        en: 'active craft',
        pt: 'ofício atual',
      },
      period: {
        en: '2025 - present',
        pt: '2025 - atual',
      },
      title: {
        en: 'Mercado Livre',
        pt: 'Mercado Livre',
      },
      summary: {
        en: 'Backend work turns toward resilient services for international shipping promises, with reliability and operational clarity at the center.',
        pt: 'O trabalho de backend se volta a serviços resilientes para promessas de envio internacional, com confiabilidade e clareza operacional no centro.',
      },
      relatedProjects: [],
      tags: ['backend', 'resilience', 'logistics'],
    },
    {
      id: 'backend-depth',
      startYear: 2025,
      order: 30,
      kind: 'study',
      cycle: 'technical-range',
      cycleLabel: {
        en: 'technical range',
        pt: 'amplitude técnica',
      },
      period: {
        en: '2025',
        pt: '2025',
      },
      title: {
        en: 'Backend depth',
        pt: 'Profundidade backend',
      },
      summary: {
        en: 'C#, TypeScript, and functional programming studies sharpen service boundaries, domain modeling, and alternate ways to reason about state.',
        pt: 'Estudos em C#, TypeScript e programação funcional refinam fronteiras de serviço, modelagem de domínio e modos alternativos de raciocinar sobre estado.',
      },
      relatedProjects: ['myorders', 'lambda-chess', 'clean-node'],
      tags: ['backend', 'functional-programming'],
    },
    {
      id: 'btg-pactual',
      startYear: 2022,
      endYear: 2025,
      order: 40,
      kind: 'career',
      cycle: 'critical-systems',
      cycleLabel: {
        en: 'critical systems',
        pt: 'sistemas críticos',
      },
      period: {
        en: '2022 - 2025',
        pt: '2022 - 2025',
      },
      title: {
        en: 'BTG Pactual',
        pt: 'BTG Pactual',
      },
      summary: {
        en: 'Critical financial systems shape the habit of calm execution, legacy evolution, automation, and production-minded engineering.',
        pt: 'Sistemas financeiros críticos formam o hábito de execução calma, evolução de legados, automação e engenharia orientada a produção.',
      },
      relatedProjects: [],
      tags: ['critical-systems', 'csharp', 'automation'],
    },
    {
      id: 'distributed-systems-study',
      startYear: 2023,
      order: 50,
      kind: 'study',
      cycle: 'technical-range',
      cycleLabel: {
        en: 'technical range',
        pt: 'amplitude técnica',
      },
      period: {
        en: '2023',
        pt: '2023',
      },
      title: {
        en: 'Distributed systems study',
        pt: 'Estudo de sistemas distribuídos',
      },
      summary: {
        en: 'Java networking and coordination projects make distributed communication concrete through peer-to-peer and coordination exercises.',
        pt: 'Projetos de rede e coordenação em Java tornam comunicação distribuída concreta por exercícios peer-to-peer e de coordenação.',
      },
      relatedProjects: ['napster', 'zookepeer'],
      tags: ['java', 'distributed-systems'],
    },
    {
      id: 'computer-graphics',
      startYear: 2023,
      order: 60,
      kind: 'study',
      cycle: 'technical-range',
      cycleLabel: {
        en: 'technical range',
        pt: 'amplitude técnica',
      },
      period: {
        en: '2023',
        pt: '2023',
      },
      title: {
        en: 'Computer graphics',
        pt: 'Computação gráfica',
      },
      summary: {
        en: 'Graphics work adds a visual-computing branch to the archive through 3D animation, lighting, and texture practice.',
        pt: 'O trabalho gráfico adiciona uma ramificação de computação visual ao arquivo por prática de animação 3D, iluminação e textura.',
      },
      relatedProjects: ['grafica-3d-animacoes'],
      tags: ['cpp', 'computer-graphics'],
    },
    {
      id: 'santander',
      startYear: 2021,
      endYear: 2022,
      groupYear: 2022,
      order: 70,
      kind: 'career',
      cycle: 'critical-systems',
      cycleLabel: {
        en: 'critical systems',
        pt: 'sistemas críticos',
      },
      period: {
        en: '2021 - 2022',
        pt: '2021 - 2022',
      },
      title: {
        en: 'Santander',
        pt: 'Santander',
      },
      summary: {
        en: 'Cybersecurity and audit work build a foundation in governance, risk, and critical-system thinking.',
        pt: 'Segurança cibernética e auditoria constroem uma base em governança, risco e pensamento de sistemas críticos.',
      },
      relatedProjects: [],
      tags: ['security', 'audit', 'governance'],
    },
  ],
  journey: [
    {
      id: 'active-craft',
      order: 10,
      title: {
        en: 'active craft',
        pt: 'ofício atual',
      },
      summary: {
        en: 'The current layer connects product-facing backend reliability with an authored portfolio system. PromptFolio makes the archive itself part of the work: localized, theme-aware, and intentionally command-driven.',
        pt: 'A camada atual conecta confiabilidade de backend voltada a produto com um sistema autoral de portfólio. PromptFolio transforma o próprio arquivo em parte do trabalho: localizado, sensível a tema e intencionalmente guiado por comandos.',
      },
      references: ['timeline', 'work', 'promptfolio'],
    },
    {
      id: 'technical-range',
      order: 20,
      title: {
        en: 'technical range',
        pt: 'amplitude técnica',
      },
      summary: {
        en: 'The study layer widens the engineering vocabulary: C# domain modeling, TypeScript service design, Haskell state reasoning, Java distributed systems, and C++ graphics all remain visible without competing for attention.',
        pt: 'A camada de estudo amplia o vocabulário de engenharia: modelagem de domínio em C#, desenho de serviços em TypeScript, raciocínio de estado em Haskell, sistemas distribuídos em Java e computação gráfica em C++ seguem visíveis sem disputar atenção.',
      },
      references: [
        'myorders',
        'lambda-chess',
        'napster',
        'zookepeer',
        'grafica-3d-animacoes',
      ],
    },
    {
      id: 'critical-systems',
      order: 30,
      title: {
        en: 'critical systems',
        pt: 'sistemas críticos',
      },
      summary: {
        en: 'The foundation comes from security, audit, and financial systems. That background shows up as a preference for clarity, operability, and calm execution under real constraints.',
        pt: 'A fundação vem de segurança, auditoria e sistemas financeiros. Esse histórico aparece como preferência por clareza, operabilidade e execução calma sob restrições reais.',
      },
      references: ['about', '#critical-systems', '#security'],
    },
  ],
};
