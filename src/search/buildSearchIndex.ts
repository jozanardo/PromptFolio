import { resolveNarrativeContent } from '../content/narrative';
import { resolveProfileContent } from '../content/profile';
import { resolveProjectContent } from '../content/projects';
import { resolveTimelineContent } from '../content/timeline';
import { buildProjectCatalog } from '../services/projectCatalog';
import type {
  CommandContext,
  CommandRegistryLike,
  SupportedLocale,
} from '../types';
import type { SearchRecord } from './types';

type SearchContent = CommandContext['content'];
type SearchProjectCatalog = CommandContext['projectCatalog'];

export interface BuildSearchIndexInput {
  lang: SupportedLocale;
  registry: CommandRegistryLike;
  content: SearchContent;
  projectCatalog: SearchProjectCatalog;
}

function joinMeta(
  parts: Array<string | number | null | undefined>
): string | undefined {
  const meta = parts.filter(Boolean).join(' · ');
  return meta || undefined;
}

export function buildSearchIndex({
  lang,
  registry,
  content,
  projectCatalog,
}: BuildSearchIndexInput): SearchRecord[] {
  const records: SearchRecord[] = [];
  const profile = resolveProfileContent(content.profile);
  const projects = buildProjectCatalog(
    resolveProjectContent(content.projects),
    projectCatalog.repos
  );
  const timeline = resolveTimelineContent(content.timeline);
  const narrative = resolveNarrativeContent(content.narrative);

  registry.list('search').forEach(definition => {
    records.push({
      id: `command:${definition.meta.name}`,
      kind: 'command',
      locale: lang,
      title: definition.meta.name,
      subtitle: definition.meta.description[lang],
      command: definition.meta.name,
      meta: definition.meta.category,
      keywords: [
        definition.meta.name,
        definition.meta.category,
        definition.meta.usage[lang],
      ],
      body: [definition.meta.description[lang], definition.meta.usage[lang]],
      weight: 8,
    });
  });

  projects.forEach(project => {
    records.push({
      id: `project:${project.slug}`,
      kind: 'project',
      locale: lang,
      title: project.slug,
      subtitle: project.summary[lang],
      command: project.featured
        ? `work --name ${project.slug}`
        : `archive --name ${project.slug}`,
      meta: joinMeta([project.language, project.year, project.status]),
      href: project.url,
      keywords: [
        project.slug,
        project.repoName,
        project.language ?? '',
        project.status,
        ...project.tags,
      ],
      body: [
        project.summary[lang],
        project.impact[lang],
        project.remoteDescription ?? '',
      ],
      weight: project.featured ? 11 : 5,
    });
  });

  timeline.entries.forEach(entry => {
    records.push({
      id: `timeline:${entry.id}`,
      kind: 'timeline',
      locale: lang,
      title: entry.title[lang],
      subtitle: entry.summary[lang],
      command: 'timeline',
      meta: joinMeta([entry.period[lang], entry.kind]),
      keywords: [
        entry.id,
        entry.kind,
        entry.cycle,
        entry.cycleLabel[lang],
        ...entry.relatedProjects,
        ...entry.tags,
      ],
      body: [entry.title[lang], entry.summary[lang], entry.period[lang]],
      weight: 6,
    });
  });

  timeline.journey.forEach(section => {
    records.push({
      id: `journey:${section.id}`,
      kind: 'journey',
      locale: lang,
      title: section.title[lang],
      subtitle: section.summary[lang],
      command: 'journey',
      meta: 'journey',
      keywords: [section.id, ...section.references],
      body: [section.title[lang], section.summary[lang]],
      weight: 6,
    });
  });

  profile.whoami.records.forEach(record => {
    records.push({
      id: `profile:whoami:${record.title.en}`,
      kind: 'profile',
      locale: lang,
      title: record.title[lang],
      subtitle: record.subtitle[lang],
      command: 'whoami',
      meta: 'whoami',
      keywords: [record.title.en, record.title.pt],
      body: [profile.whoami.intro[lang], record.subtitle[lang]],
      weight: 5,
    });
  });

  profile.about.records.forEach(record => {
    records.push({
      id: `profile:about:${record.title.en}`,
      kind: 'profile',
      locale: lang,
      title: record.title[lang],
      subtitle: record.subtitle[lang],
      command: 'about',
      meta: record.meta?.[lang] ?? 'about',
      keywords: [record.title.en, record.title.pt],
      body: [profile.about.intro[lang], record.subtitle[lang]],
      weight: 5,
    });
  });

  profile.skills.categories.forEach(record => {
    records.push({
      id: `profile:skills:${record.title.en}`,
      kind: 'profile',
      locale: lang,
      title: record.title[lang],
      subtitle: record.subtitle[lang],
      command: 'skills',
      meta: 'skills',
      keywords: [record.title.en, record.title.pt],
      body: [record.subtitle[lang]],
      weight: 5,
    });
  });

  profile.contact.channels.forEach(record => {
    records.push({
      id: `contact:${record.title.en}`,
      kind: 'contact',
      locale: lang,
      title: record.title[lang],
      subtitle: record.subtitle[lang],
      command: 'contact',
      meta: 'contact',
      href: record.href,
      keywords: [record.title.en, record.title.pt],
      body: [record.subtitle[lang], profile.contact.note[lang]],
      weight: 4,
    });
  });

  narrative.now.records.forEach(record => {
    records.push({
      id: `narrative:now:${record.title.en}`,
      kind: 'narrative',
      locale: lang,
      title: record.title[lang],
      subtitle: record.subtitle[lang],
      command: 'now',
      meta: 'now',
      keywords: [record.title.en, record.title.pt],
      body: [narrative.now.intro[lang], record.subtitle[lang]],
      weight: 5,
    });
  });

  narrative.philosophy.records.forEach(record => {
    records.push({
      id: `narrative:philosophy:${record.title.en}`,
      kind: 'narrative',
      locale: lang,
      title: record.title[lang],
      subtitle: record.subtitle[lang],
      command: 'philosophy',
      meta: 'philosophy',
      keywords: [record.title.en, record.title.pt],
      body: [narrative.philosophy.intro[lang], record.subtitle[lang]],
      weight: 5,
    });
  });

  return records;
}
