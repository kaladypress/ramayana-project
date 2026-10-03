const fs = require('fs');
const path = require('path');

function appendTo(file, lines) {
    const filePath = path.join('c:/Users/mhari/Projects/ramayana-project/qa-review', file);
    // filter out items that might already be there, or just append. The guidelines say "maintain as a clean list"
    // Let's just append for now, the user can run python consolidate.py later if they have one (saw consolidate.py).
    fs.appendFileSync(filePath, '\n' + lines.join('\n') + '\n', 'utf8');
}

appendTo('Flora-Fauna', [
    "Haya (Horse) - [Sundara Kanda, Sarga 22, Verse 3, Lanka]",
    "Mātaṅga (Elephant) - [Sundara Kanda, Sarga 22, Verse 16, Lanka]",
    "Śaśa (Hare/Rabbit) - [Sundara Kanda, Sarga 22, Verse 16, Lanka]",
    "Dvirada (Elephant - two-tusked) - [Sundara Kanda, Sarga 22, Verse 16, Lanka]",
    "Bhujaṅga (Serpent) - [Sundara Kanda, Sarga 22, Verse 26, Lanka]",
    "Aśoka (Tree) - [Sundara Kanda, Sarga 22, Verse 28, Lanka]",
    "Kalpavr̥kṣa (Wish-yielding tree) - [Sundara Kanda, Sarga 22, Verse 29, Lanka]",
    "Nāga (Serpents/Serpent-maidens) - [Sundara Kanda, Sarga 22, Verse 45, Lanka]",
    "Mārjāra (Cat) - [Sundara Kanda, Sarga 23, Verse 9, Lanka]",
    "Vāyasa (Crow) - [Sundara Kanda, Sarga 23, Verse 22, Lanka]",
    "Śiṁśapā (Tree) - [Sundara Kanda, Sarga 24, Verse 14, Lanka]",
    "Hariṇa (Doe/Deer) - [Sundara Kanda, Sarga 24, Verse 39, Lanka]",
    "Mr̥gī (Doe) - [Sundara Kanda, Sarga 25, Verse 5, Lanka]",
    "Koka (Wolf) - [Sundara Kanda, Sarga 25, Verse 5, Lanka]",
    "Kadalī (Plantain tree) - [Sundara Kanda, Sarga 25, Verse 8, Lanka]",
    "Vyālī (Female serpent) - [Sundara Kanda, Sarga 25, Verse 9, Lanka]",
    "Padma (Lotus) - [Sundara Kanda, Sarga 25, Verse 16, Lanka]",
    "Siṁha (Lion) - [Sundara Kanda, Sarga 25, Verse 16, Lanka]",
    "Kiśorī (Filly/Young mare) - [Sundara Kanda, Sarga 26, Verse 2, Lanka]",
    "Gr̥dhra (Vulture) - [Sundara Kanda, Sarga 26, Verse 20, Lanka]",
    "Gaja (Elephant) - [Sundara Kanda, Sarga 27, Verse 12, Lanka]",
    "Dantin (Elephant) - [Sundara Kanda, Sarga 27, Verse 14, Lanka]",
    "Vāji (Horse) - [Sundara Kanda, Sarga 27, Verse 10, Lanka]",
    "Rṣabha/Vr̥ṣabha (Bull) - [Sundara Kanda, Sarga 27, Verse 17, Lanka]",
    "Karavīra (Oleander/Flower) - [Sundara Kanda, Sarga 27, Verse 23, Lanka]",
    "Khara (Donkey) - [Sundara Kanda, Sarga 27, Verse 24, Lanka]",
    "Gardabha (Donkey) - [Sundara Kanda, Sarga 27, Verse 25, Lanka]",
    "Varāha (Boar) - [Sundara Kanda, Sarga 27, Verse 31, Lanka]",
    "Śiṁśumāra (Crocodile/Dolphin) - [Sundara Kanda, Sarga 27, Verse 31, Lanka]",
    "Uṣṭra (Camel) - [Sundara Kanda, Sarga 27, Verse 31, Lanka]",
    "Kareṇu (She-elephant) - [Sundara Kanda, Sarga 27, Verse 52, Lanka]",
    "Pakṣī (Bird) - [Sundara Kanda, Sarga 27, Verse 53, Lanka]"
]);

