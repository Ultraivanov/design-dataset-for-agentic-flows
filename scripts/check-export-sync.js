#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = path.resolve(__dirname, '..');
const exportPath = path.join(repoRoot, 'export.json');

const committed = fs.readFileSync(exportPath, 'utf8');

execSync('node scripts/yaml-to-json.js', { cwd: repoRoot, stdio: 'inherit' });

const rebuilt = fs.readFileSync(exportPath, 'utf8');
const a = JSON.stringify(JSON.parse(committed));
const b = JSON.stringify(JSON.parse(rebuilt));

if (a !== b) {
  console.error('::error::export.json is out of date. Run `npm run build` locally and commit the result.');
  process.exit(1);
}
console.log('export.json is in sync with YAML sources.');
