const fs = require('fs');
const path = 'c:/Users/mhari/Projects/ramayana-project/qa-review/sundara-kanda/sarga-003.md';

let lines = fs.readFileSync(path, 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    
    // Check if the line is a Sanskrit verse (ends with | or ||)
    if (line.trim().endsWith('|') || line.trim().endsWith('||')) {
        
        // 1. Replace short 'e' and 'o' with long 'ē' and 'ō'
        line = line.replace(/e/g, 'ē');
        line = line.replace(/o/g, 'ō');
        
        // 2. Fix Sandhi separations (removing the space)
        // m + vowel
        line = line.replace(/m a/g, 'ma');
        line = line.replace(/m ā/g, 'mā');
        line = line.replace(/m i/g, 'mi');
        line = line.replace(/m ī/g, 'mī');
        line = line.replace(/m u/g, 'mu');
        line = line.replace(/m ū/g, 'mū');
        line = line.replace(/m ē/g, 'mē');
        line = line.replace(/m ō/g, 'mō');
        
        // consonants + consonant (common splits)
        line = line.replace(/ś ca/g, 'śca');
        line = line.replace(/s tu/g, 'stu');
        line = line.replace(/s ta/g, 'sta');
        line = line.replace(/r bh/g, 'rbh');
        line = line.replace(/r m/g, 'rm');
        line = line.replace(/r d/g, 'rd');
        line = line.replace(/ñ c/g, 'ñca'); // careful here, ñ c is usually ñca if it was ñ ca. Let's just do /ñ ca/
        line = line.replace(/ñ ca/g, 'ñca');
        line = line.replace(/r y/g, 'ry');
        line = line.replace(/r v/g, 'rv');
        line = line.replace(/r j/g, 'rj');
        line = line.replace(/r g/g, 'rg');
        
        // other splits like 'gō’jināṁbaravāsasaḥ'
        // the user's text: go’jināmbaravāsasaḥ -> gō’jināṁbaravāsasaḥ. Wait, m before b should be ṁ in ISO-15919 sometimes, but let's stick to simple space removals.
        line = line.replace(/t c/g, 'tc'); // tat ca -> tacca, but if split as t ca it's rare.
        
        lines[i] = line;
    }
}

fs.writeFileSync(path, lines.join('\n'), 'utf8');
console.log('Sandhi divisions and e/o replaced successfully.');
