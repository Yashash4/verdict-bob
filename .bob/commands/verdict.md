---
description: Run full Verdict pre-merge analysis on a PR and post synthesis comment
argument-hint: <pr_url>
---
Using verdict-synthesis mode and pr-synthesis skill: run complete Verdict analysis on PR $1.

Steps:
1. Use verdict-semantic mode with semantic-diff skill to analyze what changed in meaning
2. Use verdict-blast mode with blast-radius skill to map all callers and dependents
3. Use verdict-mutation mode with mutation-audit skill to interpret surviving mutations
4. Use verdict-incident mode with incident-mining skill to find past incidents
5. Use verdict-questions mode to generate exactly 3 reviewer questions
6. Use verdict-synthesis mode with pr-synthesis skill to combine all outputs

CRITICAL in step 6: call find_cross_layer_match MCP tool. If mutations match incidents,
TL;DR MUST start with: "Surviving mutation [ID] is the same code path that caused [INC-ID]"

Output the final synthesis comment in GitHub-flavored markdown. One comment only.
