---
name: pr-synthesis
description: Synthesize 5-layer PR analysis into one GitHub comment with cross-layer insight connecting mutations to incidents
---

## Input
Receive results from all 5 layers:
- semantic_diff (from semantic-diff skill)
- blast_radius (from blast-radius skill)
- mutation_audit (from mutation-audit skill)
- incident_lens (from incident-mining skill)
- questions (array of 3 strings)

## Cross-Layer Matching (CRITICAL — DO THIS FIRST)
Before writing the comment:
1. Take each item in mutation_audit.survivors
2. Compare its file and line against incident_lens.incidents[].files and lines
3. If file matches AND lines are within 5 of each other → CROSS-LAYER MATCH FOUND
4. A cross-layer match MUST be sentence 1 of TL;DR:
   "Surviving mutation [mutation.id] is the same code path that caused [incident.id]"

Call the find_cross_layer_match MCP tool with the mutations and incidents arrays.

## Output Format

```
PR VERDICT — [PR title]
──────────────────────────────────────────────────────
TL;DR: [3 sentences. Sentence 1 = killer line if match exists]
Verdict: [✅ LOOKS GOOD | ⚠️ REVIEW REQUIRED | 🔴 DO NOT MERGE]

1. SEMANTIC DIFF
[bullet points of meaning changes]

2. BLAST RADIUS
[callers with ✓ updated / ⚠️ not updated status]

3. TEST AUDIT
Mutations killed: X/Y | Survivors: Z
[notable survivors with severity]

4. HISTORY
[incidents found or "No prior incidents on this code path"]

5. THREE QUESTIONS
Q1. [most critical — must reference a specific finding]
Q2. [second question]
Q3. [third question]
```

## Hard Rules
- One comment only. Never more.
- TL;DR: exactly 3 sentences.
- Questions: exactly 3. No style questions.
- Maximum 600 words total.
- Never add inline nit comments.
