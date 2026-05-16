---
name: incident-mining
description: Find past production incidents involving the code paths being changed in this PR
---

Check these sources in order:

1. INCIDENTS.md in the repo root — parse all INC-YYYY-NNNN entries, extract:
   - Incident ID
   - Affected files and line numbers
   - Root cause summary
   - Date

2. Git log for commits touching the same files as the PR, filtering for:
   - Messages containing: fix:, hotfix:, revert:, rollback:, INC-
   - These indicate past problems in this code area

Use the find_incident_commits MCP tool with the list of changed files.

Output JSON:
{
  "incidents": [
    {
      "id": "INC-2024-0431",
      "date": "2024-10-15",
      "files": ["auth/tokens.py"],
      "lines": [7, 13],
      "summary": "verify_token() missing SELECT FOR UPDATE, race condition on concurrent revoke",
      "severity": "P1"
    }
  ],
  "revert_commits": [
    {"sha": "abc123", "message": "revert: INC-2024-0431 rollback", "date": "2024-10-16"}
  ],
  "risk_pattern": "first-time|recurring|known-bad-path"
}
