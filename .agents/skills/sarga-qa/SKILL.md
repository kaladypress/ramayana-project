---
name: sarga-qa
description: Interactive QA and reader-clarity review for translated Rāmāyaṇa sargas. Use when the user is reviewing, editing, grouping, or refining meanings in qa-review/<kanda>/sarga-NNN.txt.
---

# Sarga QA Review Skill

Use this skill during interactive sarga-by-sarga QA review. It complements `translation-guidelines.md` without bloating always-on context.

## Core Principles

1. **Interpret User Notes by Context & Align with the Śloka**
   - Treat brief user notes (e.g., `"upasamharam"`, `"kanapadakunda"`, `"change X"`) as **semantic intent** or source clarifications—never copy-paste the user's raw note or untranslated term into the English unless it truly belongs there.
   - When the user asks a question or asks for options, **always give a clear recommendation**, and make sure every suggestion stays faithful to what is actually in the śloka—never silently inject commentary-only expansions into the meaning (flag them separately if relevant).
   - Choose phrasing a general English reader will immediately understand.

2. **Reader-Perspective Check on Every Edit**
   - Before finalizing any edited or combined meaning, read it as a first-time reader who does not know the Sanskrit:
     - **No sentence fragments:** Ensure each meaning block reads cleanly (either a complete sentence or a clearly punctuated continuation).
     - **Unambiguous subjects & epithets:** Disambiguate `Kākutstha` when both Rāma and Lakṣmaṇa are present; use `Viśvāmitra` instead of generic `"that brāhmaṇa"`/`"brāhmaṇa"` when addressing or referring to him; use active subjects instead of vague passives (`"until Viśvāmitra awakened him"`, not `"until he was awakened"`).
     - **Clarify metaphorical/personified terms:** Make implicit categories explicit where needed (e.g., `"the divine astras known as the sons of Kr̥śāśva"`).
     - **Vocative placement & density:** Place vocatives (`Rāma`, `Kākutstha`, `Raghunandana`, `king`, etc.) at the **start** of the sentence rather than wedging them mid-sentence or tacking them onto the end. If a verse has two vocatives to the same listener (e.g., `rāma` + `vīra`, or `manujādhipa` + `rājan`), keep one clean opening address. Never use bare mid-sentence `", hero,"` or `"tiger among men"` (use `"greatest of men"` / `"foremost of men"`).
     - **Natural spoken/narrative English:** Replace stiff literalisms (`"shape-shifting"` → `"able to take any form at will"`, `"demonstrated"` → `"showed"`, `"hosts"` → `"ranks"`/`"assemblies"`).
     - **Zero em-dashes (`—`):** Never use em-dashes in meaning blocks. Replace paired appositive dashes with commas or relative clauses, list dashes with colons or direct objects, clause-joining dashes with periods/semicolons/conjunctions, and left-dislocated `"X, Y, Z — he did it all"` sentences with natural Subject–Verb–Object order.

3. **Grouping & List Cleanup**
   - Group verses that share one grammatical sentence, a single continuous speech, or a tightly linked list (e.g., accusative names governed by one verb).
   - **Never just stitch** existing per-verse meanings when combining—do a fresh pass for flow.
   - In long enumerations, drop literal dual/filler words (`"these two—"`, `"both"`) and move mid-list vocatives (`", Rāghava;"`) so they don't look like list items.

4. **Repetition & Formatting**
   - Check the edited verse and its neighbors for repeated words (`"illustrious"` in consecutive verses, `"mighty-armed ... mighty"`, `"the sage ... the sage"`).
   - Keep every blockquote line prefixed with `> ` and wrapped to ~80 characters.
