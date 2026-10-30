#!/usr/bin/env node
/**
 * dump-sarga.js — Compact ISO input for meaning generation.
 *
 * Reads source/roman/<kanda>/sarga-NNN.txt (golden source, read-only) and
 * prints/writes only verse numbers + text. No separators, no placeholders.
 *
 * Usage:
 *   node src/dump-sarga.js <sarga> --kanda bala-kanda          (stdout)
 *   node src/dump-sarga.js <sarga> --kanda bala-kanda --write  (scratch/in-NNN.txt)
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const sargaArg = args.find(a => /^\d+$/.test(a) || a.toLowerCase() === 'all');
const kIdx = args.indexOf('--kanda');
const kanda = kIdx >= 0 ? args[kIdx + 1] : null;
if (!sargaArg || !kanda) {
  console.error('Usage: node src/dump-sarga.js <sarga|all> --kanda <kanda> [--write]');
  process.exit(1);
}
if (kanda === 'sundara-kanda') { console.error('Sundara Kanda is protected.'); process.exit(1); }

const root = path.resolve(__dirname, '..');
const romanDir = path.join(root, 'source', 'roman', kanda);
if (!fs.existsSync(romanDir)) { console.error(`Not found: ${romanDir}`); process.exit(1); }

function dumpSingleSarga(numStr, shouldWrite) {
  const num = numStr.padStart(3, '0');
  const src = path.join(romanDir, `sarga-${num}.txt`);
  if (!fs.existsSync(src)) {
    console.error(`Not found: ${src}`);
    return;
  }

  const out = [];
  for (const raw of fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n').split('\n')) {
    const l = raw.trim();
    if (!l) continue;
    if (l.startsWith('=== Sarga')) { out.push(`# ${l.replace(/=/g, '').trim()}`); continue; }
    const v = l.match(/^(\d+)\.$/);
    out.push(v ? `${v[1]}:` : l);
  }
  const text = out.join('\n') + '\n';

  if (shouldWrite) {
    const dir = path.join(root, 'scratch');
    fs.mkdirSync(dir, { recursive: true });
    const p = path.join(dir, `in-${num}.txt`);
    fs.writeFileSync(p, text, 'utf8');
    console.log(`Wrote ${p}`);
  } else {
    process.stdout.write(text);
  }
}

const shouldWrite = args.includes('--write');
if (sargaArg.toLowerCase() === 'all') {
  const files = fs.readdirSync(romanDir)
    .filter(f => f.startsWith('sarga-') && f.endsWith('.txt'))
    .sort();
  for (const file of files) {
    const m = file.match(/^sarga-(\d+)\.txt$/);
    if (m) dumpSingleSarga(m[1], shouldWrite);
  }
  console.log(`✅ Dumped ${files.length} sargas to scratch/`);
} else {
  dumpSingleSarga(sargaArg, shouldWrite);
}
