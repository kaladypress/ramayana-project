const fs = require('fs');
const path = require('path');

// Get arguments from command line
const sargaArg = process.argv[2];
const kandaArg = process.argv[3] || 'sundara-kanda'; // Default to sundara-kanda if not provided

if (!sargaArg) {
    console.error('Please provide a Sarga number. Usage: node extract-shlokas.js <sarga_number> [kanda_name]');
    process.exit(1);
}

// Format the sarga number to 3 digits
const sargaNum = sargaArg.padStart(3, '0');

// Paths setup
const inputDir = path.join(__dirname, 'qa-review', kandaArg);
const inputPath = path.join(inputDir, `sarga-${sargaNum}.md`);

// Map kanda name for source directory (e.g., 'sundara-kanda' -> 'sundarakanda')
const sourceKandaName = kandaArg.replace('-', '');
const outputDir = path.join(__dirname, 'source', sourceKandaName);
const outputPath = path.join(outputDir, `sarga-${sargaNum}.txt`);

if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const content = fs.readFileSync(inputPath, 'utf8');
const lines = content.split('\n');
const extractedLines = [];

for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    
    // Skip Markdown structure lines and meaning blocks
    if (line.startsWith('===') || line.startsWith('---') || line.startsWith('>')) {
        continue;
    }
    
    // Push the line
    extractedLines.push(line);
}

// Clean up consecutive blank lines to keep format pristine
const finalLines = [];
let prevEmpty = false;

for (const line of extractedLines) {
    if (line.trim() === '') {
        if (!prevEmpty) {
            finalLines.push('');
            prevEmpty = true;
        }
    } else {
        finalLines.push(line);
        prevEmpty = false;
    }
}

// Write to the output path
fs.writeFileSync(outputPath, finalLines.join('\n').trim() + '\n', 'utf8');
console.log(`✅ Extracted shlokas successfully saved to: ${outputPath}`);
