const fs = require('fs');
const path = require('path');

// Get arguments from command line
const sargaArg = process.argv[2];
const kandaArg = process.argv[3] || 'sundara-kanda'; // Default to sundara-kanda if not provided

if (!sargaArg) {
    console.error('Please provide a Sarga number. Usage: node adjust-sandhi.js <sarga_number> [kanda_name]');
    process.exit(1);
}

// Format the sarga number to 3 digits
const sargaNum = sargaArg.padStart(3, '0');
let filePath = path.join(__dirname, 'qa-review', kandaArg, `sarga-${sargaNum}.txt`);

// Fallback to .md if .txt doesn't exist
if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'qa-review', kandaArg, `sarga-${sargaNum}.md`);
}

if (!fs.existsSync(filePath)) {
    console.error(`File not found: sarga-${sargaNum}.txt or sarga-${sargaNum}.md in qa-review/${kandaArg}/`);
    process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
const processedLines = [];

const vowelRegex = /(ai|au|a|ā|i|ī|u|ū|e|o|r\u0325\u0304|r\u0325|l\u0325\u0304|l\u0325)/gi;

// Helper function to resolve sandhi at a break point
function resolveSandhi(text) {
    let t = text.trim();
    if (t.endsWith('ś') || t.endsWith('s') || t.endsWith('r')) {
        return t.slice(0, -1) + 'ḥ';
    } else if (t.endsWith('o') || t.endsWith('ō')) {
        // Most words ending in 'o' at a break are 'aḥ' (e.g. rāmo -> rāmaḥ)
        return t.slice(0, -1) + 'aḥ';
    }
    return t;
}

// Helper function to resolve sandhi at the 8-syllable quarter line break (for Anushtubh)
function applyQuarterLineSandhi(line) {
    // Preserve leading whitespace
    const leadingSpaceMatch = line.match(/^\s*/);
    const leadingSpace = leadingSpaceMatch ? leadingSpaceMatch[0] : '';
    
    const words = line.trim().split(/\s+/);
    let syllableCount = 0;
    
    for (let i = 0; i < words.length; i++) {
        const matches = words[i].match(vowelRegex);
        const count = matches ? matches.length : 0;
        syllableCount += count;
        
        // If we hit exactly 8 syllables (quarter line in Anushtubh)
        if (syllableCount === 8) {
            words[i] = resolveSandhi(words[i]);
            break; // Stop after finding the quarter line
        }
    }
    
    return leadingSpace + words.join(' ');
}


for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let trimmed = line.trim();

    // Skip empty lines, markdown blocks, meaning blocks, and numbers
    if (!trimmed || trimmed.startsWith('>') || trimmed.startsWith('---') || trimmed.startsWith('===') || /^\d+\.$/.test(trimmed)) {
        processedLines.push(line);
        continue;
    }

    // If the line contains a semicolon (used in Sarga 5 / Upajati meter to denote the half-line)
    if (line.includes(';')) {
        let parts = line.split(';');
        let part1 = resolveSandhi(parts[0]);
        let part2 = parts.slice(1).join(';').trim(); // Just in case there are multiple
        
        processedLines.push(part1 + ' ; ' + part2);
    } else {
        // Break sandhi at the 8th syllable quarter-line
        line = applyQuarterLineSandhi(line);
        trimmed = line.trim();

        // Also check if we need to resolve sandhi at the very end of the line (before | or ||)
        if (!trimmed.endsWith('|') && !trimmed.endsWith('||')) {
            // Only apply if it looks like a sandhi character
            if (trimmed.endsWith('ś') || trimmed.endsWith('s') || trimmed.endsWith('r') || trimmed.endsWith('o') || trimmed.endsWith('ō')) {
                const leadingSpace = line.match(/^\s*/)[0];
                line = leadingSpace + resolveSandhi(trimmed);
            }
        }
        processedLines.push(line);
    }
}

fs.writeFileSync(filePath, processedLines.join('\n'), 'utf8');
console.log(`Successfully adjusted sandhi rules for Sarga ${sargaArg} in ${kandaArg}`);
