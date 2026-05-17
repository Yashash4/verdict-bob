# Verdict

> **"Surviving mutation M-1 is the same code path that caused INC-2024-0431"**

CodeRabbit reviews the diff. Verdict reviews the decision.

## What This Is

Verdict is a PR review tool that connects **what's changing now** to **what broke before**. When a surviving mutation targets the same file and line range as a past incident, Verdict fires the "killer line" — a cross-temporal insight no diff-bound tool can produce.

**Live demo**: [Hero PR analysis result](demo/hero-pr-result.md) | [Target PR on GitHub](https://github.com/Yashash4/fastapi-tokenauth/pull/1)

## Why IBM Bob Is the Engine

Verdict isn't *built with* Bob — Verdict **is** Bob running analysis. Take Bob out, there's no product.

**Bob's role in Verdict:**

1. **Bob planned it** — [Session 00: Planning](bob_sessions/00-planning/) shows Bob architecting the 6-layer pipeline before any code existed
2. **Bob built it** — [Session 02: MCP Server](bob_sessions/02-mcp-server/) shows Bob writing the 3 MCP tools that power cross-layer matching
3. **Bob runs it** — Verdict's 6 custom modes ARE Bob executing analysis. The Python harness just calls `bob shell` sequentially.

**Bob feature surface area:**
- 6 custom modes (semantic, blast, mutation, incident, questions, synthesis)
- 5 skills (semantic-diff, blast-radius, mutation-audit, incident-mining, pr-synthesis)
- 2 slash commands (/verdict, /init)
- 3 MCP tools (find_cross_layer_match, find_incident_commits, get_git_history)
- Custom rules enforcing the killer line and verdict format

**Evidence**: [bob_sessions/INDEX.md](bob_sessions/INDEX.md) — every session is an exported Bob task history proving meaningful usage.

## The 6-Layer Pipeline

```
1. SEMANTIC    → What changed in meaning (not just lines)
2. BLAST       → What else depends on this change
3. MUTATION    → Which test gaps survive mutation testing
4. INCIDENT    → What broke here before (git log + INCIDENTS.md)
5. QUESTIONS   → 3 specific risk questions for reviewers
6. SYNTHESIS   → ONE comment with cross-layer insight
```

**The killer line fires when**: A surviving mutation (layer 3) targets the same file + line range (±5 lines) as a past incident (layer 4). The `find_cross_layer_match` MCP tool performs this matching.

## Why This Matters

Traditional PR review tools (CodeRabbit, Copilot Review, Sourcery) are **diff-bound** — they only see what changed in this PR. Even with infinite context windows, they cannot:

- Mine git history for incident patterns (`fix:`, `hotfix:`, `revert:`, `INC-`)
- Run mutation testing to find test gaps
- Match mutations to incidents by file + line proximity

Verdict does all three, then synthesizes the cross-layer insight into one comment.

## Project Structure

```
.bob/                          # Bob configuration
├── custom_modes.yaml          # 6 custom modes
├── skills/                    # 5 skills
├── commands/                  # /verdict slash command
└── mcp.json                   # MCP server config

packages/
├── mcp-server/server.py       # 3 MCP tools
└── harness/pipeline.py        # Python orchestrator

bob_sessions/                  # Exported task histories
└── 04-live-analysis/          # Hero session with killer line

demo/hero-pr-result.md         # Live synthesis output
```

## Running Verdict

```bash
# Install dependencies
pip install -r packages/mcp-server/requirements.txt

# Run full pipeline on a PR
python packages/harness/verdict_cli.py analyze <pr_url>

# Or use Bob's slash command
/verdict <pr_url>
```

## Hackathon Submission

**Event**: [IBM Bob Hackathon 2026](https://lablab.ai/event/ibm-bob-hackathon)  
**Submission deadline**: May 17, 2026 at 8:30 PM IST  
**Project repo**: [github.com/Yashash4/verdict-bob](https://github.com/Yashash4/verdict-bob)  
**Demo target**: [github.com/Yashash4/fastapi-tokenauth](https://github.com/Yashash4/fastapi-tokenauth)

## Deep Dive

Read [KILLER_LINE.md](KILLER_LINE.md) for a detailed explanation of the cross-layer matching algorithm and why no other tool can produce this insight.

## License

MIT License — see [LICENSE](LICENSE)