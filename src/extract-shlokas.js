#!/usr/bin/env node
/**
 * extract-shlokas.js — Phase 1: Automated Shloka Extraction
 *
 * Downloads Ramayana text from IIT Bombay (bombay.indology.info) and generates
 * golden source sarga files — pure reference copies with no meaning markers.
 *
 * Source: Baroda Critical Edition via bombay.indology.info
 *
 * Output structure:
 *   source/roman/<kanda>/sarga-NNN.txt       ← ISO-15919 transliteration
 *   source/devanagari/<kanda>/sarga-NNN.txt   ← Devanagari script
 *
 * These files are the golden source — never edited directly.
 * Working copies for qa-review are created separately in Phase 2.
 *
 * Usage:
 *   node src/extract-shlokas.js bala-kanda
 *   node src/extract-shlokas.js all
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const Sanscript = require('@indic-transliteration/sanscript');

// ─── Configuration ───────────────────────────────────────────────────────────

const BASE_URL = 'https://bombay.indology.info/ramayana/text';
const PROJECT_ROOT = path.resolve(__dirname, '..');

const KANDA_MAP = {
  'bala-kanda':      { book: 1, file: 'Ram01.txt', title: 'Bāla Kāṇḍa',      titlePlain: 'Bala Kanda' },
  'ayodhya-kanda':   { book: 2, file: 'Ram02.txt', title: 'Ayodhyā Kāṇḍa',   titlePlain: 'Ayodhya Kanda' },
  'aranya-kanda':    { book: 3, file: 'Ram03.txt', title: 'Āraṇya Kāṇḍa',    titlePlain: 'Aranya Kanda' },
  'kishkindha-kanda':{ book: 4, file: 'Ram04.txt', title: 'Kiṣkindhā Kāṇḍa', titlePlain: 'Kishkindha Kanda' },
  'sundara-kanda':   { book: 5, file: 'Ram05.txt', title: 'Sundara Kāṇḍa',   titlePlain: 'Sundara Kanda' },
  'yuddha-kanda':    { book: 6, file: 'Ram06.txt', title: 'Yuddha Kāṇḍa',    titlePlain: 'Yuddha Kanda' },
  'uttara-kanda':    { book: 7, file: 'Ram07.txt', title: 'Uttara Kāṇḍa',     titlePlain: 'Uttara Kanda' },
};

// ─── HTTP Download ───────────────────────────────────────────────────────────

function download(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        res.resume();
        return;
      }
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// ─── Text Parser ─────────────────────────────────────────────────────────────

/**
 * Parse lines from IIT Bombay format into a structured sarga map.
 *
 * Input line format:  "1001001a tapaḥsvādhyāyanirataṁ tapasvī vāgvidāṁ varam"
 * Reference code:     BSSSVVVP
 *   B   = Book number (1 digit)
 *   SSS = Sarga number (3 digits)
 *   VVV = Verse number (3 digits)
 *   P   = Pāda identifier (a, c, e, g — half-lines)
 *
 * Returns: Map<sargaNum, Map<verseNum, [{pada, text}]>>
 */
function parseLines(rawText) {
  const sargas = new Map();
  const lines = rawText.split(/\r?\n/);

  for (const line of lines) {
    // Skip comment lines (start with %) and blank lines
    if (!line.trim() || line.trim().startsWith('%')) continue;

    // Match reference pattern: digits followed by a letter, then a space and text
    const match = line.match(/^(\d)(\d{3})(\d{3})([a-z])\s+(.+)$/);
    if (!match) continue;

    const [, , sargaStr, verseStr, pada, text] = match;
    const sargaNum = parseInt(sargaStr, 10);
    const verseNum = parseInt(verseStr, 10);

    if (!sargas.has(sargaNum)) {
      sargas.set(sargaNum, new Map());
    }
    const sarga = sargas.get(sargaNum);

    if (!sarga.has(verseNum)) {
      sarga.set(verseNum, []);
    }
    sarga.get(verseNum).push({ pada, text: text.trimEnd() });
  }

  return sargas;
}

// ─── Sarga File Generators ───────────────────────────────────────────────────

/**
 * Generate a golden source sarga file — pure shlokas, no meaning markers.
 *
 * Format:
 *   === Sarga N ===
 *
 *   1.
 *   pāda_a text |
 *   pāda_c text ||
 *
 *   2.
 *   ...
 */
