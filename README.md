# PromptFolio

PromptFolio is a bilingual, theme-aware personal command archive. It presents
portfolio content through a calm terminal-inspired interface where commands,
reading, and curated project discovery live in the same editorial flow.

## Current V2 Status

- Phase 0: command runtime foundation - done.
- Phase 1: initial discovery with `start`, `help`, and `ls` - done.
- Phase 2: identity commands with `about`, `whoami`, `skills`, and `contact` - done.
- Phase 3: editorial work catalog with `work` and `archive` - done.

## Implemented Commands

- `start`: opens the archive map.
- `help`: lists registered commands from command metadata.
- `ls`: shows a compact directory grouped by archive area.
- `whoami`, `about`, `skills`, `contact`: local bilingual identity content.
- `work`: shows selected/featured work from the curated catalog.
- `archive`: shows the complete historical project catalog.
- `clear`: clears the terminal history through a structured side effect.

The legacy public `projects` and `highlights` commands are intentionally no
longer registered.

## Work Catalog

The project catalog is local-first and optionally enriched by GitHub metadata.
Local content in `src/content/projects` owns the editorial fields, while GitHub
may enrich language, URL, update, and remote description data.

- `work` shows only `featured` projects.
- `archive` shows the full catalog.
- Both commands support `--lang`, `--text`, `--name`, `--tag`,
  `--list-langs`, and `--help`.
- `--desc` remains supported as a compatibility alias for `--text`, but the
  documented flag is `--text`.

## Development

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

## Planning

The detailed V2 implementation plan lives in `plan_v2.md`.
