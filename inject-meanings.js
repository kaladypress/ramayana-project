#!/usr/bin/env node
/**
 * inject-meanings.js — Build qa-review sarga file from golden source + meanings,
 * and append tracker entries, in one run.
 *
 * Usage:
 *   node inject-meanings.js <sarga> --kanda bala-kanda [--dry] [--keep] [--force]
 *
 * Reads : source/roman/<kanda>/sarga-NNN.txt   (golden, never modified)
 *         scratch/meanings-NNN.txt
 * Writes: qa-review/<kanda>/sarga-NNN.txt      (refuses to overwrite unless --force)
 *         qa-review/<LogFile>                  (trackers, deduped, only on clean run)
 *
 * Meanings file (one entry per line, no "> " prefix, no manual wrapping):
 *   1: Meaning for verse 1.
 *   17-18: Grouped meaning, placed after verse 18 (verses 17-18 share one block).
 *   # comment
 *   @Geography | Name (description) | 81 | Lanka
 *       -> expanded to: Name (description) - [Bala Kanda, Sarga N, Verse 81, Lanka]
 *   (full "[...]" entries are also accepted as-is; location defaults to Referenced)
 * Lines without a key are appended to the previous entry.
 * Sundara Kanda is protected and refused.
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const sargaArg = args.find(a => /^\d+$/.test(a));
const kIdx = args.indexOf('--kanda');
const kanda = kIdx >= 0 ? args[kIdx + 1] : null;
if (!sargaArg || !kanda) {
    console.error('Usage: node inject-meanings.js <sarga> --kanda <kanda> [--dry] [--keep] [--force]');
    process.exit(1);
}
if (kanda === 'sundara-kanda') { console.error('Sundara Kanda is protected. Aborting.'); process.exit(1); }
const DRY = args.includes('--dry');
const KEEP = args.includes('--keep');
const FORCE = args.includes('--force');
const WIDTH = 80;

const num = sargaArg.padStart(3, '0');
const sargaNo = parseInt(sargaArg, 10);
const kandaTitle = kanda.replace(/-kanda$/, '').replace(/^./, c => c.toUpperCase()) + ' Kanda';
const root = __dirname;
const sourceFile = path.join(root, 'source', 'roman', kanda, `sarga-${num}.txt`);
const meaningsFile = path.join(root, 'scratch', `meanings-${num}.txt`);
const targetFile = path.join(root, 'qa-review', kanda, `sarga-${num}.txt`);

for (const f of [sourceFile, meaningsFile]) {
    if (!fs.existsSync(f)) { console.error(`Not found: ${f}`); process.exit(1); }
}
if (fs.existsSync(targetFile) && !FORCE && !DRY) {
    console.error(`Exists: ${targetFile}\nUse --force to overwrite.`);
    process.exit(1);
}

// ---------- parse golden source ----------
const srcLines = fs.readFileSync(sourceFile, 'utf8').replace(/\r\n/g, '\n').split('\n');
let header = `=== Sarga ${sargaNo} ===`;
const verses = [];            // { num, lines[] }
let cur = null;
for (const raw of srcLines) {
    const t = raw.trim();
    if (t.startsWith('=== Sarga')) { header = raw.trimEnd(); continue; }
    const v = t.match(/^(\d+)\.$/);
    if (v) { cur = { num: parseInt(v[1], 10), label: v[1], lines: [] }; verses.push(cur); continue; }
    if (cur && t) cur.lines.push(raw.trimEnd());
}
const verseIdx = new Map(verses.map((v, i) => [v.num, i]));

// ---------- parse meanings ----------
const entries = [];           // { label, start, end, text }
const tracking = [];          // { file, entry }
let last = null;
for (const raw of fs.readFileSync(meaningsFile, 'utf8').replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const t = line.match(/^@([\w-]+)\s*\|\s*(.+)$/);
    if (t) {
        let entry = t[2].trim();
        if (!entry.includes('[')) {
            const parts = entry.split('|').map(s => s.trim());
            const [name, verse, loc] = parts;
            entry = `${name} - [${kandaTitle}, Sarga ${sargaNo}, Verse ${verse || '?'}, ${loc || 'Referenced'}]`;
        }
        tracking.push({ file: t[1], entry });
        last = null;
        continue;
    }
    const m = line.match(/^(\d+(?:-\d+)?)\s*:\s*(.*)$/);
    if (m) {
        const [a, b] = m[1].split('-').map(Number);
        last = { label: m[1], start: a, end: b ?? a, text: m[2] };
        entries.push(last);
    } else if (last) {
        last.text += ' ' + line;
    } else {
        console.warn(`⚠ Ignored stray line: ${line.slice(0, 50)}`);
    }
}

// ---------- validate coverage ----------
const problems = [];
const startMap = new Map();
const covered = new Set();
for (const e of entries) {
    if (!verseIdx.has(e.start) || !verseIdx.has(e.end) || e.end < e.start) {
        problems.push(`Unused/invalid entry: ${e.label}`);
        continue;
    }
    if (startMap.has(e.start)) { problems.push(`Duplicate entry at ${e.label}`); continue; }
    const span = [];
    for (let i = verseIdx.get(e.start); i <= verseIdx.get(e.end); i++) span.push(verses[i].num);
    if (span.some(n => covered.has(n))) { problems.push(`Overlapping entry: ${e.label}`); continue; }
    if (span.length !== e.end - e.start + 1) problems.push(`Group ${e.label} spans non-consecutive verses`);
    span.forEach(n => covered.add(n));
    startMap.set(e.start, e);
}
const missing = verses.filter(v => !covered.has(v.num)).map(v => v.num);

// ---------- wrap ----------
function wrap(label, text) {
    const words = `**Meaning ${label}:** ${text.replace(/\s+/g, ' ').trim()}`.split(' ');
    const out = [];
    let c = '>';
    for (const w of words) {
        if (c.length + 1 + w.length > WIDTH && c !== '>') { out.push(c); c = '>'; }
        c += ' ' + w;
    }
    out.push(c);
    return out;
}

// ---------- build output ----------
const out = [header, ''];
for (let i = 0; i < verses.length; ) {
    const e = startMap.get(verses[i].num);
    const endI = e ? verseIdx.get(e.end) : i;
    out.push('---');
    for (let j = i; j <= endI; j++) {
        out.push(`${verses[j].num}.`, ...verses[j].lines, '');
    }
    if (e) out.push(...wrap(e.label, e.text), '');
    i = endI + 1;
}
out.push('---', '');

// ---------- lint (warn only) ----------
const banned = /\b(monkeys?|lords?|shall|shalt|thou|thee|thy|thine|ye|behold|lo|dwell|abide|hither|thither|ere|wherefore|whereupon|thereupon)\b/gi;
const lint = [];
for (const e of entries) {
    const hits = e.text.match(banned);
    if (hits) lint.push(`${e.label}: ${[...new Set(hits.map(h => h.toLowerCase()))].join(', ')}`);
}

// ---------- tracking ----------
const trackGroups = {};
for (const { file, entry } of tracking) (trackGroups[file] ??= []).push(entry);
const trackErrors = Object.keys(trackGroups).filter(f => !fs.existsSync(path.join(root, 'qa-review', f)));

const clean = !missing.length && !problems.length && !trackErrors.length;
const added = {};
if (!DRY && clean) {
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, out.join('\n'), 'utf8');
    for (const [file, list] of Object.entries(trackGroups)) {
        const p = path.join(root, 'qa-review', file);
        const cur = fs.readFileSync(p, 'utf8');
        const eol = cur.includes('\r\n') ? '\r\n' : '\n';
        const existing = new Set(cur.split(/\r?\n/).map(s => s.trim()));
        const fresh = list.filter(e => !existing.has(e));
        added[file] = fresh.length;
        if (!fresh.length) continue;
        const sep = cur.length === 0 ? '' : (cur.endsWith('\n') ? '' : eol);
        fs.appendFileSync(p, sep + fresh.join(eol) + eol, 'utf8');
    }
}

// ---------- report ----------
console.log(`${DRY ? '[DRY RUN] ' : ''}${kanda} sarga-${num}: verses ${verses.length}, entries ${entries.length}, missing ${missing.length}`);
if (missing.length) console.log(`  Missing meanings for verses: ${missing.join(', ')}`);
problems.forEach(p => console.log(`  ✗ ${p}`));
lint.forEach(l => console.log(`  ⚠ banned/archaic words in ${l}`));
for (const [f, e] of Object.entries(trackGroups)) {
    console.log(`  ${trackErrors.includes(f) ? '✗ unknown log' : '+'} ${f}: ${e.length}${f in added ? ` (new ${added[f]})` : ''}`);
}
if (!clean) console.log('  Nothing written (fix the issues above and re-run).');
else if (!DRY && !KEEP) fs.unlinkSync(meaningsFile);
process.exit(clean ? 0 : 2);
