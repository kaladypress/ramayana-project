const fs = require('fs');

function appendTo(file, lines) {
    const path = 'c:/Users/mhari/Projects/ramayana-project/qa-review/' + file;
    fs.appendFileSync(path, '\n' + lines.join('\n') + '\n', 'utf8');
}

appendTo('Flora-Fauna', [
    "Krauñca (Bird) - [Sundara Kanda, Sarga 3, Verse 11, Lanka]",
    "Barhiṇa (Peacock) - [Sundara Kanda, Sarga 3, Verse 11, Lanka]",
    "Rājahaṁsa (Royal Swan) - [Sundara Kanda, Sarga 3, Verse 11, Lanka]",
    "Bhujaga/Nāga (Serpent) - [Sundara Kanda, Sarga 3, Verse 5, Lanka]",
    "Vāraṇa/Gaja (Elephant) - [Sundara Kanda, Sarga 3, Verse 36, Lanka]",
    "Haya/Vāji (Horse) - [Sundara Kanda, Sarga 3, Verse 35-36, Lanka]"
]);

appendTo('Geography', [
    "Lamba (Mountain peak) - [Sundara Kanda, Sarga 3, Verse 1, Lanka]",
    "Viṭapāvatī (City of Kubera) - [Sundara Kanda, Sarga 3, Verse 4, Referenced]",
    "Amarāvatī (City of Indra) - [Sundara Kanda, Sarga 3, Verse 6, Referenced]",
    "Vasvokasārā (City of Kubera) - [Sundara Kanda, Sarga 3, Verse 12, Referenced]",
    "Triviṣṭapa (Heaven) - [Sundara Kanda, Sarga 3, Verse 35, Referenced]"
]);

appendTo('Architecture-Artifacts', [
    "Niryūha (Turrets) - [Sundara Kanda, Sarga 3, Verse 4, Lanka]",
    "Maṇikuṭṭima (Jeweled floors) - [Sundara Kanda, Sarga 3, Verse 9, Lanka]",
    "Sopāna (Staircases) - [Sundara Kanda, Sarga 3, Verse 10, Lanka]",
    "Koṣṭhāgāra (Armories/Storehouses) - [Sundara Kanda, Sarga 3, Verse 18, Lanka]",
    "Yantrāgāra (Arsenals/Machine-rooms) - [Sundara Kanda, Sarga 3, Verse 18, Lanka]",
    "Vimāna (Flying vehicles) - [Sundara Kanda, Sarga 3, Verse 36, Lanka]"
]);

appendTo('Weapons', [
    "Kūṭamudgara (Concealed mace) - [Sundara Kanda, Sarga 3, Verse 29, Lanka]",
    "Daṇḍāyudha (Staff weapon) - [Sundara Kanda, Sarga 3, Verse 29, Lanka]",
    "Musala (Club) - [Sundara Kanda, Sarga 3, Verse 30, Lanka]",
    "Parigha (Iron mace) - [Sundara Kanda, Sarga 3, Verse 30, Lanka]",
    "Śakti (Spear) - [Sundara Kanda, Sarga 3, Verse 32, Lanka]",
    "Paṭṭiśa (Sword/Axe) - [Sundara Kanda, Sarga 3, Verse 32, Lanka]",
    "Aśani (Thunderbolt) - [Sundara Kanda, Sarga 3, Verse 32, Lanka]",
    "Kṣepaṇī (Sling) - [Sundara Kanda, Sarga 3, Verse 32, Lanka]",
    "Pāśa (Noose) - [Sundara Kanda, Sarga 3, Verse 32, Lanka]",
    "Śūla (Trident) - [Sundara Kanda, Sarga 3, Verse 33, Lanka]"
]);

appendTo('Musical-Instruments', [
    "Tūrya (General term for musical instruments) - [Sundara Kanda, Sarga 3, Verse 11, Lanka]"
]);

appendTo('Jewelry-Clothing', [
    "Hāṭaka (Gold) - [Sundara Kanda, Sarga 3, Verse 9, Lanka]",
    "Rājata (Silver) - [Sundara Kanda, Sarga 3, Verse 9, Lanka]",
    "Kāñcī (Waist-band) - [Sundara Kanda, Sarga 3, Verse 25, Lanka]",
    "Nūpura (Anklets) - [Sundara Kanda, Sarga 3, Verse 25, Lanka]"
]);

appendTo('Colors-Shades', [
    "Śveta (White) - [Sundara Kanda, Sarga 3, Verse 36, Lanka]"
]);

console.log("Appended trackers.");
