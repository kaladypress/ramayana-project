# Valmiki Ramayana — Kalady Press Edition Plan

## Design Decisions (Locked In)

| Decision | Choice |
|---|---|
| **Trim Size** | 8 × 10 inches |
| **Page Layout** | 75/25 split — shlokas top, meanings bottom, horizontal separator |
| **Shloka Font** | Noto Sans, 14pt |
| **Meaning Font** | Noto Sans, 11pt |
| **Meaning Style** | Block/grouped (matching Gorakhpur Telugu, not 1:1 per verse) |
| **Titles/Headers** | Plain English (no diacritics) |
| **Volumes** | One per Kanda (7-8 total, Yuddha may split into 2) |
| **Shloka Source** | Online digital source (valmikiramayan.net / sanskritdocuments.org) |
| **Meaning Source** | Gorakhpur Telugu edition (user's physical copy) |
| **Language Tags** | English (en-US) throughout PDF metadata |
| **Transliteration** | Strict ISO-15919 standard |

---

## Volume Plan

| Vol | Kanda | ~Shlokas | ~Sargas | Est. Pages |
|---|---|---|---|---|
| 1 | Bāla Kāṇḍa | 2,300 | 77 | 420 |
| 2 | Ayodhyā Kāṇḍa | 4,300 | 119 | 780 |
| 3 | Āraṇya Kāṇḍa | 2,400 | 75 | 440 |
| 4 | Kiṣkindhā Kāṇḍa | 2,100 | 67 | 380 |
| 5 | Sundara Kāṇḍa | 2,800 | 68 | 510 |
| 6a | Yuddha Kāṇḍa (Part 1) | ~2,900 | ~64 | ~530 |
| 6b | Yuddha Kāṇḍa (Part 2) | ~2,900 | ~64 | ~530 |
| 7 | Uttara Kāṇḍa | 3,600 | 111 | 650 |

> [!NOTE]
> Sundara Kanda meanings are already drafted from the existing Sundarakanda project.

---

## Page Layout

```
┌──────────────────────────────────────────┐
│            Bala Kanda — Sarga 1          │  ← running header (plain English)
│                                          │
│  1.                                      │
│  tapa svādhyāya niratāṃ tapasvī         │  ← 14pt Noto Sans
│  vāgvidāṃ varam |                       │
│  nāradaṃ paripapraccha                   │
│  vālmīkir munipuṅgavam ||               │
│                                          │
│  2.                                      │
│  kō nv asmin sāṃprataṃ lōkē             │
│  guṇavān kaś ca vīryavān |              │
│  ...                                     │
│                                          │
│  (more shlokas...)                       │
│                                          │  ← 75% of page
│  ═══════════════════════════════════════  │  ← fixed separator
│                                          │  ← 25% of page
│  1. Sage Valmiki, devoted to penance     │  ← 11pt Noto Sans
│  and study, asked the celestial sage     │
│  Narada, foremost among the eloquent.    │
│                                          │
│  2-4. Who in this world today is         │
│  virtuous, valiant, righteous...         │
│                                     12   │  ← page number
└──────────────────────────────────────────┘
```

---

## Book Structure (Per Volume)

Each volume follows this page sequence:

1. **Half-Title Page** — plain English Kanda name
2. **Blank Page**
3. **Full Title Page** — Kanda name, "Valmiki Ramayana", author credit
4. **Copyright Page** — Kalady Press standard (ISO-15919 English transliteration notice)
5. **Dedication Page** — consistent across all volumes
6. **Table of Contents** — Sarga listing with page numbers
7. **Pronunciation Guide** — Kalady Press standard (reuse existing)
8. **Body** — Sargas with 75/25 shloka/meaning layout
9. **Final Page** — svasti prajābhyaḥ + Kalady Press branding

---

## File Structure

```
ramayana-project/
├── src/
│   ├── compile-pdf.js          ← Main PDF compiler (one per volume)
│   └── fonts/
│       ├── NotoSans-Regular.ttf
│       └── NotoSans-Bold.ttf
├── qa-review/
│   ├── pronunciation-guide.txt  ← Shared across all volumes
│   ├── bala-kanda/
│   │   ├── sarga-001.txt
│   │   ├── sarga-002.txt
│   │   └── ... (77 files)
│   ├── ayodhya-kanda/
│   │   └── ...
│   └── ... (one folder per kanda)
├── output/
│   ├── bala-kanda-interior.pdf
│   └── ...
└── package.json
```

---

## Data Entry Format (Per Sarga File)

```
=== Sarga 1 ===
Narada Prashna

---
1.
tapa svādhyāya niratāṃ tapasvī vāgvidāṃ varam |
nāradaṃ paripapraccha vālmīkir munipuṅgavam ||

2.
kō nv asmin sāṃprataṃ lōkē guṇavān kaś ca vīryavān |
dharmajñaś ca kr̥tajñaś ca satyavākyō dhr̥ḍhavrataḥ ||

3.
cāritrēṇa ca kō yuktaḥ sarvabhūtēṣu kō hitaḥ |
vidvān kaḥ kaḥ samarthaś ca kaś caika priya darśanaḥ ||

4.
ātmavān kō jitakrōdhō dyutimān kō'nasūyakaḥ |
kasya bibhyati dēvāś ca jāta rōṣasya saṁyugē ||

=== meaning ===
1. Sage Valmiki, ever devoted to penance and self-study,
asked the celestial sage Narada, foremost among the
eloquent and the best among sages.

2-4. Who in this world today is virtuous, valiant,
righteous, grateful, and truthful? Who is steadfast in
vows, compassionate to all beings, learned, capable,
and pleasing to behold? Who is self-controlled, free
from anger, radiant, and free from envy? Whom do even
the gods fear when roused in battle?
---
5.
ētad icchāmy ahaṁ śrōtuṁ paraṁ kautūhalaṁ hi mē |
maharṣē tvaṁ samarthō'si jñātum ēvaṁ vidhaṁ naram ||

=== meaning ===
5. I wish to hear about such a person. My curiosity
is immense, O great sage. You alone are capable of
knowing such a man.
---
```

### Format Rules:
- `=== Sarga N ===` starts a sarga, optional title on next line
- `---` separates verse blocks
- Verse numbers on their own line, followed by shloka lines (with dandas)
- `=== meaning ===` marker separates shlokas from their grouped meaning
- Blank verse blocks between `---` markers belong together with the meaning that follows

---

## Workflow (Per Kanda)

| Phase | Owner | Method | Sessions |
|---|---|---|---|
| 1. Shloka Sourcing | **AI** | Automated Node.js script — run once | 0 (just run the script) |
| 2. Meaning Generation | **AI** | Batched, ~15 sargas per session | ~5-6 per Kanda |
| 3. Review | **User** | Manual — the core human work | At your own pace |
| 4. Proofreading | **Temple Volunteer** | Manual — parallel track | At volunteer's pace |
| 5. Compilation | **AI** | Automated script — run once | 0 (just run the script) |

### Phase 1: Shloka Sourcing `[AI — automated script, zero quota]`

AI writes a one-time Node.js script (`extract-shlokas.js`) that:
1. Fetches all sargas for a given Kanda from valmikiramayan.net
2. Parses and cleans the Devanagari text
3. Converts to ISO-15919 Roman transliteration
4. Writes organized sarga files to `qa-review/<kanda-name>/`

You simply run `node extract-shlokas.js bala-kanda` and all 77 sarga files are created in minutes. No AI conversation needed, no quota consumed.

> [!TIP]
> The script is reusable across all 7 Kandas. Write it once, run it 7 times.

### Phase 2: Meaning Generation `[AI — batched sessions]`

AI generates draft English meanings in manageable batches:
1. Each session covers ~15 sargas (~300-450 shlokas)
2. Meanings are grouped per Gorakhpur style (block meanings, not 1:1)
3. Meanings are inserted into the existing sarga files using `=== meaning ===` markers
4. For Bala Kanda (77 sargas): ~5-6 sessions total

> [!NOTE]
> After Phases 1-2, every sarga file is complete with both shlokas and draft meanings.
> The user does not need to create or type any content from scratch.

### Phase 3: User Review `[User — this is where your work begins]`
1. Open sarga file in editor + physical Gorakhpur Telugu book beside you
2. Read AI-generated English meaning alongside your Telugu meaning
3. If the English matches the Telugu intent → move on
4. If it diverges → correct it (even rough corrections; AI can polish the English)
5. Adjust meaning block groupings to match your Gorakhpur copy if needed
6. Mark sarga as reviewed

### Phase 4: Shloka Proofreading `[Temple Volunteer — parallel track]`
1. Volunteer verifies transliterated shlokas against printed Devanagari source
2. Corrections applied to sarga files
3. Can happen in parallel with Phase 3 (user reviews meanings while volunteer checks shlokas)

### Phase 5: Compilation & Publishing `[AI — fully automated]`
1. Run `compile-pdf.js` for the Kanda
2. Visual review of generated PDF
3. Upload to KDP

---

## Suggested Starting Order

1. **Bala Kanda** — the natural beginning of the story, moderate length
2. **Sundara Kanda** — meanings already drafted, quickest to complete
3. **Ayodhya Kanda** — the emotional heart of the Ramayana
4. Continue with Aranya → Kishkindha → Yuddha → Uttara

> [!IMPORTANT]
> No deadline. Publish each volume when it meets Kalady Press quality standards.

---

## Open Questions

1. **Sarga titles** — Should each sarga have an English descriptive title (e.g., "The Question to Narada") or just a number?
2. **Series branding** — Should all volumes share a common cover design template with the Kanda name varying?
3. **Cross-references** — Should meanings reference related verses in other Kandas, or keep each volume self-contained?
4. **Colophon style** — Should sarga-ending colophons (iti vālmīki rāmāyaṇē...) be included after each sarga?
