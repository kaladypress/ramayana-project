# Śloka Validation & Quality Assurance Framework
**Kalady Press — High-End Publication Standard**

This document establishes the four-layer verification protocol for guaranteeing textual integrity, metrical correctness, and transliteration fidelity for the Valmiki Rāmāyaṇa KDP edition in the absence of an in-house Sanskrit scholar.

---

## Governing Principle

> **Authority resides in the Gorakhpur (Gita Press) Telugu physical edition; accuracy is enforced through multi-source collation, algorithmic metrical validation, and targeted human verification.**

---

## The 4 Layers of Textual Validation

```
┌────────────────────────────────────────────────────────┐
│  Raw Digital Source (IIT Kanpur / Valmikiramayan.net)   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  Layer 1: Multi-Source Digital Collation               │
│  - Automated diff against independent digital edition  │
│  - Identifies typos, dropouts, and pāṭha-bhedas        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  Layer 2: Structural & Metrical (Chandas) Engine       │
│  - Akṣara count check (32 syllables per Anuṣṭubh)     │
│  - Laghu/Guru cadence check (Pathyā / Vipulā)          │
│  - ISO-15919 character-set & parasavarṇa audit        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  Layer 3: Deterministic Round-Trip Transliteration     │
│  - ISO-15919 ➔ Devanagari/Telugu ➔ Character Diff     │
│  - Detects converter mapping bugs & vowel truncation   │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│  Layer 4: Targeted Verification with Physical Book     │
│  - 100% of verses flagged by Layers 1–3 inspected     │
│  - 5–10% random baseline spot-check per sarga          │
│  - Definitive tie-breaker: Gorakhpur Telugu Edition    │
└────────────────────────────────────────────────────────┘
```

---

### Layer 1: Recension-Aware Multi-Source Digital Collation
**Objective:** Eliminate transcription glitches, OCR anomalies, and dropped words by comparing the working text (Gorakhpur tradition) against secondary digital archives (e.g., Baroda Critical Edition from IIT Bombay / GRETIL / Muktabodha).

1. **Handling Recension Differences (Gorakhpur vs. Baroda):**
   - The Gorakhpur (Gita Press) tradition represents the widely revered Vulgate recension (e.g., Sundara Kāṇḍa has 68 sargas), whereas academic critical editions (Baroda) represent a pruned manuscript consensus (66 sargas). Sarga boundaries and verse numbers often shift or diverge.
   - The collation engine operates on a **content-alignment algorithm** (normalizing sandhi variations, punctuation, and whitespace) rather than assuming a rigid 1:1 verse index.

2. **Automated Alignment with Manual Sarga Overrides:**
   - **Auto-Alignment:** Verses are matched dynamically using fuzzy string similarity across surrounding verse windows.
   - **Manual Sarga/Verse Parameter Overrides:** For sargas where boundaries diverge significantly, the validation script accepts explicit configuration mappings (e.g., `Gorakhpur Sarga 5 verses 1–60 ➔ Baroda Sarga 3`).

3. **Four Classification Outcomes per Verse:**
   - **Exact Match:** The verse text matches the secondary digital text cleanly (ignoring superficial sandhi/spacing differences). Passed with high confidence.
   - **Near Match (Divergence / Typo):** Pādas match closely but exhibit character/word discrepancies. Flagged with a character-level diff to distinguish genuine *pāṭha-bhedas* from transcription typos.
   - **Gorakhpur-Only (Interpolation / Additional Verse):** The verse exists in the Gorakhpur tradition but was excluded from the critical edition. Automatically bypassed by Layer 1 and routed directly to **Layer 2 (Chandas Engine)** and **Layer 4 (Physical Book Inspection)**.
   - **Baroda-Only:** Verses present in Baroda but absent in Gorakhpur. Recorded as informational only.

4. **Audit Log:**
   - All near matches, discrepancies, and Gorakhpur-only verses are logged per sarga in `qa-review/<kanda>/collation-discrepancies.log`.

---

### Layer 2: Structural & Metrical (Chandas) Engine
**Objective:** Catch missing or extra characters, broken sandhi, and corrupted lines using the mathematical rules of Sanskrit metre.

