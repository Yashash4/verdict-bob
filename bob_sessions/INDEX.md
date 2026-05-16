# Bob Sessions Index

> "Bob planned it. Bob built it. Bob runs it."

Every session below is an exported Bob task history showing meaningful Bob usage in Verdict.

## Account A Sessions

| Session | Bob Feature Used | What it proves |
|---------|----------------|----------------|
| 00-planning | Plan mode | Bob architected Verdict before we wrote code |
| 01-init | /init slash command | Bob generated AGENTS.md for the project |
| 02-mcp-server | Code mode + Advanced mode | Bob built verdict-tools MCP server (3 tools), pipeline harness, CLI, and MCP config |
| 03-harness-hardening | Code mode | Bob hardened the pipeline — robust JSON parsing, deterministic cross-layer matching, retry logic |
| 04-live-analysis | Custom modes (all 6) | Bob ran full 6-layer analysis on a real PR and produced the killer line |
| 05-self-review | /review slash command | Bob reviewed Verdict's own codebase |

## Account B Sessions

| Session | Bob Feature Used | What it proves |
|---------|----------------|----------------|
| 00-spike | Bob Shell headless (`bob -p`) | Verified non-interactive Bob execution |
| 01-mcp-server | Code mode + Advanced mode | Bob wrote the MCP server with 3 tools |
| 02-layer2-build | Plan mode + blast-radius skill | Bob maps callers across the full repo |
| 03-layer3-build | Code mode + mutation-audit skill | Bob interprets mutation testing results |

## Account C Sessions

| Session | Bob Feature Used | What it proves |
|---------|----------------|----------------|
| 00-dashboard | Code mode | Bob built the Next.js dashboard |
| 01-pipeline | Code mode | Bob wrote the orchestration harness |
| 02-demo-prep | Advanced mode | Bob helped prepare demo scenarios |

## The Narrative

This project demonstrates Bob at three levels:
1. **Bob planned Verdict** — see account-a/00-planning/
2. **Bob built Verdict** — see all build sessions above
3. **Bob runs Verdict** — Verdict's 6 custom modes ARE Bob running analysis

"CodeRabbit reviews the diff. Verdict reviews the decision."
