# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Structure

This is a Bob AI configuration project for the "Verdict" PR analysis system. The `.bob/` directory contains:

- **custom_modes.yaml** - Defines 6 sequential modes for PR analysis
- **skills/** - 5 skill definitions for semantic diff, blast radius, mutation testing, incident mining, and synthesis
- **commands/verdict.md** - Main command that orchestrates the pipeline
- **rules/verdict-global.md** - Global rules applied across all modes

## Verdict Pipeline Overview

Verdict uses a **6-mode sequential pipeline** where each mode outputs JSON for the next:

1. **semantic** - Identifies meaningful code changes (ignores whitespace, formatting, comments, renames)
2. **blast** - Searches FULL repository for similar code patterns (not just changed files)
3. **mutation** - Analyzes surviving mutations and assigns severity
4. **incident** - Mines past incidents from INCIDENTS.md and git log
5. **questions** - Generates exactly 3 specific risk questions
6. **synthesis** - Produces ONE final comment with TL;DR and questions

**Key constraint**: Cannot skip layers. Each mode depends on the previous mode's output.

## Key Files to Reference

When explaining the system, reference these files:

- **@.bob/custom_modes.yaml** - Mode definitions with roleDefinition, whenToUse, customInstructions
- **@.bob/skills/semantic-diff/SKILL.md** - Semantic change detection logic
- **@.bob/skills/blast-radius/SKILL.md** - Repository-wide pattern matching
- **@.bob/skills/mutation-audit/SKILL.md** - Mutation analysis and severity assignment
- **@.bob/skills/incident-mining/SKILL.md** - Historical incident detection
- **@.bob/skills/pr-synthesis/SKILL.md** - Final comment generation
- **@.bob/commands/verdict.md** - Pipeline orchestration command
- **@.bob/rules/verdict-global.md** - Global output constraints

## Incident Data Sources

The incident mode mines data from two sources:

1. **INCIDENTS.md** in target repository - Structured incident log with file paths and line ranges
2. **Git log patterns** - Commits matching:
   - `fix:` - Bug fixes
   - `hotfix:` - Emergency fixes
   - `revert:` - Reverted changes
   - `rollback:` - Rolled back deployments
   - `INC-` - Incident ticket references (e.g., INC-2024-001)

## Mutation Severity Levels

Mutations are assigned severity based on code domain:

- **CRITICAL** - Authentication, payment processing, security controls, data encryption
- **HIGH** - Business logic, state management, API contracts, database transactions
- **LOW** - Edge cases, error messages, logging, validation messages

## The "Killer Line" Rule

When a surviving mutation targets the **same file and line range** (±5 lines) as a past incident, the synthesis comment TL;DR **MUST** start with:

```
"Surviving mutation [ID] is the same code path that caused [INC-ID]"
```

This cross-temporal analysis is Verdict's highest-value output.

## Output Constraints

Synthesis mode follows strict rules:

- **TL;DR**: Exactly 3 sentences
- **Questions**: Exactly 3 questions (no more, no less)
- **Max length**: 600 words total
- **Comments**: ONE comment per PR analysis
- **No style feedback**: No formatting, naming, or whitespace comments
- **No "have you considered"**: Only specific risk questions

## JSON Communication Format

All inter-mode communication uses structured JSON with snake_case keys:

```json
{
  "mode_name": "semantic",
  "timestamp": "2026-05-16T20:45:00Z",
  "findings": [...],
  "next_mode_input": {...}
}
```

## Naming Conventions

- **Modes/Skills**: kebab-case (e.g., `semantic-diff`, `blast-radius`)
- **JSON keys**: snake_case (e.g., `mode_name`, `next_mode_input`)
- **Documentation**: UPPERCASE.md (e.g., `AGENTS.md`, `SKILL.md`)
- **Configuration**: lowercase.yaml (e.g., `custom_modes.yaml`)