1. **Anuṣṭubh (Śloka) Syllable Validation:**
   - Standard anuṣṭubh consists of 4 pādas of 8 syllables (akṣaras) each (total 32 syllables per verse).
   - The script scans every pāda:
     - If syllable count $\neq 8$, the pāda is flagged (unless marked as an irregular epic arsha meter or variant).
2. **Metrical Cadence (Laghu/Guru) Verification:**
   - For regular Anuṣṭubh verses, inspect key positions:
     - Pādas 2 & 4 (even pādas): 5th–7th syllables must adhere to the *Pathyā* cadence: `~ - ~` (Laghu, Guru, Laghu).
     - Pādas 1 & 3 (odd pādas): must not use prohibited cadences (e.g., avoid `~ - ~` in odd pādas).
3. **Sarga-Ending Metres:**
   - Sarga-final verses in classical metres (Upajāti, Indravajrā, Vaṁśastha, Puṣpitāgrā, etc.) are validated against their dedicated chandas schemes (11, 12, or variable syllables per pāda).
4. **ISO-15919 & Typographical Integrity:**
   - Validate character whitelist: only authorized ISO-15919 Latin characters with diacritics are permitted (`ā, ī, ū, ṛ, ṝ, ḷ, ḹ, ē, ō, ṁ, ḥ, ṅ, ñ, ṭ, ḍ, ṇ, ś, ṣ`).
   - Parasavarṇa / Anusvāra rule audit: Ensure anusvāra before stops follows the Kalady Press standard (`ṁ`).
   - Punctuation check: Verify correct placement of single danda `|` and double danda `||`.

---

### Layer 3: Deterministic Round-Trip Transliteration Test
**Objective:** Ensure transliteration scripts did not drop vowels, misplace virāmas, or garble conjunct consonants.

1. **Round-Trip Conversion:**
   - Convert the generated ISO-15919 text back into Devanagari / Telugu using an independent deterministic transliteration engine (e.g., Sanscript / Aksharamukha core tables).
2. **Character-Level Diff:**
   - Compare the round-tripped script against the raw input source.
   - Any divergence flags an encoding or script conversion flaw, ensuring zero algorithmic distortion.

---

### Layer 4: Targeted Verification Against Physical Telugu Edition
**Objective:** Provide absolute ground-truth verification using human inspection of the primary print edition.

1. **Targeted Review (100% of Flagged Verses):**
   - Any verse flagged by Layer 1 (source conflict), Layer 2 (metre/syllable anomaly), or Layer 3 (round-trip error) is manually checked in the Gorakhpur (Gita Press) Telugu physical book.
2. **Random Systematic Spot-Checks:**
   - A random sample of 5% to 10% of unflagged verses in each sarga is verified against the physical print copy as a baseline control.
3. **Pāṭhāntara (Variant Readings & Extra Verses):**
   - Extra verses present in Gorakhpur but absent in online digital sources are inserted and numbered as `Patha-1`, `Patha-2`, etc.
   - Text follows the Gorakhpur Telugu edition wherever it differs from digital repositories.
4. **Resolution Documentation:**
   - Corrections are recorded in `qa-review/<kanda>/editorial-resolutions.md`.

---

## Verification Matrix Summary

| Layer | Validation Type | What It Catches | Inspection Level |
|---|---|---|---|
| **Layer 1** | Multi-Source Collation | Typographical errors, skipped words/lines, digital text anomalies | Automated (100%) |
| **Layer 2** | Chandas & Syntax Audit | Dropped/added letters, broken metre, invalid ISO characters | Automated (100%) |
| **Layer 3** | Round-Trip Test | Transliteration engine glitches, lost diacritics, ligature errors | Automated (100%) |
| **Layer 4** | Physical Source Check | Source conflicts, metrical irregularities, variant readings (pāṭha-bhedas) | Human (Flagged + 10% sample) |

---

## Front Matter Statement (For Publication)

To maintain absolute transparency and scholarly dignity in the published book, the Preface / Editorial Note will include the following attribution:

> *"The Sanskrit text presented in this volume has been prepared in accordance with the venerable Gorakhpur (Gita Press) tradition, collated across multiple authoritative critical recensions, and algorithmically verified for metrical and phonetic accuracy under strict ISO-15919 transliteration standards."*
