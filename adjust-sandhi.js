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

// Helper function to resolve intra-line external visarga sandhi (separated by spaces)
function resolveIntraLineSandhi(line) {
    // Replaces trailing 'ś', 's', 'r' of a word with 'ḥ' when followed by a space
    // e.g. "citrais toraṇair" -> "citraiḥ toraṇaiḥ"
    // "rūpyakopahitaiś citrais" -> "rūpyakopahitaiḥ citraiḥ"
    
    // Convert word-final ś followed by space and c/ch/ś
    let modified = line.replace(/ś(\s+)(c|ch|ś)/g, 'ḥ$1$2');
    // Convert word-final s followed by space and t/th/s
    modified = modified.replace(/s(\s+)(t|th|s)/g, 'ḥ$1$2');
    // Convert word-final r followed by space and any consonant (common in external sandhi before soft consonants)
    // Actually, 'r' followed by a space is almost always a visarga (e.g., toraṇair hemabhūṣitaiḥ -> toraṇaiḥ)
    modified = modified.replace(/r(\s+)([b-df-hj-np-tv-zśṣḥ])/g, 'ḥ$1$2');
    
    // Also handle 'o' to 'aḥ' if it's explicitly separated by space in padapatha (less safe, so leaving out for now)
    
    return modified;
}

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let trimmed = line.trim();

    // Skip empty lines, markdown blocks, meaning blocks, and numbers
    if (!trimmed || trimmed.startsWith('>') || trimmed.startsWith('---') || trimmed.startsWith('===') || /^\d+\.$/.test(trimmed)) {
        processedLines.push(line);
        continue;
    }

    // Apply intra-line sandhi resolution
    line = resolveIntraLineSandhi(line);
    // update trimmed after intraline changes
    trimmed = line.trim();

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
console.log(`Successfully adjusted sandhi rules for Sarga ${sargaArg} in ${kandaArg}`);
