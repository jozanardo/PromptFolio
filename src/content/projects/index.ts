import type { LocalizedText } from '../../types';

export type ProjectStatus = 'active' | 'study' | 'archive' | 'lab';

export interface CuratedProject {
  slug: string;
  repoName: string;
  featured: boolean;
  highlighted: boolean;
  summary: LocalizedText;
  impact: LocalizedText;
  tags: string[];
  status: ProjectStatus;
  year: number;
  order: number;
  primaryLanguage: string | null;
  links: {
    repo: string;
  };
}

export interface ProjectContent {
  projects: CuratedProject[];
}

export function resolveProjectContent(
  projects: ProjectContent | null
): ProjectContent {
  return projects ?? projectContent;
}

export const projectContent: ProjectContent = {
  projects: [
    {
      slug: 'promptfolio',
      repoName: 'PromptFolio',
      featured: true,
      highlighted: true,
      summary: {
        en: 'Command-guided portfolio shaped as a calm personal archive.',
        pt: 'Portfólio guiado por comandos, moldado como um arquivo pessoal calmo.',
      },
      impact: {
        en: 'Turns a portfolio into a localized, theme-aware command archive where interaction and reading coexist naturally.',
        pt: 'Transforma um portfólio em um arquivo de comandos localizado e sensível a tema, onde leitura e interação convivem naturalmente.',
      },
      tags: ['portfolio', 'typescript', 'terminal', 'i18n'],
      status: 'active',
      year: 2026,
      order: 10,
      primaryLanguage: 'TypeScript',
      links: {
        repo: 'https://github.com/jozanardo/PromptFolio',
      },
    },
    {
      slug: 'myorders',
      repoName: 'MyOrders',
      featured: true,
      highlighted: true,
      summary: {
        en: 'Order-management backend project focused on C# service boundaries and domain modeling.',
        pt: 'Projeto de backend para gestão de pedidos, focado em fronteiras de serviço em C# e modelagem de domínio.',
      },
      impact: {
        en: 'Represents the backend and domain-modeling axis in C#, aligned with experience in critical systems.',
        pt: 'Representa o eixo de backend e modelagem de domínio em C#, alinhado à experiência com sistemas críticos.',
      },
      tags: ['backend', 'csharp', 'orders'],
      status: 'active',
      year: 2025,
      order: 20,
      primaryLanguage: 'C#',
      links: {
        repo: 'https://github.com/jozanardo/MyOrders',
      },
    },
    {
      slug: 'lambda-chess',
      repoName: 'Lambda_Chess',
      featured: true,
      highlighted: false,
      summary: {
        en: 'Chess engine in Haskell built as a programming paradigms final project.',
        pt: 'Engine de xadrez em Haskell construída como projeto final de paradigmas de programação.',
      },
      impact: {
        en: 'Keeps functional programming visible in the archive as a different way to reason about rules and state.',
        pt: 'Mantém programação funcional visível no arquivo como outro modo de pensar sobre regras e estado.',
      },
      tags: ['haskell', 'functional-programming', 'chess'],
      status: 'study',
      year: 2025,
      order: 30,
      primaryLanguage: 'Haskell',
      links: {
        repo: 'https://github.com/jozanardo/Lambda_Chess',
      },
    },
    {
      slug: 'grafica-3d-animacoes',
      repoName: 'Aplicao-grafica-3D-com-animacoes',
      featured: false,
      highlighted: false,
      summary: {
        en: 'C++ computer graphics project with 3D animation, lighting, and texture work.',
        pt: 'Projeto de computação gráfica em C++ com animações 3D, iluminação e texturização.',
      },
      impact: {
        en: 'Preserves the graphics and visual-computing side of the academic archive.',
        pt: 'Preserva o lado de computação gráfica e visual do arquivo acadêmico.',
      },
      tags: ['cpp', 'computer-graphics', '3d'],
      status: 'study',
      year: 2023,
      order: 40,
      primaryLanguage: 'C++',
      links: {
        repo: 'https://github.com/jozanardo/Aplicao-grafica-3D-com-animacoes',
      },
    },
    {
      slug: 'napster',
      repoName: 'Napster',
      featured: true,
      highlighted: false,
      summary: {
        en: 'Peer-to-peer file sharing study project in Java, focused on distributed communication and networked coordination.',
        pt: 'Projeto de compartilhamento de arquivos peer-to-peer em Java, focado em comunicação distribuída e coordenação em rede.',
      },
      impact: {
        en: 'Shows applied networking practice and early distributed-systems modeling in Java.',
        pt: 'Mostra prática aplicada de redes e modelagem inicial de sistemas distribuídos em Java.',
      },
      tags: ['java', 'distributed-systems', 'networking'],
      status: 'study',
      year: 2023,
      order: 50,
      primaryLanguage: 'Java',
      links: {
        repo: 'https://github.com/jozanardo/Napster',
      },
    },
    {
      slug: 'zookepeer',
      repoName: 'zookepeer',
      featured: true,
      highlighted: false,
      summary: {
        en: 'Coordination-oriented Java study around distributed systems concepts and service organization.',
        pt: 'Estudo em Java orientado a coordenação, conceitos de sistemas distribuídos e organização de serviços.',
      },
      impact: {
        en: 'Complements the archive with distributed coordination practice and Java service reasoning.',
        pt: 'Complementa o arquivo com prática de coordenação distribuída e raciocínio de serviços em Java.',
      },
      tags: ['java', 'distributed-systems', 'coordination'],
      status: 'study',
      year: 2023,
      order: 60,
      primaryLanguage: 'Java',
      links: {
        repo: 'https://github.com/jozanardo/zookepeer',
      },
    },
    {
      slug: 'clean-node',
      repoName: '05-nest-clean',
      featured: false,
      highlighted: false,
      summary: {
        en: 'NestJS clean architecture exercise focused on backend boundaries and testable modules.',
        pt: 'Exercício de clean architecture com NestJS, focado em fronteiras de backend e módulos testáveis.',
      },
      impact: {
        en: 'Records study in modular backend architecture and pragmatic TypeScript service design.',
        pt: 'Registra estudo em arquitetura backend modular e desenho pragmático de serviços em TypeScript.',
      },
      tags: ['typescript', 'nestjs', 'clean-architecture'],
      status: 'study',
      year: 2025,
      order: 70,
      primaryLanguage: 'TypeScript',
      links: {
        repo: 'https://github.com/jozanardo/05-nest-clean',
      },
    },
  ],
};
