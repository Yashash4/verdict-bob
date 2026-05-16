---
name: blast-radius
description: Map all code across the full repo that depends on modified symbols
---

For each modified function, class, or variable in the PR:

1. Search the FULL repository for all usages using @file references
2. For each caller: check whether it was updated in the PR (✓) or not (⚠)
3. Check for downstream service dependencies
4. Check for database schema consumers (anything that reads/writes changed tables)
5. Check for feature flags that gate this code path

Output JSON:
{
  "direct_callers": [
    {"file": "path/to/file.py", "line": 42, "function": "caller_name", "updated_in_pr": false}
  ],
  "schema_changes": ["description of any schema impact"],
  "feature_flags": ["flag_name"],
  "cross_repo_risk": "none|possible|confirmed",
  "unannotated_callers": ["callers NOT updated in this PR — these are the risk"]
}
