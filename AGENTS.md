# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project Type

This is a **Bob AI configuration project** for the "Verdict" PR analysis system. It contains custom modes, skills, commands, and rules, plus runtime components in `packages/`:

- **packages/mcp-server/server.py** - MCP server providing 3 tools:
  - `get_git_history` - Retrieves git commit history for a file
  - `find_incident_commits` - Mines INCIDENTS.md and git log for past incidents
  - `find_cross_layer_match` - Matches mutations to incidents by file/line overlap
- **packages/harness/pipeline.py** - Python orchestrator that calls Bob Shell sequentially for all 6 layers
- **packages/harness/verdict_cli.py** - CLI entry point with argparse interface

The `.bob/` directory contains Bob configuration (modes, skills, rules). The `packages/` directory contains executable Python code.

## Verdict Pipeline Architecture

Verdict uses a **6-mode sequential pipeline**. Each mode MUST execute in strict order:

1. **semantic** - Identifies meaningful code changes (ignores whitespace, formatting, comments, renames)
2. **blast** - Searches FULL repository for similar code patterns (not just changed files)
3. **mutation** - Analyzes surviving mutations and assigns severity (CRITICAL/HIGH/LOW)
4. **incident** - Mines past incidents from INCIDENTS.md and git log (fix:, hotfix:, revert:, rollback:, INC-)
5. **questions** - Generates exactly 3 specific risk questions for reviewers
6. **synthesis** - Produces ONE final comment with TL;DR and questions

**CRITICAL**: Cannot skip layers. Each mode outputs structured JSON for the next.

## The "Killer Line" Rule

When a surviving mutation targets the **same file and line range** (±5 lines) as a past incident, the synthesis comment TL;DR **MUST** start with:

```
"Surviving mutation [ID] is the same code path that caused [INC-ID]"
```

This is the highest-value output Verdict produces. No diff-bound tool can achieve this cross-temporal analysis.

## MCP Tool Dependencies

Verdict requires these **MCP tools**:

- `find_cross_layer_match` - Matches mutations to incidents by file/line overlap
- `find_incident_commits` - Mines git history for incident patterns
- `get_git_history` - Retrieves commit history for a file

These tools are provided by `packages/mcp-server/server.py` in this project. The MCP server is configured in `.bob/mcp.json`.

## JSON Output Format

All inter-mode communication uses structured JSON with snake_case keys:

```json
{
  "mode_name": "semantic",
  "timestamp": "2026-05-16T20:45:00Z",
  "findings": [...],
  "next_mode_input": {...}
}
```

## File Reference Syntax

Always use `@path/to/file` syntax when referencing files in prompts and outputs.

## Output Constraints

Synthesis mode MUST follow these rules:

- **TL;DR**: Exactly 3 sentences
- **Questions**: Exactly 3 questions (no more, no less)
- **Max length**: 600 words total
- **Comments**: ONE comment per PR analysis
- **No style feedback**: No formatting, naming, or whitespace comments
- **No "have you considered"**: Only specific risk questions

## Mode Group Permissions

Modes are grouped by tool access:

- **read group**: File system read-only (semantic, blast, mutation, incident, questions, synthesis)
- **browser group**: Web access (currently unused)
- **mcp group**: MCP tool access (incident, synthesis)

## Creating/Modifying Modes

Edit `.bob/custom_modes.yaml`:

```yaml
- slug: mode-name
  name: Display Name
  groups: [read, mcp]
  roleDefinition: |
    You are an expert in...
  whenToUse: |
    Use this mode when...
  customInstructions: |
    Specific instructions...
```

## Creating Skills

Create `.bob/skills/{skill-name}/SKILL.md` with YAML frontmatter:

```markdown
---
name: Skill Name
description: What this skill does
version: 1.0.0
---

# Skill Implementation

Instructions for the skill...
```

## Naming Conventions

- **Modes/Skills**: kebab-case (e.g., `semantic-diff`, `blast-radius`)
- **JSON keys**: snake_case (e.g., `mode_name`, `next_mode_input`)
- **Documentation**: UPPERCASE.md (e.g., `AGENTS.md`, `SKILL.md`)
- **Configuration**: lowercase.yaml (e.g., `custom_modes.yaml`)