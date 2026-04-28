import type { LocalizedText, RecordListEntry, SupportedLocale } from '../../types';

export interface LocalizedRecord {
  title: LocalizedText;
  meta?: LocalizedText;
  subtitle: LocalizedText;
  href?: string;
}

export interface ProfileContent {
  whoami: {
    intro: LocalizedText;
    title: LocalizedText;
    records: LocalizedRecord[];
  };
  about: {
    intro: LocalizedText;
    title: LocalizedText;
    records: LocalizedRecord[];
  };
  skills: {
    title: LocalizedText;
    categories: LocalizedRecord[];
  };
  contact: {
    title: LocalizedText;
    channels: LocalizedRecord[];
    note: LocalizedText;
  };
}

export function localizeRecords(
  records: readonly LocalizedRecord[],
  lang: SupportedLocale
): RecordListEntry[] {
  return records.map(record => {
    const localizedRecord: RecordListEntry = {
      title: record.title[lang],
      subtitle: record.subtitle[lang],
    };

    if (record.meta) {
      localizedRecord.meta = record.meta[lang];
    }

    if (record.href) {
      localizedRecord.href = record.href;
    }

    return localizedRecord;
  });
}

export const profileContent: ProfileContent = {
  whoami: {
    intro: {
      en: 'João Zanardo is a Software Engineer focused on high-scale distributed systems, backend performance, resilience, and scalable architecture.',
      pt: 'João Zanardo é Engenheiro de Software com foco em sistemas distribuídos de alta escala, desempenho em backend, resiliência e arquitetura escalável.',
    },
    title: {
      en: 'Identity snapshot:',
      pt: 'Resumo de identidade:',
    },
    records: [
      {
        title: {
          en: 'focus',
          pt: 'foco',
        },
        subtitle: {
          en: 'Building resilient backend services for cross-border shipping and delivery promises at Mercado Livre.',
          pt: 'Construção de serviços de backend resilientes para envios internacionais e promessas de entrega no Mercado Livre.',
        },
      },
      {
        title: {
          en: 'scale',
          pt: 'escala',
        },
        subtitle: {
          en: 'Working with services that evolved from under 1k to more than 11k requests per minute.',
          pt: 'Atuação em serviços que evoluíram de menos de 1k para mais de 11k requisições por minuto.',
        },
      },
      {
        title: {
          en: 'direction',
          pt: 'direção',
        },
        subtitle: {
          en: 'Deepening system design, high-scale engineering, and practical AI applied to production systems.',
          pt: 'Aprofundamento em desenho de sistemas, engenharia de alta escala e IA aplicada a sistemas em produção.',
        },
      },
    ],
  },
  about: {
    intro: {
      en: 'I am a Software Engineer with experience in high-scale distributed systems, graduated in Science and Technology with an emphasis in Computing from UFABC and currently pursuing postgraduate studies in Software Engineering focused on applied Artificial Intelligence.',
      pt: 'Sou Engenheiro de Software com experiência em sistemas distribuídos de alta escala, formado em Ciência e Tecnologia com ênfase em Computação pela UFABC e pós-graduando em Engenharia de Software com foco em Inteligência Artificial aplicada.',
    },
    title: {
      en: 'Career path:',
      pt: 'Trajetória:',
    },
    records: [
      {
        title: {
          en: 'Santander',
          pt: 'Santander',
        },
        meta: {
          en: 'April 2021 - March 2022',
          pt: 'abril de 2021 - março de 2022',
        },
        subtitle: {
          en: 'Cybersecurity and audit work, building a foundation in security, governance, and analysis of critical systems.',
          pt: 'Segurança cibernética e auditoria, com base em segurança, governança e análise de sistemas críticos.',
        },
      },
      {
        title: {
          en: 'BTG Pactual',
          pt: 'BTG Pactual',
        },
        meta: {
          en: 'March 2022 - August 2025',
          pt: 'março de 2022 - agosto de 2025',
        },
        subtitle: {
          en: 'Building scalable C# systems, automation, legacy evolution, and migrations in a critical financial environment.',
          pt: 'Desenvolvimento de sistemas escaláveis em C#, automações, evolução de legados e migrações em ambiente financeiro crítico.',
        },
      },
      {
        title: {
          en: 'Mercado Livre',
          pt: 'Mercado Livre',
        },
        meta: {
          en: 'September 2025 - present',
          pt: 'setembro de 2025 - atualmente',
        },
        subtitle: {
          en: 'Software Engineer in Shipping, Cross Border Trade, working on shipment orchestration and delivery promises for international purchases.',
          pt: 'Engenheiro de Software na equipe de envios internacionais, atuando na orquestração de envios e promessas de entrega para compras internacionais.',
        },
      },
    ],
  },
  skills: {
    title: {
      en: 'Skills by category:',
      pt: 'Habilidades por categoria:',
    },
    categories: [
      {
        title: {
          en: 'languages',
          pt: 'linguagens',
        },
        subtitle: {
          en: 'Java, Go, C#, JavaScript, TypeScript, Python',
          pt: 'Java, Go, C#, JavaScript, TypeScript, Python',
        },
      },
      {
        title: {
          en: 'backend',
          pt: 'backend',
        },
        subtitle: {
          en: 'Microservices, APIs, distributed systems, event-driven architecture, and high-performance services',
          pt: 'Microsserviços, APIs, sistemas distribuídos, arquitetura orientada a eventos e serviços de alto desempenho',
        },
      },
      {
        title: {
          en: 'resilience',
          pt: 'resiliência',
        },
        subtitle: {
          en: 'Circuit breakers, retry, fallback, multi-layer caching, and operational efficiency',
          pt: 'Isolamento de falhas, retentativas, estratégias de contingência, cache em múltiplas camadas e eficiência operacional',
        },
      },
      {
        title: {
          en: 'performance',
          pt: 'desempenho',
        },
        subtitle: {
          en: 'Virtual threads, concurrency, parallelism, latency, and throughput',
          pt: 'Threads virtuais, concorrência, paralelismo, latência e vazão',
        },
      },
      {
        title: {
          en: 'observability',
          pt: 'observabilidade',
        },
        subtitle: {
          en: 'Logs with Grafana, metrics with Datadog, tracing, and production behavior analysis',
          pt: 'Logs no Grafana, métricas no Datadog, rastreamento distribuído e análise de comportamento em produção',
        },
      },
    ],
  },
  contact: {
    title: {
      en: 'Verified channels:',
      pt: 'Canais verificados:',
    },
    channels: [
      {
        title: {
          en: 'GitHub',
          pt: 'GitHub',
        },
        subtitle: {
          en: 'https://github.com/jozanardo',
          pt: 'https://github.com/jozanardo',
        },
        href: 'https://github.com/jozanardo',
      },
      {
        title: {
          en: 'LinkedIn',
          pt: 'LinkedIn',
        },
        subtitle: {
          en: 'https://www.linkedin.com/in/joão-zanardo/',
          pt: 'https://www.linkedin.com/in/joão-zanardo/',
        },
        href: 'https://www.linkedin.com/in/joão-zanardo/',
      },
      {
        title: {
          en: 'Email',
          pt: 'E-mail',
        },
        subtitle: {
          en: 'jozanardo@gmail.com',
          pt: 'jozanardo@gmail.com',
        },
        href: 'mailto:jozanardo@gmail.com',
      },
    ],
    note: {
      en: 'GitHub, LinkedIn, and email are the verified public channels for this archive.',
      pt: 'GitHub, LinkedIn e e-mail são os canais públicos verificados deste arquivo.',
    },
  },
};
