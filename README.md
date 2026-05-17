<div align="center">

# Verdict

**A pre-merge review tool that refuses to let history repeat itself.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-verdict--bob.vercel.app-ff3b47?style=for-the-badge)](https://verdict-bob.vercel.app/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built on IBM Bob](https://img.shields.io/badge/Built%20on-IBM%20Bob-6a5fc1)](https://lablab.ai/event/ibm-bob-hackathon)
[![Hackathon 2026](https://img.shields.io/badge/IBM%20Bob%20Hackathon-2026-4ade80)](https://lablab.ai/event/ibm-bob-hackathon)
[![PRs: Verdict-reviewed](https://img.shields.io/badge/PRs-Verdict--reviewed-ff3b47)](demo/hero-pr-result.md)

[**Live Dashboard →**](https://verdict-bob.vercel.app/) · [**Run the Demo →**](https://verdict-bob.vercel.app/analyze) · [**Killer Line →**](KILLER_LINE.md) · [**Architecture →**](#architecture) · [**Sessions →**](bob_sessions/INDEX.md)

</div>

---

> ### **"Surviving mutation M-1 is the same code path that caused INC-2024-0431"**
>
> *— Verdict, refusing to merge PR #1 on a Friday afternoon*

That single sentence is what Verdict produces. No other PR review tool can. Here's why that matters.

---

## Table of contents

- [The problem](#the-problem)
- [What Verdict does](#what-verdict-does)
- [Architecture](#architecture)
- [The killer line, explained](#the-killer-line-explained)
- [Bob is the engine, not the IDE](#bob-is-the-engine-not-the-ide)
- [What Verdict catches that nobody else does](#what-verdict-catches-that-nobody-else-does)
- [Live demo](#live-demo)
- [Run Verdict locally](#run-verdict-locally)
- [Production deployment](#production-deployment)
- [Project structure](#project-structure)
- [Hackathon submission](#hackathon-submission)

---

## The problem

Every modern PR review tool — CodeRabbit, GitHub Copilot Review, Sourcery, PR-Agent, Greptile — reads the diff. They see what changed in this PR. They cannot see:

- Which **surviving mutations** in the modified file the test suite missed
- Which **past production incidents** touched these same lines
- The **collision** between the two timelines

That's where production incidents come from. Not from new ignorance, but from **organizational forgetting**. The team had an `INC-2024-0431` last quarter. Three months later, someone touches the same code path. They don't remember. Tests pass. The PR merges. The incident happens again.

> **Production incidents have a memory. Reviewers don't. Verdict does.**

---

## What Verdict does

Verdict reads three timelines simultaneously and triangulates risk:

1. **What's changing now** — the PR diff, semantic analysis, blast radius
2. **What the tests miss** — mutation testing with `mutmut`, classified by severity
3. **What broke before** — `INCIDENTS.md` + `git log` for `fix:`, `hotfix:`, `revert:`, `INC-` patterns

When the third timeline collides with the first two on the same file and line, Verdict fires *the killer line* — a cross-temporal one-sentence verdict that no diff-bound tool can produce.

**Tagline:** *CodeRabbit reviews the diff. Verdict reviews the decision.*

---

## Architecture

Verdict is a 6-layer Bob pipeline. Each layer is a custom Bob mode. Each layer emits structured JSON. The next layer reads it. A Python harness orchestrates the chain via Bob Shell. An MCP server provides deterministic tools — most importantly, the one that fires the killer line.

### The pipeline

```
                  ┌─────────────────────────────────────────────────────────────┐
                  │                                                             │
   PR diff  ─►  [01] semantic   ─►  what changed in meaning  (verdict-semantic) │
                                                                                │
                [02] blast       ─►  what depends on it      (verdict-blast)    │
                                                                                │
                [03] mutation    ─►  which tests are weak    (verdict-mutation) │  ──┐
                                                                                │    │
                [04] incident    ─►  what broke here before  (verdict-incident) │  ──┤──►  find_cross_layer_match
                                                                                │    │      (MCP tool — Python)
                [05] questions   ─►  3 reviewer questions    (verdict-questions)│    │
                                                                                │    ▼
                [06] synthesis   ─►  TL;DR + Verdict + ...   (verdict-synthesis)│  ◄─┘
                  │                                                             │
                  └─────────────────────────────────────────────────────────────┘
                                            │
                                            ▼
                              Killer Line + 🔴 DO NOT MERGE
```

### Layer detail

| # | Bob mode | Skill | What it does | Output |
|---|---|---|---|---|
| 01 | `verdict-semantic` | `semantic-diff` | Identifies meaningful code changes (contracts, invariants, lifecycle). Ignores whitespace, formatting, renames. | `findings[]` |
| 02 | `verdict-blast` | `blast-radius` | Searches the full repository for all callers of modified symbols. Marks each as updated-in-PR or not. | `findings[]` |
| 03 | `verdict-mutation` | `mutation-audit` | Classifies surviving mutations by type (`boundary`, `null_check`, `removed_lock`, ...) and severity (CRITICAL/HIGH/LOW). | `findings[]` |
| 04 | `verdict-incident` | `incident-mining` | Parses `INCIDENTS.md` + `git log` for incident patterns. Calls `find_incident_commits` MCP tool. | `findings[]` |
| 05 | `verdict-questions` | `pr-synthesis` | Generates exactly 3 specific risk questions. Each must reference a finding from prior layers. | `findings[3]` |
| 06 | `verdict-synthesis` | `pr-synthesis` | Calls `find_cross_layer_match` MCP tool. Writes the GitHub comment. **Killer line is non-negotiable when match exists.** | One GitHub comment |

### MCP tools

The `verdict-tools` MCP server (FastMCP, in `packages/mcp-server/server.py`) exposes three tools:

```python
get_git_history(file_path, since_days=90) -> list[Commit]
# Retrieves git commit history for a file.

find_incident_commits(file_paths) -> list[Incident]
# Mines INCIDENTS.md + git log for past incidents on these files.

find_cross_layer_match(mutations, incidents) -> list[Match]
# Joins mutations to incidents by file path + line distance (≤ 5 lines).
# THIS is where the killer line fires.
```

`find_cross_layer_match` is computed in **Python**, not by an LLM. The killer line cannot be hallucinated — it's a string returned by a deterministic function.

### Tech stack

| Layer | Technology |
|---|---|
| Bob runtime | IBM Bob IDE + Bob Shell (`bob --auth-method api-key -p ...`) |
| MCP server | Python 3 + FastMCP (`mcp[cli]`) |
| Pipeline harness | Python 3 — `subprocess` orchestrating Bob Shell |
| Mutation testing | `mutmut` (via `mutmut-mcp`) |
| Demo target repo | FastAPI + SQLAlchemy |
| Dashboard | Next.js 14 + TypeScript + Tailwind |
| Demo deploy | Vercel (frontend), GitHub (everything else) |

---

## The killer line, explained

> **"Surviving mutation M-1 is the same code path that caused INC-2024-0431"**

**The algorithm:**

```
Layer 3 produces: { id: "M-1", file: "auth/tokens.py", line: 13 }
Layer 4 produces: { id: "INC-2024-0431", files: ["auth/tokens.py"], lines: [7..15] }

find_cross_layer_match(mutations, incidents):
    for each mutation:
        for each incident:
            if mutation.file matches any incident.file
               AND any |mutation.line - incident.line| ≤ 5:
                return killer_line = f"Surviving mutation {mutation.id} is the same code path that caused {incident.id}"
```

When the match exists, the synthesis layer is **required by `.bob/rules/verdict-global.md`** to put the killer line verbatim as TL;DR sentence 1. Never paraphrase. Never omit.

See [`KILLER_LINE.md`](KILLER_LINE.md) for the full algorithm, rationale, and worked example.

---

## Bob is the engine, not the IDE

This is the part judges should not miss.

| | |
|---|---|
| **Bob planned Verdict** | [`bob_sessions/00-planning/`](bob_sessions/00-planning/) — the entire 6-layer pipeline was designed inside Bob's Plan mode |
| **Bob built Verdict** | [`bob_sessions/01-init/`](bob_sessions/01-init/) through [`06-dashboard/`](bob_sessions/06-dashboard/) — the major build phases (MCP server, harness, hardening, docs, dashboard), each with the Bob task export |
| **Bob runs Verdict** | The 6 custom modes ARE Bob executing the analysis pipeline. Remove Bob — no product. |

### Bob feature surface used

```
┌─ Modes ─────────────────────────────────────────────────────────────────────┐
│  Built-in:    Plan · Code · Advanced · Orchestrator                         │
│  Custom (6):  verdict-semantic, -blast, -mutation, -incident, -questions,   │
│               -synthesis                                                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ Skills (5) ────────────────────────────────────────────────────────────────┐
│  semantic-diff, blast-radius, mutation-audit, incident-mining,              │
│  pr-synthesis                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ Slash commands ────────────────────────────────────────────────────────────┐
│  /init      —  generates AGENTS.md for the project                          │
│  /verdict   —  runs the full pipeline on a PR URL                           │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ MCP tools (3) ─────────────────────────────────────────────────────────────┐
│  get_git_history          —  commit history for a file                      │
│  find_incident_commits    —  parses INCIDENTS.md + git log                  │
│  find_cross_layer_match   —  joins mutations to incidents (killer line)     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ Rules ─────────────────────────────────────────────────────────────────────┐
│  .bob/rules/verdict-global.md              —  project-wide rules            │
│  .bob/rules-{ask,code,plan,advanced}/      —  mode-specific guardrails      │
└─────────────────────────────────────────────────────────────────────────────┘
```

Seven exported Bob task sessions covering the major build phases. Each session in [`bob_sessions/`](bob_sessions/) contains the Bob task export and screenshots — the receipts for the work.

---

## What Verdict catches that nobody else does

| Tool | Reads diff | Indexes repo | Mines incidents | Runs mutation testing | Joins mutations × incidents |
|---|:---:|:---:|:---:|:---:|:---:|
| GitHub Copilot Review | ✓ | — | — | — | — |
| CodeRabbit | ✓ | partial | — | — | — |
| Sourcery | ✓ | — | — | — | — |
| PR-Agent | ✓ | — | — | — | — |
| Greptile | ✓ | ✓ | — | — | — |
| **Verdict** | **✓** | **✓** | **✓** | **✓** | **✓** |

The right-most column is the one that fires the killer line. Nobody else has it.

---

## Live demo

> 🔴 **Live dashboard:** [**verdict-bob.vercel.app**](https://verdict-bob.vercel.app/)
>
> Four pages — landing with auto-playing pipeline terminal, full analyze flow, architecture deep-dive, and Bob session timeline. Click [**Run the demo**](https://verdict-bob.vercel.app/analyze) to watch the killer line fire.

The demo runs the full pipeline on a deliberately engineered PR that hides a race condition behind a "performance improvement":

**Hero PR:** [Yashash4/fastapi-tokenauth#1](https://github.com/Yashash4/fastapi-tokenauth/pull/1) — *"feat: add token verification cache for performance"*

**What it actually does:** Adds a 300-second TTL cache around `verify_token()`. Looks innocent. Performance win.

**What Verdict catches:** That same `verify_token()` line was the root cause of `INC-2024-0431` — a 187-minute auth outage from a missing `SELECT FOR UPDATE`. The PR doesn't fix the bug. It **amplifies** the race condition window from milliseconds to 5 minutes by caching revoked-but-not-yet-noticed tokens.

The full Verdict synthesis on this PR: [`demo/hero-pr-result.md`](demo/hero-pr-result.md)

The dashboard renders this exact output with the killer line as the visual hero.

### Dashboard pages

| Page | URL | What's there |
|---|---|---|
| Landing | [verdict-bob.vercel.app](https://verdict-bob.vercel.app/) | Hero with live auto-playing pipeline terminal, killer-line preview, architecture overview, sessions timeline, why-this-matters story |
| Analyze | [verdict-bob.vercel.app/analyze](https://verdict-bob.vercel.app/analyze) | Locked demo URL, layer-by-layer pipeline simulation, full synthesis output with killer line glowing red |
| Pipeline | [verdict-bob.vercel.app/pipeline](https://verdict-bob.vercel.app/pipeline) | 6-layer architecture deep-dive with JSON output schemas, 3 MCP tool signatures, `.bob/mcp.json` config |
| Sessions | [verdict-bob.vercel.app/sessions](https://verdict-bob.vercel.app/sessions) | 7 exported Bob sessions, each linked to GitHub. Bob feature surface area at a glance |

---

## Run Verdict locally

### Prerequisites
- Python 3.11+
- Node.js 22+ (for dashboard)
- IBM Bob IDE installed and signed in
- A target git repository to review

### Setup

```bash
# 1. Clone Verdict
git clone https://github.com/Yashash4/verdict-bob.git
cd verdict-bob

# 2. Install MCP server dependencies
pip install -r packages/mcp-server/requirements.txt

# 3. Point at the target repo (the one whose PRs you're reviewing)
export VERDICT_REPO_PATH="/path/to/target/repo"
# Windows PowerShell:
# $env:VERDICT_REPO_PATH = "D:\path\to\target\repo"
```

### Run via Bob IDE (recommended)

Open Bob IDE in the `verdict-bob` folder. In the chat:

```
/verdict https://github.com/owner/repo/pull/123
```

Bob will execute all 6 layers and produce the synthesis comment with the killer line (when a cross-layer match exists).

### Run via CLI / Bob Shell

```bash
# Headless run
python packages/harness/verdict_cli.py \
  --repo "/path/to/target/repo" \
  --diff path/to/pr.diff \
  --format text
```

### Run the dashboard locally

```bash
cd apps/dashboard
npm install
npm run dev
# open http://localhost:3000
```

> Don't want to run it? The live deployment is at [**verdict-bob.vercel.app**](https://verdict-bob.vercel.app/).

---

## Production deployment

The dashboard demo is locked to one engineered PR for reproducibility. In production:

- **Mutation testing** runs in CI (mutmut for Python, Stryker for JS). Verdict reads the results — it doesn't trigger them live.
- **Incident history** can come from any source. The `find_incident_commits` MCP tool is the swap point. Plug it into:
  - PagerDuty postmortem exports
  - Linear / Jira incident tickets
  - Slack `#incidents` archives
  - Internal RCA documents (Notion, Confluence)
  - `INCIDENTS.md` at repo root (what this demo uses)

The cross-layer matching logic stays the same regardless of source. The killer line fires wherever your incident history lives.

---

## Project structure

```
verdict-bob/
├── .bob/                          IBM Bob configuration
│   ├── custom_modes.yaml          6 verdict-* custom modes (the pipeline)
│   ├── skills/
│   │   ├── semantic-diff/
│   │   ├── blast-radius/
│   │   ├── mutation-audit/
│   │   ├── incident-mining/
│   │   └── pr-synthesis/
│   ├── commands/
│   │   └── verdict.md             /verdict slash command
│   ├── rules/
│   │   └── verdict-global.md      Killer line + verdict-line + file-existence rules
│   ├── rules-{ask,code,plan,advanced}/   Mode-specific guardrails
│   └── mcp.json                   MCP server registration
│
├── packages/
│   ├── mcp-server/
│   │   ├── server.py              3 MCP tools (find_cross_layer_match is the one)
│   │   └── requirements.txt
│   └── harness/
│       ├── pipeline.py            Python orchestrator — calls Bob Shell per layer
│       └── verdict_cli.py         CLI entry point with argparse
│
├── apps/
│   └── dashboard/                 Next.js demo dashboard (renders hero output)
│       └── app/{,analyze,pipeline,sessions}/
│
├── demo/
│   └── hero-pr-result.md          Real synthesis output from session 04
│
├── bob_sessions/                  7 exported Bob task sessions (judging evidence)
│   ├── INDEX.md                   Session-by-session breakdown
│   ├── 00-planning/               Bob in Plan mode architecting Verdict
│   ├── 01-init/                   /init → AGENTS.md
│   ├── 02-mcp-server/             MCP server + harness + CLI + mcp.json
│   ├── 03-harness-hardening/      JSON parsing, retry logic, cross-layer pre-compute
│   ├── 04-live-analysis/          The killer line moment — /verdict on a real PR
│   ├── 05-docs/                   README, KILLER_LINE.md, LICENSE
│   └── 06-dashboard/              The Next.js dashboard
│
├── AGENTS.md                      Project context for AI agents
├── KILLER_LINE.md                 The originality, in depth
├── README.md                      You are here
└── LICENSE                        MIT
```

---

## Hackathon submission

| | |
|---|---|
| **Event** | [IBM Bob Hackathon 2026](https://lablab.ai/event/ibm-bob-hackathon) |
| **Theme** | Turn idea into impact faster |
| **Deadline** | May 17, 2026 — 8:30 PM IST |
| **Live dashboard** | [verdict-bob.vercel.app](https://verdict-bob.vercel.app/) |
| **GitHub** | [github.com/Yashash4/verdict-bob](https://github.com/Yashash4/verdict-bob) |
| **Demo target** | [github.com/Yashash4/fastapi-tokenauth](https://github.com/Yashash4/fastapi-tokenauth) |
| **Hero PR** | [PR #1 — feat: add token verification cache for performance](https://github.com/Yashash4/fastapi-tokenauth/pull/1) |

### Judging dimensions, mapped

| Dimension | Evidence |
|---|---|
| Application of Technology | 6 custom modes · 5 skills · 2 slash commands · 3 MCP tools · custom rules · Bob Shell · Orchestrator mode |
| Originality | The killer line — cross-temporal insight (mutation × incident) no diff-bound tool produces |
| Quality of Execution | Hardened pipeline (robust JSON parsing, retry, deterministic match), Linear/Sentry-grade dashboard, 7 session exports |
| Real-world Applicability | Solves an actual PR review pain point. MCP swap supports any incident source (PagerDuty, Linear, Jira) |

---

## License

[MIT](LICENSE) — fork it, ship it, send Verdict into your own repos.

<div align="center">

---

**CodeRabbit reviews the diff. Verdict reviews the decision.**

</div>
