#!/usr/bin/env node
/**
 * fetch-sarga.js — Rebuild ONE sarga's golden source from valmikiramayan.net
 *
 * Use when the IIT Bombay (Baroda critical) text does not match the physical
 * book (different verse count / wording). Touches only:
 *   source/devanagari/<kanda>/sarga-NNN.txt
 *   source/roman/<kanda>/sarga-NNN.txt
 * Old files are backed up to scratch/backup/ first.
 *
 * Usage:
 *   node src/fetch-sarga.js bala-kanda 18
 *   node src/fetch-sarga.js bala-kanda 18 --offline   (use cached HTML only)
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const Sanscript = require('@indic-transliteration/sanscript');

const ROOT = path.resolve(__dirname, '..');
// Only Bala Kanda URL pattern verified so far; add others after checking the site.
const SITE = {
  'bala-kanda': { dir: 'baala', prefix: 'balasans' },
};

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) { res.resume(); return reject(new Error(`HTTP ${res.statusCode} ${url}`)); }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    }).on('error', reject);
  });
}

// Same parasavarna rule as extract-shlokas.js (applied for ISO output only).
function applyParasavarna(text) {
  const nasalFor = (cp) => {
    if (cp >= 0x0915 && cp <= 0x0919) return '\u0919';
    if (cp >= 0x091A && cp <= 0x091E) return '\u091E';
    if (cp >= 0x091F && cp <= 0x0923) return '\u0923';
    if (cp >= 0x0924 && cp <= 0x0928) return '\u0928';
    if (cp >= 0x092A && cp <= 0x092E) return '\u092E';
    return null;
  };
  return text.replace(/\u0902([\u0915-\u092E])/g, (m, c) => {
    const n = nasalFor(c.codePointAt(0));
    return n ? `${n}\u094D${c}` : m;
  });
}

const DEV_DIGITS = '०१२३४५६७८९';
const devToInt = (s) => parseInt([...s].map((c) => DEV_DIGITS.indexOf(c)).join(''), 10);

function parseVerses(html, sargaNum) {
  // The site groups verses into blocks and a verse's first half may sit in the
  // previous block. So flatten every Devanagari SanSloka paragraph into one
  // ordered line stream and cut verses at the "|| १-S-N" end markers.
  const verses = new Map();
  const paras = [...html.matchAll(/<p class="SanSloka">([\s\S]*?)<\/p>/g)]
    .map((m) => m[1])
    .filter((p) => /[\u0900-\u097F]/.test(p));
  const sargaDev = [...String(sargaNum)].map((d) => DEV_DIGITS[d]).join('');
  const markerRe = new RegExp(`\\s*[|।॥]*\\s*१-${sargaDev}-([०-९]+)\\s*$`);
  let cur = [];
  for (const body of paras) {
    const lines = body.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '').split('\n');
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;
      const m = line.match(markerRe);
      const text = line.replace(markerRe, '').replace(/\s*[|।॥]+\s*$/, '').trim();
      if (text) cur.push(text);
      if (m) {
        const n = devToInt(m[1]);
        if (verses.has(n)) console.warn(`⚠ duplicate verse ${n}`);
        verses.set(n, cur);
        cur = [];
      }
    }
  }
  if (cur.length) console.warn(`⚠ trailing lines without end marker: ${cur.join(' / ')}`);
  return verses;
}

function format(sargaNum, verses, convert = (t) => t) {
  const out = [`=== Sarga ${sargaNum} ===`, ''];
  for (const n of [...verses.keys()].sort((a, b) => a - b)) {
    out.push(`${n}.`);
    const ls = verses.get(n);
    ls.forEach((l, i) => out.push(`${convert(l)} ${i === ls.length - 1 ? '||' : '|'}`));
    out.push('');
  }
  return out.join('\n');
}

async function main() {
  const [kanda, sargaArg, flag] = process.argv.slice(2);
  const cfg = SITE[kanda];
  const sargaNum = parseInt(sargaArg, 10);
  if (!cfg || !sargaNum) {
    console.error('Usage: node src/fetch-sarga.js bala-kanda <sarga> [--offline]');
    process.exit(1);
  }
  const nn = String(sargaNum).padStart(3, '0');
  const cacheDir = path.join(ROOT, 'scratch', 'valmiki-cache');
  fs.mkdirSync(cacheDir, { recursive: true });
  const cache = path.join(cacheDir, `${kanda}-${nn}.htm`);
  let html;
  if (fs.existsSync(cache)) {
    html = fs.readFileSync(cache, 'utf-8');
    console.log(`📂 Using cached ${path.relative(ROOT, cache)}`);
  } else if (flag === '--offline') {
    console.error('No cached HTML and --offline given.'); process.exit(1);
  } else {
    const url = `https://www.valmikiramayan.net/${cfg.dir}/sarga${sargaNum}/${cfg.prefix}${sargaNum}.htm`;
    console.log(`⬇  ${url}`);
    html = await download(url);
    fs.writeFileSync(cache, html, 'utf-8');
  }

  const verses = parseVerses(html, sargaNum);
  const nums = [...verses.keys()].sort((a, b) => a - b);
  const max = nums[nums.length - 1];
  const missing = [];
  for (let i = 1; i <= max; i++) if (!verses.has(i)) missing.push(i);
  console.log(`✓ Parsed ${verses.size} verses (highest #${max})`);
  if (missing.length) {
    console.error(`❌ Gaps in verse numbering: ${missing.join(', ')} — NOT writing files.`);
    process.exit(2);
  }

  const devPath = path.join(ROOT, 'source', 'devanagari', kanda, `sarga-${nn}.txt`);
  const romPath = path.join(ROOT, 'source', 'roman', kanda, `sarga-${nn}.txt`);
  const bak = path.join(ROOT, 'scratch', 'backup');
  fs.mkdirSync(bak, { recursive: true });
  for (const [p, tag] of [[devPath, 'devanagari'], [romPath, 'roman']]) {
    if (fs.existsSync(p)) {
      const old = fs.readFileSync(p, 'utf-8');
      const oldCount = (old.match(/^\d+\.\s*$/gm) || []).length;
      console.log(`💾 Backed up old ${tag} (${oldCount} verses)`);
      fs.copyFileSync(p, path.join(bak, `sarga-${nn}.${tag}.bak`));
    }
  }
  fs.writeFileSync(devPath, format(sargaNum, verses), 'utf-8');
  fs.writeFileSync(romPath, format(sargaNum, verses, (t) => Sanscript.t(applyParasavarna(t), 'devanagari', 'iso')), 'utf-8');
  console.log(`✅ Wrote ${path.relative(ROOT, devPath)} and ${path.relative(ROOT, romPath)}`);

  const qa = path.join(ROOT, 'qa-review', kanda, `sarga-${nn}.txt`);
  if (fs.existsSync(qa)) console.log(`⚠ ${path.relative(ROOT, qa)} exists and is now out of sync — regenerate it.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
