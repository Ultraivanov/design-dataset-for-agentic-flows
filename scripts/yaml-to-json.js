#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const repoRoot = path.resolve(__dirname, '..');
const sitesDir = path.join(repoRoot, 'sites');
const outPath = path.join(repoRoot, 'export.json');

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
fs.writeFileSync(outPath, JSON.stringify(records, null, 2) + '\n');
console.log(`Wrote ${records.length} records to ${path.relative(repoRoot, outPath)}`);
