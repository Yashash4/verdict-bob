---
name: semantic-diff
description: Analyze PR diff for meaning changes not line changes — contracts, invariants, lifecycles
---

Compare PRE and POST versions of changed files.

Focus ONLY on semantic changes:
- Function signature changes
- Return type changes
- Error handling path changes
- Invariant changes (what was always true that is no longer true)
- Public vs implicit interface changes
- Database schema changes
- Lifecycle changes (when things happen, not just how)

Ignore completely:
- Whitespace and formatting
- Comment changes
- Variable renames that don't change behavior
- Code style changes

Output JSON:
{
  "invariants_changed": ["description of changed invariant"],
  "contracts_changed": ["new behavior callers must adapt to"],
  "broken_contracts": ["behavior callers depended on but changed"],
  "lifecycle_delta": "description or null",
  "risk_level": "low|medium|high",
  "risk_areas": ["file:function"]
}
