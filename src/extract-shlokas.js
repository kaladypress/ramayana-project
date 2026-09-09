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

// ─── Main ────────────────────────────────────────────────────────────────────

async function processKanda(kandaKey) {
  const config = KANDA_MAP[kandaKey];
  if (!config) {
    console.error(`❌ Unknown kanda: "${kandaKey}"`);
    console.error(`   Valid options: ${Object.keys(KANDA_MAP).join(', ')}, all`);
    process.exit(1);
  }

  console.log(`\n📖 Processing ${config.titlePlain} (${config.title})`);
  console.log(`${'─'.repeat(60)}`);

  // Download Roman text
  const romanUrl = `${BASE_URL}/UR/${config.file}`;
  console.log(`⬇  Downloading Roman (ISO-15919): ${romanUrl}`);
  const romanText = await download(romanUrl);
  console.log(`   ✓ Downloaded (${(romanText.length / 1024).toFixed(1)} KB)`);

  // Download Devanagari text
  const devUrl = `${BASE_URL}/UD/${config.file}`;
  console.log(`⬇  Downloading Devanagari: ${devUrl}`);
  const devText = await download(devUrl);
  console.log(`   ✓ Downloaded (${(devText.length / 1024).toFixed(1)} KB)`);

  // Parse both
  console.log(`🔍 Parsing...`);
  const romanSargas = parseLines(romanText);
  const devSargas = parseLines(devText);

  console.log(`   ✓ Found ${romanSargas.size} sargas in Roman text`);
  console.log(`   ✓ Found ${devSargas.size} sargas in Devanagari text`);

  // Verify alignment
  if (romanSargas.size !== devSargas.size) {
    console.warn(`   ⚠ Sarga count mismatch! Roman: ${romanSargas.size}, Devanagari: ${devSargas.size}`);
  }

  // Create output directories
  const romanDir = path.join(PROJECT_ROOT, 'source', 'roman', kandaKey);
  const devDir = path.join(PROJECT_ROOT, 'source', 'devanagari', kandaKey);
  fs.mkdirSync(romanDir, { recursive: true });
  fs.mkdirSync(devDir, { recursive: true });

  // Also save the raw downloaded files for archival
  const rawDir = path.join(PROJECT_ROOT, 'source', 'raw');
  fs.mkdirSync(rawDir, { recursive: true });
  fs.writeFileSync(path.join(rawDir, `${kandaKey}-roman.txt`), romanText, 'utf-8');
  fs.writeFileSync(path.join(rawDir, `${kandaKey}-devanagari.txt`), devText, 'utf-8');
  console.log(`💾 Raw downloads saved to source/raw/`);

  // Generate sarga files
  let totalVerses = 0;
  const sargaNums = [...romanSargas.keys()].sort((a, b) => a - b);

  for (const sargaNum of sargaNums) {
    const romanVerses = romanSargas.get(sargaNum);
    const devVerses = devSargas.get(sargaNum);
    const verseCount = romanVerses.size;
    totalVerses += verseCount;

    const paddedNum = String(sargaNum).padStart(3, '0');
    const fileName = `sarga-${paddedNum}.txt`;

    // Write Roman (ISO-15919) golden source
    const romanContent = generateGoldenSargaFile(sargaNum, romanVerses);
    fs.writeFileSync(path.join(romanDir, fileName), romanContent, 'utf-8');

    // Write Devanagari golden source
    if (devVerses) {
      const devContent = generateGoldenSargaFile(sargaNum, devVerses);
      fs.writeFileSync(path.join(devDir, fileName), devContent, 'utf-8');
    }
  }

  console.log(`\n✅ ${config.titlePlain} complete!`);
  console.log(`   📄 ${sargaNums.length} sarga files × 2 scripts = ${sargaNums.length * 2} files`);
  console.log(`   📝 ${totalVerses} total verses extracted`);
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
  sundara-kanda      Sundara Kāṇḍa     (Book 5)
  yuddha-kanda       Yuddha Kāṇḍa      (Book 6)
  uttara-kanda       Uttara Kāṇḍa      (Book 7)

Source: IIT Bombay Critical Edition (bombay.indology.info)

Output (golden source — never edit these):
  source/roman/<kanda>/sarga-NNN.txt        ISO-15919 transliteration
  source/devanagari/<kanda>/sarga-NNN.txt   Devanagari script
  source/raw/<kanda>-roman.txt              Raw download (archival)
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
  console.log(`Output: source/roman/ + source/devanagari/ (golden source)`);

  const startTime = Date.now();
  const results = [];

  if (target === 'all') {
    for (const kandaKey of Object.keys(KANDA_MAP)) {
      const result = await processKanda(kandaKey);
      results.push(result);
    }
  } else {
    const result = await processKanda(target);
    results.push(result);
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
