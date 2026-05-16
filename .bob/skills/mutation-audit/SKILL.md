---
name: mutation-audit
description: Interpret mutmut mutation testing results and identify which survivors expose real test gaps
---

Given a mutmut survivors report, for each surviving mutation:

1. Classify the mutation type:
   - boundary: >= vs >, <= vs <, == vs !=
   - null_check: `if not x` vs `if x`
   - logic_inversion: True vs False, and vs or
   - removed_guard: entire condition removed
   - removed_lock: SELECT FOR UPDATE removed
   - return_change: different return value

2. Assess severity:
   - CRITICAL: auth, payment, data integrity, security paths
   - HIGH: core business logic
   - LOW: edge case, logging, non-critical path

3. Identify what test scenario is missing

Output JSON:
{
  "total_mutations": 0,
  "killed": 0,
  "survivors": [
    {
      "id": "M-12",
      "file": "auth/tokens.py",
      "line": 7,
      "type": "removed_lock",
      "severity": "CRITICAL",
      "description": "Missing SELECT FOR UPDATE — race condition not tested",
      "missing_test": "Concurrent revocation test"
    }
  ],
  "kill_rate": 0.0,
  "critical_survivors": ["list of CRITICAL severity mutation IDs"]
}
