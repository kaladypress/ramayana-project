# Translation Guidelines for Rāmāyaṇa Project

These rules apply whenever generating, editing, or reviewing English meanings/translations for ślokas.

## Terminology Rules

### Forbidden Terms & Replacements

**ABSOLUTE BAN:** The English word "monkey" or "monkeys" MUST NEVER appear anywhere in the meaning blocks, even in literal translations of compound words (e.g., `hariśārdūla` or `kapikuñjara`).

| ❌ Do NOT use (Under any circumstance) | ✅ Use instead |
|---|---|
| monkey / monkeys | Hanumān, Kapīśreṣṭha, Vānara(s), Plavaṅgama, Kapi, Hari, or the specific epithet from the śloka |
| "tiger among monkeys" / "leader of monkeys" | "tiger among Vānaras", "Hariśārdūla", "leader of Vānaras", "Hariyūthapa", or "Hanumān" |
| lord | god, goddess, or preferably devathā(s) / devatā(s) |

### Character Names & Epithets

- Always prefer using the **Sanskrit name or epithet** found in the śloka when referring to characters.
- For Hanumān specifically, use the epithet present in the verse (e.g., Kapikuñjara, Mārutātmaja, Vāyunandana, Anilaātmaja, Pavanaputra, etc.) or simply "Hanumān."
- When a new epithet or name appears for Hanumān or any other character, **add it to the glossary** (`qa-review/glossary-terms`) with its meaning and context.

### General Style

- Maintain reverence and dignity in the translation — this is sacred literature. Dignity comes from accuracy and clarity, **not** from old-fashioned or ornate English (see *Register* below).
- Use transliterated Sanskrit terms (ISO-15919) where they convey meaning better than English equivalents.
- **Sequential Meaning Flow:** When providing meanings for a block of verses, the narrative sequence of the meaning block MUST strictly mirror the sequential order of the ślokas themselves. Do not reorder or shuffle the concepts into a general summary; maintain the exact order as they appear in the original text.
- When grouping meanings for multiple ślokas, do so within a Markdown blockquote. Prefix each line with `>` and start the block with the word "Meaning" bolded indicating the ślokas covered. For example:
  `> **Meaning 52-56:** ...`
  `> ...continuation of translation...`
- **CRITICAL:** Wrap meaning lines to ~80 characters for readability, ensuring every wrapped line starts with `> `. Do not output one single long line for the entire blockquote.
- **Variant Readings (Pāṭhāntara):** If there are extra verses or variant readings present in the Gorakhpur text but absent in others, label them sequentially as `Patha-1.`, `Patha-2.`, etc., rather than standard numbered ślokas. Their meanings should be prefixed similarly (e.g., "Patha-1: ...").
- **Definitive Source:** The primary source for translation verification, verse numbering, and inclusion/omission of specific ślokas is the **Gorakhpur (Gita Press) Telugu edition**. Be aware that this may contain variant readings (pāṭha-bhedas) or extra verses compared to other editions.
- **NEVER use web search or external sources to find translations.** Always generate the translations and meanings using internal intelligence, knowledge of the Rāmāyaṇa, and Sanskrit proficiency.
- **Context Loading:** Before generating translations for a new sarga, use the `view_file` tool to read the opening ~40 lines (including meanings) of the previous completed sarga. This keeps tone, rhythm, and narrative continuity consistent without reading whole files (see *Token-Efficient Workflow*).

## Register: Modern, Plain English

### Governing Principle

> **Write the way a thoughtful, educated person speaks today — not the way 19th-century Orientalist or King James–style translations read.**

Older English translations of the Rāmāyaṇa imposed a Western, Biblical/Shakespearean register on the text. This project deliberately avoids that. The Sanskrit's power should come through its own imagery and meaning, not through borrowed archaic English.

### Rules

1. **Normal English word order.** No inverted or poetic syntax ("never again shall you be his", "Mortal that you are", "Thus spoke she").
2. **Everyday modern vocabulary.** Prefer the common word over the literary one.
3. **Short, clear sentences.** Break long Sanskrit compounds and clause chains into natural English sentences while keeping the śloka order.
4. **Dialogue must sound spoken.** Characters should sound like real people talking — contractions ("you're", "don't") are allowed, especially in heated or crude speech (e.g., the Rākṣasīs).
5. **Accuracy first.** Plain does not mean loose — every idea in the śloka must still be present, in order.
6. **Vocatives:** Avoid the archaic "O ...!" where possible. Fold address terms into the sentence naturally ("Listen, Sītā", "beautiful one"). Use "O" only in genuine invocations/prayers.

### Banned Archaisms

