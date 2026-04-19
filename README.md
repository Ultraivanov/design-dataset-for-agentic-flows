# design-dataset-for-agentic-flows

A curated dataset of web design references, analyzed through a consistent lens and stored as machine-readable YAML. Built to serve as structured reference material for agentic design tools.

[![Validate](https://github.com/Ultraivanov/design-dataset-for-agentic-flows/actions/workflows/validate.yml/badge.svg)](https://github.com/Ultraivanov/design-dataset-for-agentic-flows/actions/workflows/validate.yml)
[![Sites](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2FUltraivanov%2Fdesign-dataset-for-agentic-flows%2Fmain%2Fbadge-stats.json&query=%24.sites&style=flat)](./sites)
[![Curated by](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2FUltraivanov%2Fdesign-dataset-for-agentic-flows%2Fmain%2Fbadge-stats.json&query=%24.contributors&style=flat)](./CONTRIBUTING.md)

## Why this exists

Most design galleries (Mobbin, Land-book, Godly) optimize for browsing screenshots. This repository optimizes for **structured understanding** — each site is broken down along the same axes (typography, color, layout, motion, signature move, design tokens) so the dataset can be:

- Used as few-shot reference for AI tools that generate or critique UI
- Queried programmatically to find sites that share a specific style token or aesthetic direction
- Compared across time to track the evolution of web design idioms
- Mined for pattern clusters (e.g. "editorial-serif VC sites", "industrial B2B infra sites")

Each entry is a single YAML file. All entries are also compiled into a single `export.json` for easy consumption.

## Repository structure
## Schema at a glance

Every site entry contains:

- **direction** — a one-line characterization plus tags
- **typography** — display and body faces, contrast, notes
- **color** — mode, background, foreground, named accents with roles
- **layout** — grid, density, signature compositional moves
- **motion** — philosophy, techniques, library guess
- **texture** — backgrounds and depth
- **signature_detail** — the one thing that makes the site memorable
- **stack_guess** — framework, evidence, confidence
- **applicability** — contexts where the style works, contexts to avoid
- **design_tokens** — paste-ready CSS variables derived from observation

See `schema/site.schema.yaml` for the full reference, or `schema/site.schema.json` for the validation rules.

## Adding a new site

1. Create `sites/<slug>.yaml`. The slug is kebab-case and matches the `id` field.
2. Fill every required field. Prefer specificity over hedging — if you can't identify a font family, name the closest reference ("feels like GT Sectra").
3. Keep `direction.one_liner` under 15 words.
4. Run the full check:

```bash
npm install          # first time only
npm run check        # validates + regenerates export.json
```

5. Commit both the new site file and the updated `export.json`:

```bash
git add sites/<slug>.yaml export.json
git commit -m "Add <slug>"
git push
```

CI will re-run validation on push. If `export.json` drifts from the YAML sources, the build fails.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run validate` | Validates every file in `sites/` against the JSON Schema |
| `npm run build` | Rebuilds `export.json` from all YAML sources |
| `npm run check` | Runs validate then build (use before committing) |

## Principles

- **One site, one file.** No bundling, no mega-files.
- **Describe, don't prescribe.** Capture what the site does, not what it should do.
- **Every site has exactly one signature move.** Name it explicitly in `signature_detail` — if you can't, the analysis isn't finished yet.
- **Design tokens are code tokens.** Write values as you would paste them into a stylesheet.
- **Track confidence.** If you're guessing a stack or a hex value, say so.

## Using the dataset

The simplest integration is to read `export.json` directly:

```js
import sites from './export.json' assert { type: 'json' };

const editorialSerifSites = sites.filter(s =>
  s.direction.tags.includes('editorial') &&
  s.direction.tags.includes('serif')
);
```

For agentic use cases, each record is small enough to fit into a prompt as a few-shot example. Pair `direction.one_liner`, `signature_detail`, and `design_tokens` for the most compact useful slice.

## License

MIT. Analyses are original work. Referenced sites remain the property of their owners; this repository does not redistribute assets or screenshots — only written observation.
