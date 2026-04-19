#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const repoRoot = path.resolve(__dirname, '..');
const sitesDir = path.join(repoRoot, 'sites');
const exportPath = path.join(repoRoot, 'export.json');
const statsPath = path.join(repoRoot, 'badge-stats.json');

const files = fs.readdirSync(sitesDir)
  .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
  .sort();

const records = files.map(f => {
  const raw = fs.readFileSync(path.join(sitesDir, f), 'utf8');
  try { return yaml.load(raw); }
  catch (err) {
    console.error(`Failed to parse ${f}:`, err.message);
    process.exit(1);
  }
});

records.sort((a, b) => (a.id || '').localeCompare(b.id || ''));
fs.writeFileSync(exportPath, JSON.stringify(records, null, 2) + '\n');

// compute stats for shields.io endpoint badges
const contributors = new Set();
for (const r of records) {
  const name = r?.credits?.suggested_by?.name;
  if (name && name.trim()) contributors.add(name.trim());
}

// shields.io endpoint format: https://shields.io/endpoint
const stats = {
  sites: {
    schemaVersion: 1,
    label: "sites",
    message: String(records.length),
    color: "black"
  },
  contributors: {
    schemaVersion: 1,
    label: "curated by",
    message: contributors.size === 0
      ? "the maintainer"
      : `${contributors.size} designer${contributors.size === 1 ? "" : "s"}`,
    color: "black"
  }
};

fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2) + '\n');

console.log(`Wrote ${records.length} records to ${path.relative(repoRoot, exportPath)}`);
console.log(`Wrote badge stats to ${path.relative(repoRoot, statsPath)} (${records.length} sites, ${contributors.size} contributors)`);