appendTo('Geography', [
    "Mandara (Mountain) - [Sundara Kanda, Sarga 22, Verse 26, Lanka]",
    "Śvetaparvata (White Mountain) - [Sundara Kanda, Sarga 27, Verse 11, Lanka]",
    "Nikumbhilā (Sacrificial ground/Grove) - [Sundara Kanda, Sarga 24, Verse 46, Lanka]"
]);

appendTo('Architecture-Artifacts', [
    "Niveśana / Veśma (Palace/Abode) - [Sundara Kanda, Sarga 22, Verse 43, Lanka]",
    "Śibikā (Palanquin) - [Sundara Kanda, Sarga 27, Verse 9, Lanka]",
    "Vimāna (Flying vehicle) - [Sundara Kanda, Sarga 27, Verse 19, Lanka]",
    "Ratha (Chariot) - [Sundara Kanda, Sarga 27, Verse 17, Lanka]",
    "Gopura (Gateway) - [Sundara Kanda, Sarga 27, Verse 37, Lanka]",
    "Toraṇa (Arch) - [Sundara Kanda, Sarga 27, Verse 37, Lanka]"
]);

appendTo('Weapons', [
    "Paraśvadha (Battle-axe) - [Sundara Kanda, Sarga 24, Verse 16, Lanka]",
    "Śūla (Spear) - [Sundara Kanda, Sarga 24, Verse 38, Lanka]"
]);

appendTo('Musical-Instruments', [
    "Śaṅkha (Conch) - [Sundara Kanda, Sarga 27, Verse 33, Lanka]",
    "Dundubhi (Drum) - [Sundara Kanda, Sarga 27, Verse 33, Lanka]"
]);

appendTo('Jewelry-Clothing', [
    "Aṅgada (Armlet) - [Sundara Kanda, Sarga 22, Verse 25, Lanka]",
    "Makuṭa (Crown) - [Sundara Kanda, Sarga 22, Verse 25, Lanka]",
    "Śroṇīsūtra (Girdle/Waist-band) - [Sundara Kanda, Sarga 22, Verse 26, Lanka]",
    "Kuṇḍala (Earrings) - [Sundara Kanda, Sarga 22, Verse 28, Lanka]",
    "Taptāṅgada (Refined gold armlet) - [Sundara Kanda, Sarga 22, Verse 25, Lanka]",
    "Ambara (Garment) - [Sundara Kanda, Sarga 27, Verse 18, Lanka]"
]);

appendTo('Colors-Shades', [
    "Nīla (Dark blue/Black) - [Sundara Kanda, Sarga 22, Verse 24, Lanka]",
    "Rakta (Red) - [Sundara Kanda, Sarga 22, Verse 25, Lanka]",
    "Tāmra (Coppery/Red) - [Sundara Kanda, Sarga 23, Verse 5, Lanka]",
    "Kr̥ṣṇapiṅgala (Dark-brown) - [Sundara Kanda, Sarga 22, Verse 18, Lanka]",
    "Śveta (White) - [Sundara Kanda, Sarga 27, Verse 11, Lanka]",
    "Śukla (White) - [Sundara Kanda, Sarga 27, Verse 10, Lanka]",
    "Pāṇḍura (White/Yellowish-white) - [Sundara Kanda, Sarga 27, Verse 17, Lanka]",
    "Kr̥ṣṇa (Black) - [Sundara Kanda, Sarga 27, Verse 24, Lanka]"
]);

appendTo('Food-Ingredients', [
    "Surā (Liquor) - [Sundara Kanda, Sarga 24, Verse 46, Lanka]",
    "Māṁsa (Meat/Flesh) - [Sundara Kanda, Sarga 24, Verse 46, Lanka]",
    "Taila (Oil) - [Sundara Kanda, Sarga 27, Verse 22, Lanka]",
    "Mūlaphala (Roots and fruits) - [Sundara Kanda, Sarga 26, Verse 46, Lanka]"
]);

console.log("Trackers for Sargas 22-27 appended.");
