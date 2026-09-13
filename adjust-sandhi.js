const fs = require('fs');
const path = require('path');

// Get sarga number from command line
const sargaArg = process.argv[2];
if (!sargaArg) {
    console.error('Please provide a Sarga number. Usage: node adjust-sandhi.js <sarga_number>');
    process.exit(1);
}

// Format the sarga number to 3 digits
const sargaNum = sargaArg.padStart(3, '0');
let filePath = path.join(__dirname, 'qa-review', 'sundara-kanda', `sarga-${sargaNum}.txt`);

// Fallback to .md if .txt doesn't exist
if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, 'qa-review', 'sundara-kanda', `sarga-${sargaNum}.md`);
}

if (!fs.existsSync(filePath)) {
    console.error(`File not found: sarga-${sargaNum}.txt or sarga-${sargaNum}.md in qa-review/sundara-kanda/`);
    process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');
const processedLines = [];

// Helper function to resolve sandhi at a break point
function resolveSandhi(text) {
    let t = text.trim();
    if (t.endsWith('ś') || t.endsWith('s') || t.endsWith('r')) {
        return t.slice(0, -1) + 'ḥ';
    } else if (t.endsWith('o') || t.endsWith('ō')) {
        // Most words ending in 'o' at a break are 'aḥ' (e.g. rāmo -> rāmaḥ)
        // Exceptions like vocatives (prabho) are rare at quarter-ends but watch out!
        return t.slice(0, -1) + 'aḥ';
    }
    return t;
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
        
        processedLines.push(part1);
        processedLines.push(part2);
    } else {
        // If it's a Sanskrit line but doesn't end with a danda (| or ||)
        // it might be a quarter-shloka ending where sandhi wasn't resolved.
        if (!trimmed.endsWith('|') && !trimmed.endsWith('||')) {
            // Only apply if it looks like a sandhi character
            if (trimmed.endsWith('ś') || trimmed.endsWith('s') || trimmed.endsWith('r') || trimmed.endsWith('o') || trimmed.endsWith('ō')) {
                // We will preserve the original leading whitespace
                const leadingSpace = line.match(/^\s*/)[0];
                line = leadingSpace + resolveSandhi(trimmed);
            }
        }
        processedLines.push(line);
    }
}

fs.writeFileSync(filePath, processedLines.join('\n'), 'utf8');
console.log(`Successfully adjusted sandhi rules for Sarga ${sargaArg} in ${filePath}`);
