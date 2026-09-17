const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'qa-review', 'sundara-kanda');
const forbiddenRegex = /\b(monkey|monkeys|lord|lords)\b/i;

let foundForbidden = false;

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let lineNum = 1;
    
    for (const line of lines) {
        // Only check meaning blocks, since Sanskrit text wouldn't have English words anyway
        if (line.trim().startsWith('>')) {
            const match = line.match(forbiddenRegex);
            if (match) {
                console.error(`❌ FORBIDDEN WORD "${match[0]}" found in ${path.basename(filePath)} at line ${lineNum}:`);
                console.error(`   ${line}`);
                foundForbidden = true;
            }
        }
        lineNum++;
    }
}

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.md') || file.endsWith('.txt')) {
        scanFile(path.join(dir, file));
    }
});

if (foundForbidden) {
    console.error('\n🔴 QA FAILED: Forbidden words detected. Please correct them before proceeding.');
    process.exit(1);
} else {
    console.log('✅ QA PASSED: No forbidden words detected in meaning blocks.');
}
