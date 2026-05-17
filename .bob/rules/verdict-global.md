# Verdict Project Rules

## The Killer Line (NEVER OMIT)
When a surviving mutation targets the same file and line range as a past incident,
the synthesis comment TL;DR MUST start with:
"Surviving mutation [ID] is the same code path that caused [INC-ID]"

This is the highest-value output Verdict produces. No diff-bound tool can produce this.

## Output Rules
- ONE synthesis comment per PR analysis. Never multiple comments.
- TL;DR must be exactly 3 sentences.
- Exactly 3 reviewer questions. No more, no less.
- No style comments (formatting, naming, whitespace).
- No "have you considered" questions — only specific risk questions.
- Maximum 600 words per comment.

## Bob Usage in This Project
- Always reference files with @path/to/file syntax
- Use structured JSON output between layers
- Each layer feeds the next — don't skip layers


## File Reference Rule
Only reference files that actually exist in the target repository being analyzed.
Before including any file path in any output (synthesis comment, intermediate JSON,
reviewer questions), verify the file exists using @file references or by reading
the filesystem. Never invent or hallucinate file names. If unsure, omit the file
reference rather than guessing.

## Verdict Line Rule
Every synthesis comment MUST include a "Verdict:" line on its own line, placed
immediately after the TL;DR and before any numbered section. The line must be
exactly one of these three strings, no variations:
- Verdict: ✅ LOOKS GOOD
- Verdict: ⚠️ REVIEW REQUIRED
- Verdict: 🔴 DO NOT MERGE

This is non-negotiable. Hackathon judges scan for this signal first when reading
the synthesis output. Omitting it makes the artifact look unfinished.
