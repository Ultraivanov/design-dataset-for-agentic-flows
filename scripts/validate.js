#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const repoRoot = path.resolve(__dirname, '..');
const sitesDir = path.join(repoRoot, 'sites');
const schemaPath = path.join(repoRoot, 'schema', 'site.schema.json');

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

const files = fs.readdirSync(sitesDir)
  .filter(f => f.endsWith('.yaml') || f.endsWith('.yml'))
  .sort();

let failures = 0;
for (const f of files) {
  const raw = fs.readFileSync(path.join(sitesDir, f), 'utf8');
  let data;
  try { data = yaml.load(raw); }
  catch (err) {
    console.error(`✗ ${f}: YAML parse error — ${err.message}`);
    failures++;
    continue;
  }
  const ok = validate(data);
  if (!ok) {
    failures++;
    console.error(`✗ ${f}:`);
    for (const e of validate.errors) {
      console.error(`    ${e.instancePath || '(root)'} ${e.message}`);
    }
  } else {
    console.log(`✓ ${f}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} file(s) failed validation.`);
  process.exit(1);
}
console.log(`\nAll ${files.length} file(s) valid.`);
