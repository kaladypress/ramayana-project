#!/usr/bin/env node
/**
 * inject-meanings.js — Token-efficient meaning injector.
 *
 * Fills `=== meaning ===` placeholders IN PLACE inside
 * qa-review/<kanda>/sarga-NNN.txt. Śloka text (incl. sandhi edits) is never
 * touched — only placeholder lines are replaced.
 *
 * Usage:
 *   node inject-meanings.js <sarga> [--kanda sundara-kanda] [--dry] [--keep]
 *
 * Input: scratch/meanings-NNN.txt  (compact, one entry per line)
 *   17-18: Meaning text on a single line, no "> " prefix, no wrapping.
 *   Patha-1: Meaning for a variant verse.
 *   (lines not starting with a key are appended to the previous entry)
 *   @Geography | Kauraja (Mountain) - [Sundara Kanda, Sarga 35, Verse 81, ...]
 *   @Jewelry-Clothing | ...      (appended to qa-review/<File>)
 *   # comment lines are ignored
 *
 * Each placeholder is matched to the entry whose key ENDS with the last verse
 * number seen before that placeholder. The script wraps text to ~80 chars,
 * adds "> " prefixes and the bold "Meaning N:" label, preserves line endings,
 * and prints only a short report (no file contents).
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const sargaArg = args.find(a => /^\d+$/.test(a));
if (!sargaArg) {
    console.error('Usage: node inject-meanings.js <sarga> [--kanda sundara-kanda] [--dry] [--keep]');
    process.exit(1);
}
const kIdx = args.indexOf('--kanda');
const kanda = kIdx >= 0 ? args[kIdx + 1] : 'sundara-kanda';
const DRY = args.includes('--dry');
const KEEP = args.includes('--keep');
const WIDTH = 80;

const num = sargaArg.padStart(3, '0');
const root = __dirname;
const targetFile = path.join(root, 'qa-review', kanda, `sarga-${num}.txt`);
const meaningsFile = path.join(root, 'scratch', `meanings-${num}.txt`);

for (const f of [targetFile, meaningsFile]) {
    if (!fs.existsSync(f)) { console.error(`Not found: ${f}`); process.exit(1); }
}

// ---------- parse scratch file ----------
const meanings = new Map();   // endKey -> { label, text }
const tracking = [];          // { file, entry }
let last = null;
for (const raw of fs.readFileSync(meaningsFile, 'utf8').replace(/\r\n/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const t = line.match(/^@([\w-]+)\s*\|\s*(.+)$/);
    if (t) { tracking.push({ file: t[1], entry: t[2] }); last = null; continue; }
    const m = line.match(/^((?:Patha-\d+)|(?:\d+(?:-\d+)?))\s*:\s*(.*)$/i);
    if (m) {
        const label = m[1];
        const endKey = label.toLowerCase().startsWith('patha') ? label.toLowerCase() : label.split('-').pop();
        if (meanings.has(endKey)) console.warn(`⚠ Duplicate entry for ${label}; last one wins.`);
        last = { label, text: m[2] };
        meanings.set(endKey, last);
    } else if (last) {
        last.text += ' ' + line;
    } else {
        console.warn(`⚠ Ignored stray line: ${line.slice(0, 50)}`);
    }
}

// ---------- wrap helper ----------
function wrap(label, text) {
    const words = `**Meaning ${label}:** ${text.replace(/\s+/g, ' ').trim()}`.split(' ');
    const out = [];
    let cur = '>';
    for (const w of words) {
        if (cur.length + 1 + w.length > WIDTH && cur !== '>') { out.push(cur); cur = '>'; }
        cur += ' ' + w;
    }
    out.push(cur);
    return out;
}

// ---------- fill placeholders ----------
const original = fs.readFileSync(targetFile, 'utf8');
const EOL = original.includes('\r\n') ? '\r\n' : '\n';
const lines = original.replace(/\r\n/g, '\n').split('\n');
const result = [];
const used = new Set();
const missing = [];
let lastVerse = null, firstVerse = null, filled = 0;

for (const line of lines) {
    const v = line.trim().match(/^(\d+|Patha-\d+)\.?$/i);
    if (v) {
        lastVerse = v[1].toLowerCase();
        if (firstVerse === null) firstVerse = lastVerse;
        result.push(line);
        continue;
    }
    if (line.trim() === '=== meaning ===') {
        const entry = lastVerse && meanings.get(lastVerse);
        if (entry) {
            const expected = firstVerse === lastVerse ? lastVerse : `${firstVerse}-${lastVerse}`;
            if (entry.label.toLowerCase() !== expected) {
                console.warn(`⚠ Label "${entry.label}" placed at block ${expected}.`);
            }
            result.push(...wrap(entry.label, entry.text));
            used.add(lastVerse);
            filled++;
        } else {
            result.push(line);
            missing.push(lastVerse ?? '(before first verse)');
        }
        firstVerse = null;
        continue;
    }
    result.push(line);
}

const unused = [...meanings.keys()].filter(k => !used.has(k)).map(k => meanings.get(k).label);

// ---------- tracking logs ----------
const trackGroups = {};
for (const { file, entry } of tracking) (trackGroups[file] ??= []).push(entry);
const trackErrors = Object.keys(trackGroups).filter(f => !fs.existsSync(path.join(root, 'qa-review', f)));

// ---------- write ----------
if (!DRY) {
    fs.writeFileSync(targetFile, result.join(EOL));
    for (const [file, entries] of Object.entries(trackGroups)) {
        const p = path.join(root, 'qa-review', file);
        if (!fs.existsSync(p)) continue;
        const cur = fs.readFileSync(p, 'utf8');
        const eol = cur.includes('\r\n') ? '\r\n' : '\n';
        const sep = cur.length === 0 ? '' : (cur.endsWith('\n') ? eol : eol + eol);
        fs.appendFileSync(p, sep + entries.join(eol) + eol);
    }
}

// ---------- report ----------
console.log(`${DRY ? '[DRY RUN] ' : ''}sarga-${num}: filled ${filled}, missing ${missing.length}, unused ${unused.length}`);
if (missing.length) console.log(`  Missing meanings for blocks ending at: ${missing.join(', ')}`);
if (unused.length) console.log(`  Unused entries: ${unused.join(', ')}`);
for (const [f, e] of Object.entries(trackGroups)) {
    console.log(`  ${trackErrors.includes(f) ? '✗ unknown log' : '+'} ${f}: ${e.length}`);
}

const clean = !missing.length && !unused.length && !trackErrors.length;
if (!DRY && clean && !KEEP) fs.unlinkSync(meaningsFile);
process.exit(clean ? 0 : 2);
