import Link from "next/link";
import HeroTerminal from "@/components/HeroTerminal";

const LAYERS = [
  { n: "01", name: "semantic",  desc: "what changed in meaning, not just lines" },
  { n: "02", name: "blast",     desc: "what else in the repo depends on this change" },
  { n: "03", name: "mutation",  desc: "which test gaps survive mutation testing" },
  { n: "04", name: "incident",  desc: "what broke here before — git log + INCIDENTS.md" },
  { n: "05", name: "questions", desc: "exactly three specific risk questions" },
  { n: "06", name: "synthesis", desc: "one comment, with the cross-layer killer line" },
];

const MCP = [
  { name: "get_git_history",        desc: "Retrieves git commit history for a file" },
  { name: "find_incident_commits",  desc: "Mines INCIDENTS.md and git log for incidents" },
  { name: "find_cross_layer_match", desc: "Matches mutations to incidents — the killer line fires here", danger: true },
];

const SESSIONS = [
  { n: "00", name: "planning",         feature: "Plan mode",                              proof: "Bob architected Verdict before any code existed" },
  { n: "01", name: "init",             feature: "/init slash command",                    proof: "Bob generated AGENTS.md for the project" },
  { n: "02", name: "mcp-server",       feature: "Code + Advanced mode",                   proof: "Bob built the MCP server, harness, CLI, MCP config" },
  { n: "03", name: "harness-hardening",feature: "Code mode",                              proof: "Bob hardened JSON parsing, retry logic, cross-layer pre-compute" },
  { n: "04", name: "live-analysis",    feature: "Orchestrator + /verdict + 6 modes + 3 MCP tools", proof: "Full pipeline on a real PR. Killer line fires." },
  { n: "05", name: "docs",             feature: "Code mode",                              proof: "Bob wrote README, KILLER_LINE.md, LICENSE, demo artifact" },
  { n: "06", name: "dashboard",        feature: "Code mode",                              proof: "Bob built this Next.js dashboard" },
];

