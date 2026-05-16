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