function generateGoldenSargaFile(sargaNum, versesMap) {
  const lines = [];

  lines.push(`=== Sarga ${sargaNum} ===`);
  lines.push('');

  const verseNums = [...versesMap.keys()].sort((a, b) => a - b);

  for (const vNum of verseNums) {
    const padas = versesMap.get(vNum);

    lines.push(`${vNum}.`);
    for (let i = 0; i < padas.length; i++) {
      const isLast = (i === padas.length - 1);
      const danda = isLast ? '||' : '|';
      lines.push(`${padas[i].text} ${danda}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Parasavarna normalization (Devanagari level, ISO output only).
 * Anusvara (ं) followed IMMEDIATELY (same word, no space) by a stop
 * consonant becomes the homorganic class nasal + virama (Pāṇini 8.4.58).
 * Word-final anusvara stays ṁ (8.4.59 is optional; we choose not to apply).
 * Before semivowels, sibilants and ह the anusvara stays (→ ṁ).
 * The saved Devanagari golden file is NOT altered.
 */
function applyParasavarna(text) {
  const nasalFor = (cp) => {
    if (cp >= 0x0915 && cp <= 0x0919) return '\u0919'; // ka-class → ṅ
    if (cp >= 0x091A && cp <= 0x091E) return '\u091E'; // ca-class → ñ
    if (cp >= 0x091F && cp <= 0x0923) return '\u0923'; // ṭa-class → ṇ
    if (cp >= 0x0924 && cp <= 0x0928) return '\u0928'; // ta-class → n
    if (cp >= 0x092A && cp <= 0x092E) return '\u092E'; // pa-class → m
    return null;
  };
  return text.replace(/\u0902([\u0915-\u092E])/g, (m, c) => {
    const n = nasalFor(c.codePointAt(0));
    return n ? `${n}\u094D${c}` : m;
  });
}

/**
 * Transliterate a map of Devanagari verses to ISO-15919 directly.
 * Follows Devanagari word boundaries and sandhi; applies parasavarna.
 */
function transliterateDevanagariToIso(devVerses) {
  const romanVerses = new Map();
  for (const [verseNum, padas] of devVerses.entries()) {
    const romanPadas = padas.map(({ pada, text }) => ({
      pada,
      text: Sanscript.t(applyParasavarna(text), 'devanagari', 'iso')
    }));
    romanVerses.set(verseNum, romanPadas);
  }
  return romanVerses;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function processKanda(kandaKey) {
  const config = KANDA_MAP[kandaKey];
  if (!config) {
    console.error(`❌ Unknown kanda: "${kandaKey}"`);
    console.error(`   Valid options: ${Object.keys(KANDA_MAP).join(', ')}, all`);
    process.exit(1);
  }

  // Protect completed Sundara Kanda
  if (kandaKey === 'sundara-kanda') {
    console.log(`\n🛡  Sundara Kāṇḍa is complete and protected. Skipping.`);
    return { kandaKey, sargas: 0, verses: 0, skipped: true };
  }

  console.log(`\n📖 Processing ${config.titlePlain} (${config.title})`);
  console.log(`${'─'.repeat(60)}`);

  // Load Devanagari text (primary source of truth)
  const rawDir = path.join(PROJECT_ROOT, 'source', 'raw');
  fs.mkdirSync(rawDir, { recursive: true });
  const rawDevPath = path.join(rawDir, `${kandaKey}-devanagari.txt`);

  let devText;
  if (fs.existsSync(rawDevPath)) {
    console.log(`📂 Using cached Devanagari: source/raw/${kandaKey}-devanagari.txt`);
    devText = fs.readFileSync(rawDevPath, 'utf-8');
  } else {
    const devUrl = `${BASE_URL}/UD/${config.file}`;
    console.log(`⬇  Downloading Devanagari: ${devUrl}`);
    devText = await download(devUrl);
    fs.writeFileSync(rawDevPath, devText, 'utf-8');
    console.log(`   ✓ Downloaded and saved (${(devText.length / 1024).toFixed(1)} KB)`);
  }

  // Parse Devanagari
  console.log(`🔍 Parsing Devanagari...`);
  const devSargas = parseLines(devText);
  console.log(`   ✓ Found ${devSargas.size} sargas in Devanagari text`);

  // Create output directories
  const romanDir = path.join(PROJECT_ROOT, 'source', 'roman', kandaKey);
  const devDir = path.join(PROJECT_ROOT, 'source', 'devanagari', kandaKey);
  fs.mkdirSync(romanDir, { recursive: true });
  fs.mkdirSync(devDir, { recursive: true });

  // Generate sarga files
  let totalVerses = 0;
  const sargaNums = [...devSargas.keys()].sort((a, b) => a - b);

  for (const sargaNum of sargaNums) {
    const devVerses = devSargas.get(sargaNum);
    const romanVerses = transliterateDevanagariToIso(devVerses);
    const verseCount = devVerses.size;
    totalVerses += verseCount;

    const paddedNum = String(sargaNum).padStart(3, '0');
    const fileName = `sarga-${paddedNum}.txt`;

    // Write Devanagari golden source
    const devContent = generateGoldenSargaFile(sargaNum, devVerses);
    fs.writeFileSync(path.join(devDir, fileName), devContent, 'utf-8');

    // Write Roman (ISO-15919 derived directly from Devanagari) golden source
    const romanContent = generateGoldenSargaFile(sargaNum, romanVerses);
    fs.writeFileSync(path.join(romanDir, fileName), romanContent, 'utf-8');
  }

  console.log(`\n✅ ${config.titlePlain} complete!`);
  console.log(`   📄 ${sargaNums.length} sarga files × 2 scripts = ${sargaNums.length * 2} files`);
  console.log(`   📝 ${totalVerses} total verses extracted (Roman derived from Devanagari)`);
  console.log(`   📂 source/roman/${kandaKey}/`);
  console.log(`   📂 source/devanagari/${kandaKey}/`);

  return { kandaKey, sargas: sargaNums.length, verses: totalVerses };
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║          Valmiki Ramayana — Shloka Extractor                ║
║          Kalady Press Edition · Phase 1                     ║
╚══════════════════════════════════════════════════════════════╝

Usage:
  node src/extract-shlokas.js <kanda-name>
  node src/extract-shlokas.js all

Available Kandas:
  bala-kanda         Bāla Kāṇḍa        (Book 1)
  ayodhya-kanda      Ayodhyā Kāṇḍa     (Book 2)
  aranya-kanda       Āraṇya Kāṇḍa      (Book 3)
  kishkindha-kanda   Kiṣkindhā Kāṇḍa   (Book 4)
  sundara-kanda      Sundara Kāṇḍa     (Book 5 - Protected)
  yuddha-kanda       Yuddha Kāṇḍa      (Book 6)
  uttara-kanda       Uttara Kāṇḍa      (Book 7)

Source: IIT Bombay Critical Edition (bombay.indology.info)

Output (golden source — never edit these):
  source/devanagari/<kanda>/sarga-NNN.txt   Devanagari script
  source/roman/<kanda>/sarga-NNN.txt        ISO-15919 transliteration (derived from Devanagari)
  source/raw/<kanda>-devanagari.txt         Raw download (archival)
`);
    process.exit(0);
  }

  const target = args[0].toLowerCase();

  console.log(`
╔══════════════════════════════════════════════════════════════╗
║          Valmiki Ramayana — Shloka Extractor                ║
║          Kalady Press Edition · Phase 1                     ║
╚══════════════════════════════════════════════════════════════╝
`);
  console.log(`Source: IIT Bombay Critical Edition (bombay.indology.info)`);
  console.log(`Output: source/devanagari/ + source/roman/ (golden source)`);

  const startTime = Date.now();
  const results = [];

  if (target === 'all') {
    for (const kandaKey of Object.keys(KANDA_MAP)) {
      if (kandaKey === 'sundara-kanda') continue;
      const result = await processKanda(kandaKey);
      if (result && !result.skipped) results.push(result);
    }
  } else {
    const result = await processKanda(target);
    if (result && !result.skipped) results.push(result);
  }

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalSargas = results.reduce((s, r) => s + r.sargas, 0);
  const totalVerses = results.reduce((s, r) => s + r.verses, 0);

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📊 Summary`);
  console.log(`${'─'.repeat(60)}`);
  for (const r of results) {
    const padded = r.kandaKey.padEnd(20);
    console.log(`   ${padded} ${String(r.sargas).padStart(3)} sargas, ${String(r.verses).padStart(5)} verses`);
  }
  console.log(`${'─'.repeat(60)}`);
  console.log(`   ${'Total'.padEnd(20)} ${String(totalSargas).padStart(3)} sargas, ${String(totalVerses).padStart(5)} verses`);
  console.log(`   Time: ${elapsed}s`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`\n🎉 Golden source complete!`);
  console.log(`   These files are read-only reference — do not edit.`);
  console.log(`   Phase 2 will create working copies in qa-review/ with meaning markers.\n`);
}

main().catch((err) => {
  console.error(`\n❌ Error: ${err.message}`);
  process.exit(1);
});