export default function Home() {
  return (
    <main className="bg-canvas">
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="pt-64 pb-96">
        <div className="max-w-[1152px] mx-auto px-32 grid lg:grid-cols-[1fr_1.1fr] gap-48 items-center">
          {/* Left: Copy */}
          <div className="space-y-32">
            <div className="inline-flex items-center gap-12 px-12 py-6 bg-surface-1 border border-hairline rounded-6">
              <span className="w-8 h-8 rounded-full bg-signal-success pulse-dot" />
              <span className="text-caption uppercase text-ink-muted">IBM Bob Hackathon 2026</span>
            </div>

            <div className="space-y-16">
              <h1 className="text-display-xl text-ink">Verdict</h1>
              <p className="text-subhead text-ink-muted max-w-[520px]">
                CodeRabbit reviews the diff. <span className="text-ink">Verdict reviews the decision.</span>
              </p>
              <p className="text-body-lg text-ink-muted max-w-[520px]">
                A pre-merge review tool that connects what&apos;s changing now to what broke before — and refuses to let history repeat itself.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-16 pt-8">
              <Link href="/analyze" className="inline-flex items-center gap-8 px-24 py-12 bg-ink text-canvas font-medium rounded-8 hover:bg-ink-muted transition-colors">
                Try the live demo
                <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </Link>
              <a href="https://github.com/Yashash4/verdict-bob" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-8 px-16 py-12 border border-hairline rounded-8 text-ink-muted hover:text-ink hover:border-hairline-strong transition-colors">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                Source on GitHub
              </a>
            </div>

            <div className="flex flex-wrap gap-x-32 gap-y-12 pt-16">
              <Stat n="6" l="custom modes" />
              <Stat n="5" l="bob skills" />
              <Stat n="3" l="mcp tools" />
              <Stat n="7" l="sessions exported" />
            </div>
          </div>

          {/* Right: Live Terminal */}
          <div className="lg:pl-24">
            <HeroTerminal />
          </div>
        </div>
      </section>

      {/* ───────────────────── KILLER LINE PREVIEW ───────────────────── */}
      <section className="py-96 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 space-y-48">
          <div className="space-y-16 max-w-[720px]">
            <div className="text-caption uppercase text-signal-danger">The output that wins</div>
            <h2 className="text-display-md text-ink">One sentence, no other PR tool can produce.</h2>
            <p className="text-body-lg text-ink-muted">
              When a surviving mutation targets the same file and line as a past production incident, Verdict fires the killer line. CodeRabbit can&apos;t see this. Copilot Review can&apos;t see this. Sourcery can&apos;t see this. They&apos;re diff-bound.
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-16 shadow-killer-glow animate-killer-glow" />
            <div className="relative bg-surface-1 border border-signal-danger rounded-16 p-48 space-y-16">
              <div className="flex items-center gap-12">
                <span className="text-caption uppercase text-signal-danger">Cross-Layer Match Found</span>
                <span className="w-4 h-4 rounded-full bg-signal-danger pulse-dot" />
              </div>
              <p className="text-display-md font-mono text-ink leading-tight">
                Surviving mutation <span className="text-signal-danger">M-1</span> is the same code path that caused <span className="text-signal-danger">INC-2024-0431</span>
              </p>
              <p className="text-body text-ink-subtle">
                file <span className="font-mono text-ink-muted">auth/tokens.py:13</span> · line distance <span className="font-mono text-ink-muted">0</span> · verdict <span className="text-signal-danger font-semibold">🔴 DO NOT MERGE</span>
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-16 pt-8">
            <Insight label="Temporal analysis" body="Mines git history for incident patterns (fix:, hotfix:, revert:, INC-)." />
            <Insight label="Dynamic analysis" body="Mutation testing finds the test gaps your suite is missing." />
            <Insight label="Cross-layer synthesis" body="Joins mutations to incidents by file + line proximity." />
          </div>
        </div>
      </section>

      {/* ───────────────────────── HOW IT WORKS ───────────────────────── */}
      <section className="py-96 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 space-y-48">
          <div className="space-y-16 max-w-[720px]">
            <div className="text-caption uppercase text-ink-subtle">How it works</div>
            <h2 className="text-display-md text-ink">Six layers. One verdict.</h2>
            <p className="text-body-lg text-ink-muted">
              Each layer is a Bob custom mode that emits structured JSON. The next layer reads it. The Python harness orchestrates the chain via Bob Shell.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {LAYERS.map((l) => (
              <div key={l.n} className="bg-surface-1 border border-hairline rounded-12 p-24 hover:border-hairline-strong transition-colors">
                <div className="flex items-baseline gap-16 mb-8">
                  <span className="font-mono text-caption text-ink-subtle">{l.n}</span>
                  <span className="font-mono text-body text-accent">verdict-{l.name}</span>
                </div>
                <p className="text-body text-ink-muted">{l.desc}</p>
              </div>
            ))}
          </div>

          <Link href="/pipeline" className="inline-flex items-center gap-8 text-body text-ink-muted hover:text-ink transition-colors">
            See the full architecture
            <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* ───────────────────────── MCP TOOLS ───────────────────────── */}
      <section className="py-96 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 space-y-48">
          <div className="space-y-16 max-w-[720px]">
            <div className="text-caption uppercase text-ink-subtle">MCP integration</div>
            <h2 className="text-display-md text-ink">Three tools. One that matters most.</h2>
            <p className="text-body-lg text-ink-muted">
              Verdict ships a FastMCP server with three tools. Bob calls them mid-analysis. The third is the one that fires the killer line.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16">
            {MCP.map((t) => (
              <div key={t.name} className={`bg-surface-1 border rounded-12 p-24 space-y-12 ${t.danger ? "border-signal-danger" : "border-hairline"}`}>
                <div className="flex items-center gap-8">
                  <div className={`w-8 h-8 rounded-full ${t.danger ? "bg-signal-danger pulse-dot" : "bg-ink-subtle"}`} />
                  <span className="font-mono text-body text-ink">{t.name}</span>
                </div>
                <p className={`text-body ${t.danger ? "text-signal-danger" : "text-ink-muted"}`}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── BOB BUILT THIS ───────────────────────── */}
      <section className="py-96 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 space-y-48">
          <div className="space-y-16 max-w-[720px]">
            <div className="text-caption uppercase text-ink-subtle">Bob sessions</div>
            <h2 className="text-display-md text-ink">Bob planned it. Bob built it. Bob runs it.</h2>
            <p className="text-body-lg text-ink-muted">
              Seven exported Bob task sessions. Every step traceable. Every line of code with a Bob receipt.
            </p>
          </div>

          <div className="space-y-12">
            {SESSIONS.map((s) => (
              <a key={s.n} href={`https://github.com/Yashash4/verdict-bob/tree/main/bob_sessions/${s.n}-${s.name}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-24 px-24 py-16 bg-surface-1 border border-hairline hover:border-hairline-strong rounded-12 transition-colors group">
                <span className="font-mono text-headline text-ink-subtle group-hover:text-accent transition-colors w-32">{s.n}</span>
                <div className="flex-1 grid md:grid-cols-[200px_1fr] gap-16 items-center">
                  <span className="font-mono text-body text-ink">{s.name}</span>
                  <span className="text-body text-ink-muted">{s.proof}</span>
                </div>
                <svg className="w-16 h-16 text-ink-subtle group-hover:text-accent transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            ))}
          </div>

          <Link href="/sessions" className="inline-flex items-center gap-8 text-body text-ink-muted hover:text-ink transition-colors">
            See full session details
            <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

      {/* ───────────────────────── WHY THIS MATTERS ───────────────────────── */}
      <section className="py-96 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 grid md:grid-cols-2 gap-48">
          <div className="space-y-16">
            <div className="text-caption uppercase text-ink-subtle">Why this matters</div>
            <h2 className="text-display-md text-ink">Production incidents have a memory.<br/>Reviewers don&apos;t.</h2>
          </div>
          <div className="space-y-16 text-body-lg text-ink-muted">
            <p>Every team has an INC-2024-0431 — the incident that took down auth for 187 minutes. Three months later, someone touches the same code path again. The reviewer doesn&apos;t remember. The tests pass. The PR merges.</p>
            <p className="text-ink">Verdict remembers. And it tells you, before you click merge.</p>
          </div>
        </div>
      </section>

      {/* ───────────────────────── FINAL CTA ───────────────────────── */}
      <section className="py-96 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 text-center space-y-32">
          <h2 className="text-display-lg text-ink max-w-[800px] mx-auto">See it fire on a real PR.</h2>
          <p className="text-body-lg text-ink-muted max-w-[560px] mx-auto">
            The live demo runs the full 6-layer pipeline on github.com/Yashash4/fastapi-tokenauth/pull/1 and produces the killer line.
          </p>
          <div className="flex flex-wrap justify-center gap-16">
            <Link href="/analyze" className="inline-flex items-center gap-8 px-24 py-12 bg-ink text-canvas font-medium rounded-8 hover:bg-ink-muted transition-colors">
              Run the demo
              <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/pipeline" className="inline-flex items-center gap-8 px-16 py-12 border border-hairline rounded-8 text-ink-muted hover:text-ink hover:border-hairline-strong transition-colors">
              See the architecture
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────── FOOTER ───────────────────────── */}
      <footer className="py-48 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 flex flex-wrap items-center justify-between gap-16">
          <div className="flex items-center gap-12">
            <span className="font-mono text-caption text-ink">verdict</span>
            <span className="text-ink-subtle">·</span>
            <span className="text-caption text-ink-subtle">Built on IBM Bob</span>
          </div>
          <div className="flex items-center gap-24 text-caption text-ink-subtle">
            <a href="https://github.com/Yashash4/verdict-bob" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">GitHub</a>
            <a href="https://github.com/Yashash4/verdict-bob/blob/main/KILLER_LINE.md" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">KILLER_LINE.md</a>
            <a href="https://lablab.ai/event/ibm-bob-hackathon" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">Hackathon</a>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="flex items-baseline gap-8">
      <span className="font-mono text-headline text-ink">{n}</span>
      <span className="text-caption uppercase text-ink-subtle">{l}</span>
    </div>
  );
}

function Insight({ label, body }: { label: string; body: string }) {
  return (
    <div className="bg-surface-1 border border-hairline rounded-12 p-24 space-y-8">
      <div className="text-caption uppercase text-accent">{label}</div>
      <p className="text-body text-ink-muted">{body}</p>
    </div>
  );
}
