# The Killer Line

> **"Surviving mutation M-1 is the same code path that caused INC-2024-0431"**

This single sentence is the originality of Verdict. It's a cross-temporal insight that connects **what's changing now** (a surviving mutation in this PR) to **what broke before** (a past incident at the same location).

## Why No Other Tool Can Produce This

Traditional PR review tools are **diff-bound**. They see:
- Lines added
- Lines removed  
- Lines modified

Even with infinite context windows, they cannot:

1. **Mine git history** for incident patterns (`fix:`, `hotfix:`, `revert:`, `rollback:`, `INC-`)
2. **Run mutation testing** to find which test gaps survive in the changed code
3. **Match mutations to incidents** by file path + line proximity

Verdict does all three, then fires the killer line when a match exists.

## The Algorithm

**Layer 3 (Mutation)** produces:
```json
{
  "survivors": [
    {
      "id": "M-1",
      "file": "auth/tokens.py",
      "line": 13,
      "severity": "CRITICAL"
    }
  ]
}
```

**Layer 4 (Incident)** produces:
```json
{
  "incidents": [
    {
      "id": "INC-2024-0431",
      "files": ["auth/tokens.py"],
      "lines": [13],
      "summary": "Race condition in token verification"
    }
  ]
}
```

**Layer 6 (Synthesis)** calls the `find_cross_layer_match` MCP tool:
```python
match = find_cross_layer_match(mutations, incidents)
# Returns: {
#   "mutation_id": "M-1",
#   "incident_id": "INC-2024-0431",
#   "line_distance": 0,
#   "killer_line": "Surviving mutation M-1 is the same code path that caused INC-2024-0431"
# }
```

**Matching criteria**: Same file AND line distance ≤ 5.

When a match exists, the synthesis comment TL;DR **must** start with the killer line. This is enforced by Bob's custom rules.

## Why This Matters

A reviewer reading this line immediately knows:
1. **This PR touches dangerous code** — code that has caused production incidents before
2. **The test suite still has gaps** — the same vulnerability that caused the incident is not covered by tests
3. **History is repeating** — without intervention, this PR may cause the same incident again

No amount of static analysis, linting, or diff review can surface this insight. It requires:
- **Temporal analysis** (git history mining)
- **Dynamic analysis** (mutation testing)
- **Cross-layer synthesis** (matching mutations to incidents)

## The IBM Bob Integration

The killer line exists because of three Bob capabilities:

1. **MCP tools** — The `find_cross_layer_match` tool is a custom MCP server Bob calls during synthesis
2. **Custom modes** — The 6-layer pipeline is implemented as 6 Bob modes with structured JSON output
3. **Custom rules** — Bob enforces that the killer line appears when a match exists (see `.bob/rules/verdict-global.md`)

Take Bob out, there's no cross-layer matching. Take Bob out, there's no killer line. Take Bob out, there's no Verdict.

## Live Example

See [demo/hero-pr-result.md](demo/hero-pr-result.md) for the full synthesis comment that includes the killer line. The analysis was performed on [this PR](https://github.com/Yashash4/fastapi-tokenauth/pull/1).

The killer line appears as sentence 1 of the TL;DR, followed by the verdict (`🔴 DO NOT MERGE`) and detailed analysis across all 6 layers.