| ❌ Do NOT use | ✅ Use instead |
|---|---|
| shall / shalt (for future) | will |
| thou, thee, thy, thine, ye | you, your |
| dwell / abide | live / stay |
| behold / lo | see / look |
| sport (with) / dally | enjoy yourself / spend time with / live (with) |
| consent to | agree to / be willing to |
| hold in high esteem | think highly of / value |
| wifehood | being a wife / being his wife |
| "X that you are" | "You are X, and..." / "Since you're X..." |
| "never again shall..." / inverted syntax | "... will never ... again" |
| mortal (as a noun for human) | human / person |
| apartments (for rooms) | quarters / rooms / palace |
| whereupon, thereupon, hither, thither, ere, wherefore | then, after that, here, there, before, why |
| utterly dejected / bereft | completely broken / heartbroken / without |

### Self-Check

Before finalizing a meaning block, read it aloud. If it sounds like a Victorian translation, a Bible verse, or a stage play, rewrite it.

## Epithet & Adjective Translation Framework

### Governing Principle

> **The epithet must land as poetry, not as anatomy.**

Sanskrit *bahuvrīhi* compounds and vocative epithets are poetic devices that convey a single aesthetic impression (*rasa*). They must be rendered as **flowing, natural modern English**, never as mechanical compound-cracking or anatomical descriptions. If it reads like a footnote or a medical report, it must be rewritten. If it reads like an archaic Western epic (see *Register* above), it must also be rewritten.

### Banned Patterns

| ❌ NEVER write | Why it fails |
|---|---|
| "beauty in every limb" | "limb" is clinical/anatomical; *aṅga* means form, feature, aspect |
| "O lady with beautiful [body part]" | Mechanical compound-cracking; destroys poetic register |
| Stacked vocatives: "O X! O Y! O Z!" | Reads like a checklist, not an incantation |
| "one with [adjective] [body part]" | Footnote syntax, not epic poetry |
| "limb" for *aṅga* | Always replace with "form," "feature," or restructure entirely |
| "lady of auspicious limbs" for *suśroṇi* | Mistranslation — *suśroṇi* = "of graceful bearing/hips" |

### Epithet Lookup Table

Use Strategy 2 (Contextual Rendering) or Strategy 3 (Selective Preservation of Sanskrit Imagery) based on which produces the most natural English for the passage.

| Sanskrit Epithet | ❌ Avoid | ✅ Preferred Renderings |
|---|---|---|
| *sarvāṅga sundarī* | "beauty in every limb" | "of faultless beauty" / "radiant in every way" / "flawless in every aspect" |
| *suvibhaktāṅgī* | "beautifully proportioned limbs" | "of perfect form" / "exquisitely formed" |
| *cārusmite* | "O lady with beautiful smile" | "bright-smiling one" / weave into sentence flow |
| *cārudati* | "O lady with beautiful teeth" | fold into "radiance" or omit if stacked with other *cāru-* |
| *cārunetre* | "O lady with beautiful eyes" | "enchanting one" / "luminous-eyed" |
| *mṛganayanā / mṛgākṣī* | "O deer-eyed one" | "doe-eyed" (compound works in English) |
| *padma/kamala-netrā* | "one with lotus eyes" | "lotus-eyed" (compound works in English) |
| *viśālākṣī* | "one with large eyes" | "wide-eyed" / "the large-eyed princess" |
| *suśroṇi* | "lady of auspicious limbs" | "graceful one" / "of graceful bearing" |
| *subhru* | "O lady with beautiful eyebrows" | "fair-browed one" (compact compound) |
| *tanvī / kṛśodarī* | "slender-bodied one" | "slender" / "the slender one" |
| *varānane* | "O lady with an excellent face" | "fair-faced one" / "O radiant one" |
| *śubhadarśane* | "O lady of auspicious appearance" | omit or weave: "there is no beauty to compare with yours" |
| *asitakeśānte* | "O lady with beautiful dark hair" | "dark-tressed one" |
| *vilāsinī* | "O charming lady" | "enchanting one" / "O enchanting one" |
| *bhīru* | "O timid lady" | "shy one" / "O gentle one" (context-dependent) |
| Stacked *cāru-* vocatives | "O lady with X! O lady with Y!" | Merge: "O enchanting one — your smile, your radiance, your eyes —" |

### Speaker-Sensitive Voice

The same epithet must **feel different** based on who speaks and when. Calibrate the emotional register:

