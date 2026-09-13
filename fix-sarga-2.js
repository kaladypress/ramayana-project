const fs = require('fs');

const path = 'c:/Users/mhari/Projects/ramayana-project/qa-review/sundara-kanda/sarga-002.md';
let lines = fs.readFileSync(path, 'utf8').split('\n');

let newLines = [];
let i = 0;

while (i < lines.length) {
    if (lines[i].startsWith('19.')) {
        break; // Stop at 19
    }
    newLines.push(lines[i]);
    i++;
}

// Now insert the corrected 19-31 block
const correctedBlock = `19.
girimūrdhni sthitāṁ laṅkāṁ pāṇḍurair bhavanaiḥ śubhaiḥ |
dadarśa sa kapiḥ śrīmān puramākāśagaṁ yathā ||

20.
pālitāṁ rākṣasendreṇa nirmitāṁ viśvakarmaṇā |
plavamānāmivākāśe dadarśa hanumān purīm ||

21.
vapraprākārajaghanāṁ vipulāṁbunavāṁbarām |
śataghnīśūlakēśāṁtāṁ aṭṭālakavataṁsakām ||

22.
manasēva kr̥tāṁ laṁkāṁ nirmitāṁ viśvakarmaṇā |
dvāramuttaramāsādya ciṁtayāmāsa vānaraḥ ||

23.
kailāsaśikharaprakhyāṁ ālikhaṁtīmivāṁbaram |
ḍīyamānāmivākāśaṁ ucchritairbhavanōttamaiḥ ||

> **Meaning 19-23:** The glorious Kapīśvara saw the city of Lanka situated on the mountain
> peak, gleaming with magnificent white mansions, appearing like a city floating
> in the sky. Built by Viśvakarmā and ruled by the king of Rākṣasas, Hanumān saw
> the city as if it were suspended in the air. Its ramparts and walls formed
> its hips, the vast ocean its garment, its artillery and spears its hair, and
> the watchtowers its earrings. Having reached the northern gate of Lanka—which
> seemed as if created by the mind, built by Viśvakarmā, resembling the peak of
> Mount Kailāśa, appearing to scrape the sky and soaring with its towering,
> excellent mansions—the Vānara began to think.
---

24.
saṁpūrṇāṁ rākṣasair ghorair nāgair bhogavatīmiva |
acintyāṁ sukr̥tāṁ spaṣṭāṁ kuberādhyuṣitāṁ purā ||

25.
daṁṣṭribhir bahubhiḥ śūraiḥ śūlapaṭṭiśapāṇibhiḥ |
rakṣitāṁ rākṣasair ghorair guhāmāśīviṣairapi ||

26.
tasyāśca mahatīṁ guptiṁ sāgaraṁ ca nirīkṣya saḥ |
rāvaṇaṁ ca ripuṁ ghoraṁ cintayāmāsa vānaraḥ ||

27.
āgatyāpīha harayo bhaviṣyanti nirarthakāḥ |
na hi yuddhena vai laṅkā śakyā jetuṁ surairapi ||

28.
imāṁ tu viṣamāṁ durgāṁ laṅkāṁ rāvaṇapālitām |
prāpyāpi sa mahābāhuḥ kiṁ kariṣyati rāghavaḥ ||

29.
avakāśo na sāntvasya rākṣaseṣvabhigamyate |
na dānasya na bhedasya naiva yuddhasya dr̥śyate ||

30.
caturṇāmeva hi gatir vānarāṇāṁ mahātmanām |
vāliputrasya nīlasya mama rājñaśca dhīmataḥ ||

31.
yāvaj jānāmi vaidehīṁ yadi jīvati vā na vā |
tatraiva cintayiṣyāmi dr̥ṣṭvā tāṁ janakātmajām ||

> **Meaning 24-31:** Seeing the city filled with terrifying Rākṣasas, it resembled
> Bhogavatī, the city of Nāgas in the underworld. It was well-constructed,
> clearly defined, unimaginable, and formerly inhabited by Kubera. Defended by
> many fierce and valiant Rākṣasas wielding spears and swords, it was like a
> cave guarded by venomous serpents. Observing the immense fortifications, the
> surrounding ocean, and the terrifying enemy Rāvaṇa, Kapīśreṣṭha pondered: 'Even
> if the Vānaras were to arrive here, it would be in vain. For Lanka cannot be
> conquered in battle, even by the Devathās. What can the mighty-armed Rāghava
> do even if he reaches this impregnable and treacherous Lanka ruled by Rāvaṇa?
> There is no opportunity for conciliation among the Rākṣasas, nor for gifts,
> nor for sowing division, and certainly not for open war. Only four great
> Vānaras have the capability to reach here: the son of Vāli (Aṅgada), Nīla, the
> intelligent King Sugrīva, and myself. First, I must find out whether Vaidehī
> is alive or not. Only after seeing the daughter of Janaka will I think about
> the next steps.'
---`;

newLines.push(correctedBlock);

// Skip the original 19-31 block (which is messed up)
while (i < lines.length) {
    if (lines[i].startsWith('30.')) {
        break; // Stop at the old 30
    }
    i++;
}

// Process the rest, shifting numbers by +2
let currentNum = 32;
while (i < lines.length) {
    let line = lines[i];
    
    // Check if line is a verse number
    if (line.match(/^\d+\.$/)) {
        newLines.push(currentNum + '.');
        currentNum++;
    } 
    // Check if line is a Meaning block
    else if (line.match(/^> \*\*Meaning \d+-\d+:\*\*/)) {
        let match = line.match(/^> \*\*Meaning (\d+)-(\d+):\*\*(.*)/);
        let start = parseInt(match[1]) + 2;
        let end = parseInt(match[2]) + 2;
        newLines.push(`> **Meaning ${start}-${end}:**${match[3]}`);
    } 
    else {
        newLines.push(line);
    }
    i++;
}

fs.writeFileSync(path, newLines.join('\n'), 'utf8');
console.log('Fixed file and generated meaning 19-23.');
