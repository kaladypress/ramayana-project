const fs = require('fs');

const inputPath = 'c:/Users/mhari/Projects/ramayana-project/qa-review/sundara-kanda/sarga-004.txt';
const outputPath = 'c:/Users/mhari/Projects/ramayana-project/qa-review/sundara-kanda/sarga-004.md';

const content = fs.readFileSync(inputPath, 'utf8');
const lines = content.split('\n');

const processedLines = [];

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Check if the line has a semicolon
    if (line.includes(';')) {
        let parts = line.split(';');
        let part1 = parts[0].trim();
        let part2 = parts[1].trim();

        // Resolve sandhi at the end of part1
        if (part1.endsWith('ś')) {
            part1 = part1.slice(0, -1) + 'ḥ';
        } else if (part1.endsWith('s')) {
            part1 = part1.slice(0, -1) + 'ḥ';
        } else if (part1.endsWith('r')) {
            part1 = part1.slice(0, -1) + 'ḥ';
        } else if (part1.endsWith('o') || part1.endsWith('ō')) {
            part1 = part1.slice(0, -1) + 'aḥ';
        }

        // Add to processed lines, splitting into two physical lines
        processedLines.push(part1);
        processedLines.push(part2);
    } else {
        processedLines.push(line);
    }
}

fs.writeFileSync(outputPath, processedLines.join('\n'), 'utf8');
console.log('Formatted sarga-004.md successfully.');
