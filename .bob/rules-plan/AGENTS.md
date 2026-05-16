# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Multi-Mode Pipeline Architecture

Verdict uses a **strict sequential pipeline** with 6 modes. Each mode MUST:

1. Accept structured JSON input from the previous layer
2. Process data according to its specific role
3. Output structured JSON for the next layer
4. Use snake_case for all JSON keys

**CRITICAL**: Cannot skip layers. Each mode depends on the previous mode's output structure.

## Pipeline Flow

```
semantic → blast → mutation → incident → questions → synthesis
```

Each arrow represents a JSON handoff with specific schema requirements.

## Cross-Layer Matching Algorithm

The incident and synthesis modes perform cross-layer matching:

1. **Input**: Surviving mutations from mutation layer (file path + line range)
2. **Search**: Past incidents from INCIDENTS.md and git log (file path + line range)
3. **Match criteria**: Same file path AND line ranges overlap within ±5 lines
4. **Output**: Matched pairs with overlap percentage

**Example**:
- Mutation: `src/auth.py` lines 45-67
- Incident: `src/auth.py` lines 42-70
- Result: MATCH (overlap: 22 lines, 95%)

## Blast Radius Constraints

The blast mode MUST search the **FULL repository**, not just changed files:

- **Wrong**: Search only files in the PR diff
- **Right**: Search entire codebase for similar patterns
- **Why**: Finds hidden dependencies and similar code that might break

**Example**: If PR changes `calculateDiscount()` in `checkout.py`, blast must find ALL files with similar discount calculation logic, even if they're not in the PR.

## Semantic Diff Filtering

The semantic mode MUST ignore non-functional changes:

- **Ignore**: Whitespace, indentation, blank lines
- **Ignore**: Code formatting (line breaks, spacing)
- **Ignore**: Comments and docstrings
- **Ignore**: Variable/function renames without logic changes
- **Detect**: Logic changes, control flow changes, API contract changes

**Example**: Renaming `user_id` to `userId` is NOT a semantic change. Changing `if user.is_admin` to `if user.is_admin or user.is_moderator` IS a semantic change.

## No Style Comments Rule

Synthesis mode MUST NOT generate comments about:

- Code formatting (indentation, line length, spacing)
- Naming conventions (camelCase vs snake_case)
- Whitespace (trailing spaces, blank lines)
- Comment style (single-line vs multi-line)

**Only comment on**: Security risks, business logic risks, incident patterns, mutation survival.

## JSON Schema Requirements

Each layer outputs JSON with these required fields:

```json
{
  "mode_name": "semantic",
  "timestamp": "2026-05-16T20:45:00Z",
  "findings": [
    {
      "file_path": "src/auth.py",
      "line_range": [45, 67],
      "change_type": "modification",
      "severity": "HIGH"
    }
  ],
  "next_mode_input": {
    "semantic_changes": [...],
    "metadata": {...}
  }
}
```

**Required fields**:
- `mode_name`: Current mode identifier (string)
- `timestamp`: ISO 8601 UTC timestamp (string)
- `findings`: Array of mode-specific results (array)
- `next_mode_input`: Data structure for next layer (object)

## Output Constraints

Synthesis mode has strict output rules:

- **TL;DR**: Exactly 3 sentences (no more, no less)
- **Questions**: Exactly 3 questions (no more, no less)
- **Max length**: 600 words total
- **Comments**: ONE comment per PR analysis
- **Format**: Markdown with clear sections

## The "Killer Line" Rule

When cross-layer matching finds a mutation targeting the same file and line range (±5 lines) as a past incident, the synthesis TL;DR **MUST** start with:

```
"Surviving mutation [ID] is the same code path that caused [INC-ID]"
```

This is the highest-priority output. No other finding takes precedence.

## Mutation Severity Assignment

Mutations are assigned severity based on code domain:

- **CRITICAL**: Authentication, payment processing, security controls, data encryption, access control
- **HIGH**: Business logic, state management, API contracts, database transactions, data validation
- **LOW**: Edge cases, error messages, logging, validation messages, UI text

**Assignment rules**:
1. If mutation affects multiple domains, use highest severity
2. If domain is unclear, default to HIGH
3. Never assign CRITICAL without clear security/payment/auth impact

## Incident Mining Patterns

The incident mode searches git history for these commit patterns:

- `fix:` - Bug fixes (may indicate past issues)
- `hotfix:` - Emergency fixes (high-priority incidents)
- `revert:` - Reverted changes (failed deployments)
- `rollback:` - Rolled back deployments (production incidents)
- `INC-` - Incident ticket references (e.g., INC-2024-001)

**Search scope**: Entire git history, not just recent commits.

## Naming Conventions

- **Modes/Skills**: kebab-case (e.g., `semantic-diff`, `blast-radius`)
- **JSON keys**: snake_case (e.g., `mode_name`, `next_mode_input`, `file_path`)
- **Documentation**: UPPERCASE.md (e.g., `AGENTS.md`, `SKILL.md`)
- **Configuration**: lowercase.yaml (e.g., `custom_modes.yaml`)