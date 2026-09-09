#!/usr/bin/env node
/**
 * prepare-qa-files.js — Create working copies from golden source
 *
 * Copies ISO-15919 Roman shlokas from source/roman/ into qa-review/
 * and adds === meaning === placeholders for Phase 2 (meaning generation).
 *
 * Golden source (source/) is never touched.
 * All editing happens in qa-review/.
 *
 * Usage:
 *   node src/prepare-qa-files.js bala-kanda
 *   node src/prepare-qa-files.js all
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

const KANDAS = [
  'bala-kanda',
  'ayodhya-kanda',
  'aranya-kanda',
  'kishkindha-kanda',
  'sundara-kanda',
  'yuddha-kanda',
  'uttara-kanda',
];

/**
 * Read a golden source sarga file and produce a qa-review version
 * with === meaning === placeholders after each verse.
 *
 * Input (golden source):
 *   === Sarga 1 ===
 *
 *   1.
 *   pāda_a text |
 *   pāda_c text ||
 *
 *   2.
 *   ...
 *
 * Output (qa-review):
 *   === Sarga 1 ===
 *
 *   ---
 *   1.
 *   pāda_a text |
 *   pāda_c text ||
 *
 *   === meaning ===
 *
 *   ---
 *   2.
 *   ...
 */
function convertToQaFormat(goldenContent) {
  const lines = goldenContent.split('\n');
  const output = [];

  let inHeader = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Pass through the sarga header
    if (trimmed.startsWith('=== Sarga')) {
      output.push(line);
      output.push('');
      inHeader = false;
      continue;
    }

    // Detect verse number (e.g., "1.", "23.", "100.")
    if (/^\d+\.$/.test(trimmed)) {
      // Add separator before each verse
      output.push('---');

      output.push(line);
      continue;
    }

    // Detect end of a verse (line ending with ||)
    if (trimmed.endsWith('||')) {
      output.push(line);
      output.push('');
      output.push('=== meaning ===');
      output.push('');
      continue;
    }

    // Skip blank lines right after header (we handle spacing ourselves)
    if (inHeader && trimmed === '') continue;
    inHeader = false;

    // Pass through everything else (pāda lines ending with |, etc.)
    if (trimmed !== '' || output[output.length - 1] !== '') {
      output.push(line);
    }
  }

  // Final separator
  output.push('---');

  return output.join('\n');
}

function processKanda(kandaKey) {
  const sourceDir = path.join(PROJECT_ROOT, 'source', 'roman', kandaKey);
  const qaDir = path.join(PROJECT_ROOT, 'qa-review', kandaKey);

  if (!fs.existsSync(sourceDir)) {
    console.error(`❌ Golden source not found: ${sourceDir}`);
    console.error(`   Run extract-shlokas.js first.`);
    process.exit(1);
  }

  // Check if qa-review already exists
  if (fs.existsSync(qaDir)) {
    const files = fs.readdirSync(qaDir);
    if (files.length > 0) {
      console.warn(`   ⚠ qa-review/${kandaKey}/ already exists with ${files.length} files — skipping.`);
      console.warn(`     Delete the folder first if you want to regenerate.`);
      return null;
    }
  }

  fs.mkdirSync(qaDir, { recursive: true });

  const sargaFiles = fs.readdirSync(sourceDir)
    .filter(f => f.startsWith('sarga-') && f.endsWith('.txt'))
    .sort();

  let totalVerses = 0;

  for (const fileName of sargaFiles) {
    const goldenContent = fs.readFileSync(path.join(sourceDir, fileName), 'utf-8');
    const qaContent = convertToQaFormat(goldenContent);
    fs.writeFileSync(path.join(qaDir, fileName), qaContent, 'utf-8');

    // Count verses
    const verseCount = (goldenContent.match(/^\d+\.$/gm) || []).length;
    totalVerses += verseCount;
  }

  console.log(`✅ ${kandaKey}: ${sargaFiles.length} sargas, ${totalVerses} verses → qa-review/${kandaKey}/`);

  return { kandaKey, sargas: sargaFiles.length, verses: totalVerses };
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage:
  node src/prepare-qa-files.js <kanda-name>
  node src/prepare-qa-files.js all

Creates working copies in qa-review/ from golden source (source/roman/).
Adds === meaning === placeholders for Phase 2.
`);
    process.exit(0);
  }

  const target = args[0].toLowerCase();
  console.log(`\n📋 Preparing QA review files from golden source...\n`);

  const targets = target === 'all' ? KANDAS : [target];
  const results = [];

  for (const k of targets) {
    const result = processKanda(k);
    if (result) results.push(result);
  }

  if (results.length > 0) {
    const totalSargas = results.reduce((s, r) => s + r.sargas, 0);
    const totalVerses = results.reduce((s, r) => s + r.verses, 0);
    console.log(`\n📊 Total: ${totalSargas} sargas, ${totalVerses} verses`);
    console.log(`🎉 Working copies ready in qa-review/\n`);
  }
}

main();
