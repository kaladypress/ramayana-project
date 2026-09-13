const fs = require('fs');
const path = require('path');

const inputPath = 'c:/Users/mhari/Projects/ramayana-project/qa-review/sundara-kanda/sarga-002.md';
const outputPath = 'c:/Users/mhari/Projects/ramayana-project/source/sundarakanda/sarga-002.txt';

const lines = fs.readFileSync(inputPath, 'utf8').split('\n');

let extractedLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip meaning blocks and horizontal rules
    if (line.startsWith('>') || line.startsWith('---')) {
        continue;
    }
    
    extractedLines.push(lines[i]);
}

// Clean up consecutive blank lines
let finalOutput = [];
let previousWasBlank = false;
for (const line of extractedLines) {
    const isBlank = line.trim() === '';
    if (isBlank && previousWasBlank) {
        continue;
    }
    finalOutput.push(line);
    previousWasBlank = isBlank;
}

fs.writeFileSync(outputPath, finalOutput.join('\n').trim() + '\n', 'utf8');
console.log('Extracted Shlokas to ' + outputPath);
