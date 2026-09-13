# Translation Guidelines for Rāmāyaṇa Project

These rules apply whenever generating, editing, or reviewing English meanings/translations for ślokas.

## Terminology Rules

### Forbidden Terms & Replacements

| ❌ Do NOT use | ✅ Use instead |
|---|---|
| monkey / monkeys | Hanumān, Kapīśreṣṭha, Vānara(s), Plavaṅgama, or the specific epithet from the śloka |
| lord | god, goddess, or preferably devathā(s) / devatā(s) |

### Character Names & Epithets

- Always prefer using the **Sanskrit name or epithet** found in the śloka when referring to characters.
- For Hanumān specifically, use the epithet present in the verse (e.g., Kapikuñjara, Mārutātmaja, Vāyunandana, Anilaātmaja, Pavanaputra, etc.) or simply "Hanumān."
- When a new epithet or name appears for Hanumān or any other character, **add it to the glossary** (`qa-review/glossary-terms`) with its meaning and context.

### General Style

- Maintain reverence and dignity in the translation — this is sacred literature.
- Use transliterated Sanskrit terms (ISO-15919) where they convey meaning better than English equivalents.
- When grouping meanings for multiple ślokas, do so within a Markdown blockquote. Prefix each line with `>` and start the block with bold text indicating the ślokas covered. For example:
  `> **Meaning 52-56:** ...`
  `> ...continuation of translation...`
- Wrap meaning lines to ~80 characters for readability, ensuring every wrapped line starts with `> `.
- **Variant Readings (Pāṭhāntara):** If there are extra verses or variant readings present in the Gorakhpur text but absent in others, label them sequentially as `Patha-1.`, `Patha-2.`, etc., rather than standard numbered ślokas. Their meanings should be prefixed similarly (e.g., "Patha-1: ...").
- **Definitive Source:** The primary source for translation verification, verse numbering, and inclusion/omission of specific ślokas is the **Gorakhpur (Gita Press) Telugu edition**. Be aware that this may contain variant readings (pāṭha-bhedas) or extra verses compared to other editions.
- **NEVER use web search or external sources to find translations.** Always generate the translations and meanings using internal intelligence, knowledge of the Rāmāyaṇa, and Sanskrit proficiency.
- **Context Loading:** Before generating translations for a new sarga, always use the `view_file` tool to read the previous 1-2 completed sargas (including their meanings). This ensures the tone, rhythm, and narrative continuity remain perfectly consistent.

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
