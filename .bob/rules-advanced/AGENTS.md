# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Advanced Mode Capabilities

**IMPORTANT**: Advanced mode HAS access to MCP and Browser tools. Use this mode for operations requiring external tool integration.

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

## MCP Tool Usage Patterns

Verdict relies on external MCP tools for cross-layer analysis:

### find_cross_layer_match

Matches surviving mutations to past incidents by file path and line range overlap (±5 lines):

```json
{
  "mutation": {
    "id": "MUT-001",
    "file_path": "src/auth.py",
    "line_range": [45, 67]
  },
  "incidents": [
    {
      "id": "INC-2024-001",
      "file_path": "src/auth.py",
      "line_range": [42, 70]
    }
  ]
}
```

**Returns**: Array of matches with overlap percentage and incident details.

### find_incident_commits

Mines git history for incident-related commits using patterns:

- `fix:` - Bug fixes
- `hotfix:` - Emergency fixes
- `revert:` - Reverted changes
- `rollback:` - Rolled back deployments
- `INC-` - Incident ticket references

**Returns**: Array of commits with file paths, line ranges, and incident IDs.

## Creating Skills with MCP Tools

Skills in `.bob/skills/{skill-name}/SKILL.md` can reference MCP tools:

```markdown
---
name: Cross-Layer Matcher
description: Matches mutations to incidents using MCP tools
version: 1.0.0
---

# Implementation

1. Parse mutation findings from previous layer
2. Call `find_cross_layer_match` with mutation data
3. Filter matches with >50% line overlap
4. Format results for synthesis layer

## MCP Tool Call Example

```json
{
  "tool": "find_cross_layer_match",
  "params": {
    "mutations": [...],
    "incidents": [...]
  }
}
```
```

## JSON Schema Requirements

All inter-mode communication uses structured JSON with **snake_case keys**:

```json
{
  "mode_name": "incident",
  "timestamp": "2026-05-16T20:45:00Z",
  "findings": [
    {
      "incident_id": "INC-2024-001",
      "file_path": "src/auth.py",
      "line_range": [42, 70],
      "commit_sha": "abc123"
    }
  ],
  "next_mode_input": {
    "incidents": [...],
    "mutations": [...]
  }
}
```

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