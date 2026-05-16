# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Code Mode Constraints

**IMPORTANT**: Code mode does NOT have access to MCP or Browser tools. Use Advanced mode for MCP tool operations.

## Editing Mode Definitions

Mode definitions are stored in `.bob/custom_modes.yaml`. Each mode follows this YAML structure:

```yaml
- slug: mode-name
  name: Display Name
  groups: [read, mcp]  # Tool access groups
  roleDefinition: |
    You are an expert in [domain].
    Your role is to [specific responsibility].
  whenToUse: |
    Use this mode when [specific trigger conditions].
  customInstructions: |
    [Detailed step-by-step instructions]
    [Output format requirements]
    [Constraints and rules]
```

**Key fields**:
- `slug`: kebab-case identifier (e.g., `semantic-diff`)
- `groups`: Array of tool access groups (`read`, `browser`, `mcp`)
- `roleDefinition`: Agent's identity and core responsibility
- `whenToUse`: Trigger conditions for mode activation
- `customInstructions`: Detailed operational instructions

## Creating Skills

Skills are stored in `.bob/skills/{skill-name}/SKILL.md` with YAML frontmatter:

```markdown
---
name: Skill Name
description: Brief description of what this skill does
version: 1.0.0
---

# Skill Implementation

Detailed instructions for executing this skill...

## Input Format

Expected input structure...

## Output Format

Expected output structure...

## Examples

Example usage...
```

**Skill naming**: Use kebab-case for directory names (e.g., `semantic-diff`, `blast-radius`).

## JSON Schema Requirements

All inter-mode communication uses structured JSON with **snake_case keys**:

```json
{
  "mode_name": "semantic",
  "timestamp": "2026-05-16T20:45:00Z",
  "findings": [
    {
      "file_path": "src/auth.py",
      "line_range": [45, 67],
      "change_type": "modification"
    }
  ],
  "next_mode_input": {
    "semantic_changes": [...]
  }
}
```

**Required fields**:
- `mode_name`: Current mode identifier
- `timestamp`: ISO 8601 UTC timestamp
- `findings`: Array of mode-specific results
- `next_mode_input`: Data structure for next pipeline layer

## Naming Conventions

- **Modes/Skills**: kebab-case (e.g., `semantic-diff`, `blast-radius`)
- **JSON keys**: snake_case (e.g., `mode_name`, `next_mode_input`, `file_path`)
- **Documentation files**: UPPERCASE.md (e.g., `AGENTS.md`, `SKILL.md`, `README.md`)
- **Configuration files**: lowercase.yaml (e.g., `custom_modes.yaml`, `config.yaml`)

## File Structure

```
.bob/
├── custom_modes.yaml          # Mode definitions
├── skills/
│   ├── semantic-diff/
│   │   └── SKILL.md          # Skill with YAML frontmatter
│   ├── blast-radius/
│   │   └── SKILL.md
│   └── ...
├── commands/
│   └── verdict.md            # Command definitions
└── rules/
    └── verdict-global.md     # Global rules
```

## Editing Workflow

1. **Modify modes**: Edit `.bob/custom_modes.yaml` directly
2. **Create skills**: Create new directory in `.bob/skills/` with `SKILL.md`
3. **Update commands**: Edit files in `.bob/commands/`
4. **Add rules**: Create/edit files in `.bob/rules/`

**No build step required** - changes take effect immediately when Bob reloads configuration.