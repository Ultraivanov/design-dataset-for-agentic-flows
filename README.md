# design-db

A curated dataset of web design references, analyzed through a consistent lens and stored as machine-readable YAML.

## Purpose

Most design galleries (Mobbin, Land-book, Godly) optimize for browsing screenshots. This repository optimizes for **structured understanding** — each site is broken down along the same axes (typography, color, layout, motion, signature move, design tokens) so the dataset can be:

- Used as few-shot reference for AI tools that generate or critique UI
- Queried programmatically to find sites that share a specific style token or aesthetic direction
- Compared across time to track the evolution of web design idioms
- Mined for pattern clusters (e.g. "editorial-serif VC sites", "industrial B2B infra sites")

## Repository structure

\`\`\`
design-db/
├── README.md
├── schema/
│   ├── site.schema.yaml        # canonical schema, one source of truth
│   └── site.schema.json        # JSON Schema for validation
├── sites/
│   ├── crusoe-ai.yaml
│   ├── dcvc-com.yaml
│   └── artsvuni-com.yaml
├── scripts/
│   ├── yaml-to-json.js         # build single export.json from all sites
│   └── validate.js             # validate every site file against schema
└── export.json                 # generated; all sites as a single array
\`\`\`

## How to add a site

1. Duplicate an existing file in \`sites/\` or start from \`schema/site.schema.yaml\`.
2. Fill every required field. Prefer specificity over hedging — if you can't identify a font family, name the closest reference ("feels like GT Sectra").
3. Keep the \`one_liner\` under 15 words; it's the record's headline.
4. Run \`npm run check\` to validate and regenerate \`export.json\`.

## License

MIT. The analyses are original. Referenced sites remain the property of their owners; this repo does not redistribute assets or screenshots — only written analysis.
