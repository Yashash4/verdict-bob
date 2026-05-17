# Bob Sessions Index

> "Bob planned it. Bob built it. Bob runs it."

Every session below is an exported Bob task history showing meaningful Bob usage in Verdict.

## Sessions

| Session | Bob Feature Used | What it proves |
|---------|----------------|----------------|
| 00-planning | Plan mode | Bob architected Verdict before we wrote code |
| 01-init | /init slash command | Bob generated AGENTS.md for the project |
| 02-mcp-server | Code mode + Advanced mode | Bob built verdict-tools MCP server (3 tools), pipeline harness, CLI, and MCP config |
| 03-harness-hardening | Code mode | Bob hardened the pipeline — robust JSON parsing, deterministic cross-layer matching, retry logic |
| 04-live-analysis | Orchestrator mode + /verdict slash command + 6 custom modes + 3 MCP tools | Full pipeline end-to-end on a real PR. Cross-layer match found via find_cross_layer_match MCP tool. Killer line fires: "Surviving mutation M-1 is the same code path that caused INC-2024-0431" |
| 05-docs | Code mode | Bob wrote README, KILLER_LINE.md, LICENSE, and saved the demo synthesis output |

## The Narrative

This project demonstrates Bob at three levels:
1. **Bob planned Verdict** — see 00-planning/
2. **Bob built Verdict** — see all build sessions above
3. **Bob runs Verdict** — Verdict's 6 custom modes ARE Bob running analysis

"CodeRabbit reviews the diff. Verdict reviews the decision."
