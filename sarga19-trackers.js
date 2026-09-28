const fs = require('fs');

function appendTo(file, lines) {
    const path = 'c:/Users/mhari/Projects/ramayana-project/qa-review/' + file;
    fs.appendFileSync(path, '\n' + lines.join('\n') + '\n', 'utf8');
}

appendTo('Flora-Fauna', [
    "Kadalī (Plantain tree) - [Sundara Kanda, Sarga 19, Verse 2, Lanka]",
    "Padminī (Lotus pond) - [Sundara Kanda, Sarga 19, Verse 14, Lanka]",
    "Mr̥ṇālī (Lotus stem) - [Sundara Kanda, Sarga 19, Verse 18, Lanka]",
    "Pannagendravadhūm (Wife of serpent king) - [Sundara Kanda, Sarga 19, Verse 9, Lanka]",
    "Gajarājavadhūm (Female elephant) - [Sundara Kanda, Sarga 19, Verse 19, Lanka]",
    "Vihaṅgama (Bird) - [Sundara Kanda, Sarga 19, Verse 16, Lanka]",
    "Rājasiṁha (Lion among kings) - [Sundara Kanda, Sarga 19, Verse 7, Lanka]"
]);

appendTo('Deities-Spirits-Mythology', [
    "Rohiṇī (Star/Deity) - [Sundara Kanda, Sarga 19, Verse 9, Lanka]",
    "Ketu (Comet/Planet) - [Sundara Kanda, Sarga 19, Verse 9, Lanka]",
    "Rāhu (Planet) - [Sundara Kanda, Sarga 19, Verse 15, Lanka]"
]);

console.log("Appended Sarga 19 trackers.");