- **Rāvaṇa** addressing Sītā → **Intoxicated, obsessive, incantatory.** His epithets are weapons of seduction. Cascade them as a single wave, not a list. Use em-dashes to create breathless momentum.
- **Hanumān** describing Sītā → **Reverent, grieving, awestruck.** He is witnessing a goddess in captivity. Epithets should be tender and restrained.
- **Narrative voice** (poet's descriptions) → **Measured, majestic, epic.** The poet paints a scene. Epithets should feel like brushstrokes, not annotations.
- **Rākṣasīs** taunting Sītā → **Crude, mocking, aggressive.** Their use of beauty-epithets is ironic — the translation should carry that edge.

### Handling *aṅga* (अङ्ग)

The Sanskrit word *aṅga* does NOT map to English "limb." It encompasses form, feature, aspect, part — a holistic concept. Apply these rules:

1. **Never** translate *aṅga* as "limb" in beauty-epithets
2. **Prefer** "form" or "feature" when a direct equivalent is needed
3. **Best practice**: restructure the phrase entirely so *aṅga* disappears into natural English
   - *mr̥duṣv aṅgeṣu* → "upon their soft forms" (not "on their tender limbs")
   - *suvibhaktāṅgī* → "exquisitely formed" (not "with well-proportioned limbs")
4. **Exception**: "limb" is acceptable ONLY for physical/anatomical contexts unrelated to beauty (e.g., a limb trembling from a blow, a severed limb in battle)

### Reference Sarga

**Sarga 20 (Sundara Kāṇḍa)** has been revised as the reference implementation of this framework. Consult it for tone, pacing, and epithet handling before translating any new sarga.


## Glossary Maintenance

- The glossary lives at `qa-review/glossary-terms`.
- Foot-notes and commentary references go in `qa-review/Foot-Notes`.
- When encountering terms for celestial beings (Yakṣas, Kinnaras, Gandharvas, Nāgas, Vidyādharas, Cāraṇas, Siddhas, etc.), add them to the glossary on first occurrence.

## Data Tracking (Flora, Fauna, Geography, Architecture, Weapons, Instruments, Adornments, Colors & Food)

- **Flora & Fauna:** Any plants, trees, flowers, birds, or animals mentioned must be logged in `qa-review/Flora-Fauna`.
- **Geography:** Any mountains, rivers, cities, or specific regions mentioned must be logged in `qa-review/Geography`.
- **Architecture & Artifacts:** Any specific buildings, fortifications, materials, or structural elements (e.g., moats, gateways, crystal floors) must be logged in `qa-review/Architecture-Artifacts`.
- **Weapons (Astras & Śastras):** Any specific divine or martial weapons mentioned must be logged in `qa-review/Weapons`.
- **Musical Instruments:** Any specific musical instruments (e.g., Vīṇā, Mr̥daṅga) mentioned must be logged in `qa-review/Musical-Instruments`.
- **Jewelry, Clothing, Gems & Metals:** Any specific types of ornaments, garments, gems, precious stones, or metals (e.g., Vaidūrya/cat's-eye, Muktā/pearl, Kāñcana/gold, Keyūra, Kuṇḍala) must be logged in `qa-review/Jewelry-Clothing`.
- **Colors & Shades:** Any specific references to hues, pigments, or shades (e.g., Pāṇḍura, Nīla) used to describe objects or beings must be logged in `qa-review/Colors-Shades`.
- **Food & Ingredients:** Any references to food, spices, ingredients, incense, or aromatics (e.g., Agaru, Candana) must be logged in `qa-review/Food-Ingredients`.
- **Metadata Requirement:** All entries in these tracking lists MUST be maintained as a clean list and include detailed metadata in the format: `Item (Description) - [Kanda, Sarga, Śloka, Location/Context]`. 
  *Example:* `Karnikara (Tree) - [Sundara Kanda, Sarga 2, Verse 9, Lanka]`

## Token-Efficient Workflow (Meaning Generation)

Use this workflow for every new sarga. It changes **how** meanings are written into files, never **what** the translation rules above require.

1. **Read the target sarga once** — `qa-review/<kanda>/sarga-NNN.txt` with `view_file`.
2. **Context loading (lightweight):** read only the first ~40 lines of the previous sarga for tone. Read Sarga 20 only if epithet handling is unclear.
3. **Do NOT read tracking logs in full.** New entries are appended by the script; duplicates across sargas are acceptable.
4. **Write ONE compact scratch file** `scratch/meanings-NNN.txt` with `write_to_file`:
   ```
   1: Meaning text on one line — no "> " prefix, no manual wrapping.
   17-18: Grouped meaning; the key must match the verse block (first-last).
   Patha-1: Meaning for a variant verse.
   @Geography | Kauraja (Mountain) - [Sundara Kanda, Sarga 35, Verse 81, Referenced]
   @Jewelry-Clothing | ...
   ```
   - One entry per `=== meaning ===` placeholder. A block's key is its first and last verse number.
   - `@<LogFile> | <entry>` lines append to `qa-review/<LogFile>` (must already exist).
5. **Run** `node inject-meanings.js NNN` (add `--kanda <dir>` outside Sundara Kāṇḍa; `--dry` to preview). The script:
   - fills placeholders **in place** — śloka text and sandhi edits are never touched;
   - adds the bold `Meaning N:` label, `> ` prefixes, and ~80-char wrapping;
   - prints a one-line report and deletes the scratch file on full success.
6. **If the report shows missing/unused entries**, fix only those lines in the scratch file and re-run. Do not re-read the whole sarga.
7. **Never** use `multi_replace_file_content` for bulk meaning insertion, and never rebuild the sarga from `source/`.
8. **Final reply:** a short list of items needing user review (doubtful readings, glossary additions) — no recap of the meanings.
