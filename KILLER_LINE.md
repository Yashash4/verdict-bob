<div align="center">

# The Killer Line

</div>

---

<div align="center">

> ## **"Surviving mutation M-1 is the same code path that caused INC-2024-0431"**

</div>

---

## One sentence. The entire risk.

This sentence is what Verdict produces when a surviving mutation from `mutmut` lands on the same file and line range as a past production incident.

It is the originality of the project. It is the moment that wins.

**Read it slowly.** Now ask: how could any AI PR-reviewer say this without:

1. Running mutation testing on the PR branch
2. Mining the repository's incident history
3. Joining the two by file path and line proximity

The answer is *they cannot*. CodeRabbit, GitHub Copilot Review, Sourcery, PR-Agent, Greptile — all of them are **diff-bound**. They read the lines that changed. They do not read the timeline.

Verdict reads the timeline.

---

## Why no other tool produces this

| Capability | Diff-bound tools | Verdict |
|---|:---:|:---:|
| Read the unified diff | ✓ | ✓ |
| Index the repo for symbol search | ✓ | ✓ |
| Run mutation testing on the changed code | — | ✓ |
| Parse `INCIDENTS.md`, PagerDuty, Linear, Jira | — | ✓ |
| Mine `git log` for `fix:`, `hotfix:`, `revert:`, `INC-` patterns | — | ✓ |
| Match surviving mutations to past incidents by file + line proximity | — | ✓ |
| Produce a one-sentence cross-temporal verdict | — | ✓ |

Every other PR review tool sees one snapshot in time: the diff. Verdict sees three timelines at once — what's changing now, what's broken in tests, what broke before — and triangulates.

---

## The algorithm

### Step 1 — Layer 3 (mutation) produces surviving mutations

```json
{
  "mode_name": "mutation",
  "findings": [
    {
      "id": "M-1",
      "file": "auth/tokens.py",
      "line": 13,
      "type": "removed_lock",
      "severity": "CRITICAL",
      "description": "Missing SELECT FOR UPDATE in db.query()"
    }
  ]
}
```

### Step 2 — Layer 4 (incident) produces past incidents

```json
{
  "mode_name": "incident",
  "findings": [
    {
      "id": "INC-2024-0431",
      "date": "2024-10-15",
      "files": ["auth/tokens.py"],
      "lines": [7, 8, 9, 10, 11, 12, 13, 14, 15],
      "summary": "Race condition in token verification — missing database lock"
    }
  ]
}
```

### Step 3 — `find_cross_layer_match` MCP tool joins them

```python
match = find_cross_layer_match(
    mutations=[{ "id": "M-1", "file": "auth/tokens.py", "line": 13 }],
    incidents=[{ "id": "INC-2024-0431", "files": ["auth/tokens.py"], "lines": [7..15] }]
)
# returns:
# [{
#   "mutation_id": "M-1",
#   "incident_id": "INC-2024-0431",
#   "file": "auth/tokens.py",
#   "line_distance": 0,
#   "killer_line": "Surviving mutation M-1 is the same code path that caused INC-2024-0431"
# }]
```

### Step 4 — Synthesis writes the line, verbatim

Bob's synthesis layer reads the pre-computed match and is instructed by [`.bob/rules/verdict-global.md`](.bob/rules/verdict-global.md):

> *"When a surviving mutation targets the same file and line range as a past incident, the synthesis comment TL;DR MUST start with the killer line. **Never omit it when a match exists.**"*

The match is computed in Python, not by an LLM. **The killer line cannot be hallucinated.**

---

## Matching criteria

```
match = (mutation.file matches incident.files) AND (|mutation.line − incident.line| ≤ 5)
```

- **File path match** — substring or endswith, so `auth/tokens.py` matches `repo/auth/tokens.py`
- **Line distance ≤ 5** — captures local refactors, copy-paste regressions, drift from the original fix

The threshold is conservative on purpose. The killer line should fire when the risk is real, not when two things happen to live in the same module.

---

## Why this matters in production

Every team has an `INC-2024-0431`. The 187-minute auth outage. The 02:47 page that woke half the on-call rotation. The post-mortem with "we should have caught this in review."

Three months later, someone touches the same code path again. They don't remember the incident. They weren't on-call that night. The diff looks fine. The tests pass.

**That's where production incidents come from.** Not from new ignorance, but from organizational forgetting.

Verdict remembers. Verdict reads the incident log. Verdict reads the mutation results. Verdict joins them. Verdict says, in one sentence, *don't merge — this is the same place last quarter broke*.

---

## IBM Bob makes this possible

The killer line exists because of three IBM Bob capabilities working together:

| | |
|---|---|
| **Custom modes** | 6 modes implement the pipeline, each with structured JSON output |
| **MCP tools** | `find_cross_layer_match` is a deterministic Python function Bob calls during synthesis |
| **Custom rules** | `verdict-global.md` enforces "killer line must appear when match exists — never paraphrase" |

Bob calls the MCP tool. Bob receives a structured result. Bob's rules force the line into the TL;DR verbatim. The pipeline cannot decide to be polite or hedge.

---

## See it fire, live

The complete Verdict synthesis comment from session 04: [`demo/hero-pr-result.md`](demo/hero-pr-result.md)

The dashboard renders this output with the killer line as the visual hero — a glowing red callout that should be the first thing your eye lands on.

The PR being analyzed: [Yashash4/fastapi-tokenauth#1](https://github.com/Yashash4/fastapi-tokenauth/pull/1) — a deliberately engineered PR adding a 5-minute token cache that *amplifies* the race condition from `INC-2024-0431` rather than fixing it.

---

## In one line

> **The killer line is what happens when a tool stops reading the diff and starts reading the team's pain.**

<div align="center">

---

**CodeRabbit reviews the diff. Verdict reviews the decision.**

</div>
