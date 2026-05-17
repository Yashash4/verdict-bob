import Link from "next/link";

const SESSIONS = [
  {
    n: "00",
    name: "planning",
    feature: "Plan mode",
    proof: "Bob architected Verdict before any code existed. The 6-layer pipeline, the killer-line concept, the cross-layer matching algorithm — all designed inside Plan mode before a single file was created.",
    tags: ["Plan mode"],
    artifacts: ["bob_task export", "screenshot"],
  },
  {
    n: "01",
    name: "init",
    feature: "/init slash command",
    proof: "Bob ran /init and generated AGENTS.md — the project's persistent context document. This is the slash-command feature judges look for.",
    tags: ["/init", "AGENTS.md"],
    artifacts: ["bob_task ×2 exports", "screenshots ×2"],
  },
  {
    n: "02",
    name: "mcp-server",
    feature: "Code mode + Advanced mode",
    proof: "Bob built the verdict-tools MCP server (3 tools), the Python pipeline harness, the CLI wrapper, and the .bob/mcp.json config — all in one session.",
    tags: ["Code mode", "Advanced mode", "MCP"],
    artifacts: ["bob_task export", "screenshot"],
  },
  {
    n: "03",
    name: "harness-hardening",
    feature: "Code mode",
    proof: "Bob identified and fixed five robustness gaps: brittle JSON parsing, non-deterministic cross-layer matching, missing retry logic, layer-output schema drift, and the .format() crash on JSON examples.",
    tags: ["Code mode", "Hardening"],
    artifacts: ["bob_task export", "screenshot"],
  },
  {
    n: "04",
    name: "live-analysis",
    feature: "Orchestrator mode + /verdict + 6 custom modes + 3 MCP tools",
    proof: "The full pipeline ran end-to-end on a real PR. The cross-layer match fired. The killer line appeared: \"Surviving mutation M-1 is the same code path that caused INC-2024-0431.\"",
    tags: ["Orchestrator", "/verdict", "6 modes", "3 MCP tools"],
    artifacts: ["bob_task export", "screenshot"],
    hero: true,
  },
  {
    n: "05",
    name: "docs",
    feature: "Code mode",
    proof: "Bob wrote README, KILLER_LINE.md, LICENSE, and captured the synthesis output into demo/hero-pr-result.md. Submission documentation, all by Bob.",
    tags: ["Code mode", "Docs"],
    artifacts: ["bob_task export"],
  },
  {
    n: "06",
    name: "dashboard",
    feature: "Code mode",
    proof: "Bob built this Next.js dashboard you're reading right now — landing, analyze flow, pipeline page, sessions page (this one).",
    tags: ["Code mode", "Next.js"],
    artifacts: ["bob_task export"],
  },
];

export default function SessionsPage() {
  return (
    <main className="bg-canvas min-h-screen">
      {/* ───── Hero ───── */}
      <section className="pt-64 pb-48">
        <div className="max-w-[1152px] mx-auto px-32 space-y-32">
          <div className="flex items-center gap-12">
            <span className="text-caption uppercase text-ink-subtle">Bob sessions</span>
            <span className="text-ink-subtle">·</span>
            <span className="text-caption text-ink-subtle">7 exported · every step traceable</span>
          </div>

          <div className="space-y-16 max-w-[800px]">
            <h1 className="text-display-lg text-ink">Bob planned it.<br />Bob built it.<br />Bob runs it.</h1>
            <p className="text-body-lg text-ink-muted">
              Seven exported Bob task sessions. Each one a receipt for a concrete piece of work. No hand-waving about &quot;built with Bob&quot; — every step has a transcript and a screenshot in the repo.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-16 max-w-[720px]">
            <Stat n="7" label="Sessions" />
            <Stat n="3" label="Bob modes used" />
            <Stat n="2" label="Slash commands" />
            <Stat n="1" label="Killer line" danger />
          </div>
        </div>
      </section>

      {/* ───── Bob feature surface ───── */}
      <section className="pb-48">
        <div className="max-w-[1152px] mx-auto px-32 space-y-16">
          <div className="text-caption uppercase text-ink-subtle">Bob feature surface area</div>
          <div className="bg-surface-1 border border-hairline rounded-12 p-24">
            <div className="grid md:grid-cols-3 gap-x-32 gap-y-16">
              <SurfaceItem label="Modes" items={["Plan", "Code", "Advanced", "Orchestrator"]} />
              <SurfaceItem label="Custom modes" items={["verdict-semantic", "verdict-blast", "verdict-mutation", "verdict-incident", "verdict-questions", "verdict-synthesis"]} mono />
              <SurfaceItem label="Skills" items={["semantic-diff", "blast-radius", "mutation-audit", "incident-mining", "pr-synthesis"]} mono />
              <SurfaceItem label="Slash commands" items={["/init", "/verdict"]} mono />
              <SurfaceItem label="MCP tools" items={["get_git_history", "find_incident_commits", "find_cross_layer_match"]} mono />
              <SurfaceItem label="Rules" items={["verdict-global.md", "rules-ask, -code, -plan, -advanced"]} />
            </div>
          </div>
        </div>
      </section>

      {/* ───── Timeline ───── */}
      <section className="py-48 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 space-y-32">
          <div className="space-y-8">
            <div className="text-caption uppercase text-ink-subtle">Timeline</div>
            <h2 className="text-display-md text-ink">Every session, in order.</h2>
          </div>

          <div className="space-y-12">
            {SESSIONS.map((s) => (
              <a
                key={s.n}
                href={`https://github.com/Yashash4/verdict-bob/tree/main/bob_sessions/${s.n}-${s.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`block bg-surface-1 border rounded-12 p-24 transition-colors group ${
                  s.hero ? "border-signal-danger hover:border-signal-danger" : "border-hairline hover:border-hairline-strong"
                }`}
              >
                <div className="grid md:grid-cols-[80px_1fr_24px] gap-24 items-start">
                  {/* Number */}
                  <div className={`flex items-center justify-center w-64 h-64 rounded-12 font-mono text-display-md ${
                    s.hero
                      ? "bg-signal-danger/10 border border-signal-danger text-signal-danger"
                      : "bg-canvas border border-hairline text-ink-subtle group-hover:text-accent group-hover:border-accent"
                  } transition-colors`}>
                    {s.n}
                  </div>

                  {/* Body */}
                  <div className="space-y-12">
                    <div className="flex items-baseline gap-16 flex-wrap">
                      <h3 className={`text-headline ${s.hero ? "text-signal-danger" : "text-ink group-hover:text-accent"} transition-colors`}>
                        {s.name}
                      </h3>
                      {s.hero && <span className="px-8 py-2 text-caption uppercase bg-signal-danger/10 border border-signal-danger text-signal-danger rounded-4">The killer-line moment</span>}
                    </div>

                    <div className="flex flex-wrap gap-8">
                      {s.tags.map((t) => (
                        <span key={t} className="font-mono text-[12px] px-8 py-2 bg-canvas border border-hairline rounded-4 text-ink-muted">
                          {t}
                        </span>
                      ))}
                    </div>

                    <p className="text-body text-ink-muted leading-relaxed">{s.proof}</p>

                    <div className="flex flex-wrap items-center gap-x-16 gap-y-4 pt-4 text-caption text-ink-subtle">
                      <span className="uppercase">Artifacts:</span>
                      {s.artifacts.map((a, i) => (
                        <span key={i} className="font-mono">{a}{i < s.artifacts.length - 1 ? " ·" : ""}</span>
                      ))}
                    </div>
                  </div>

                  {/* External arrow */}
                  <svg className={`w-16 h-16 mt-8 transition-colors ${
                    s.hero ? "text-signal-danger" : "text-ink-subtle group-hover:text-accent"
                  }`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Narrative ───── */}
      <section className="py-96 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 grid md:grid-cols-2 gap-48">
          <div className="space-y-16">
            <div className="text-caption uppercase text-ink-subtle">Bob at three levels</div>
            <h2 className="text-display-md text-ink">Not just &quot;built with Bob.&quot;</h2>
          </div>
          <div className="space-y-24">
            <Level n="1" title="Bob planned Verdict" body="Session 00 is Bob in Plan mode architecting the entire 6-layer pipeline." />
            <Level n="2" title="Bob built Verdict" body="Sessions 01–06 are Bob writing every line of code, every config file, every doc." />
            <Level n="3" title="Bob runs Verdict" body="The 6 custom modes ARE Bob executing analysis at inference time. Take Bob out — there is no product." />
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-96 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 text-center space-y-24">
          <h2 className="text-display-md text-ink">See what Bob built.</h2>
          <div className="flex flex-wrap justify-center gap-16">
            <Link href="/analyze" className="inline-flex items-center gap-8 px-24 py-12 bg-ink text-canvas font-medium rounded-8 hover:bg-ink-muted transition-colors">
              Run the demo
              <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </Link>
            <a href="https://github.com/Yashash4/verdict-bob/tree/main/bob_sessions" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-8 px-16 py-12 border border-hairline rounded-8 text-ink-muted hover:text-ink hover:border-hairline-strong transition-colors">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      <footer className="py-48 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 flex flex-wrap items-center justify-between gap-16">
          <div className="flex items-center gap-12">
            <span className="font-mono text-caption text-ink">verdict</span>
            <span className="text-ink-subtle">·</span>
            <span className="text-caption text-ink-subtle">Built on IBM Bob</span>
          </div>
          <div className="flex items-center gap-24 text-caption text-ink-subtle">
            <a href="https://github.com/Yashash4/verdict-bob" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">GitHub</a>
            <a href="https://lablab.ai/event/ibm-bob-hackathon" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">Hackathon</a>
            <span>MIT License</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Stat({ n, label, danger }: { n: string; label: string; danger?: boolean }) {
  return (
    <div className="bg-surface-1 border border-hairline rounded-12 p-16">
      <div className={`font-mono text-display-md ${danger ? "text-signal-danger" : "text-ink"}`}>{n}</div>
      <div className="text-caption uppercase text-ink-subtle pt-4">{label}</div>
    </div>
  );
}

function SurfaceItem({ label, items, mono }: { label: string; items: string[]; mono?: boolean }) {
  return (
    <div className="space-y-8">
      <div className="text-caption uppercase text-ink-subtle">{label}</div>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item} className={`text-body text-ink-muted ${mono ? "font-mono text-[13px]" : ""}`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function Level({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex gap-16">
      <div className="flex-shrink-0 w-32 h-32 rounded-full bg-accent/10 border border-accent flex items-center justify-center font-mono text-body text-accent">{n}</div>
      <div className="space-y-4">
        <h3 className="text-subhead text-ink">{title}</h3>
        <p className="text-body text-ink-muted">{body}</p>
      </div>
    </div>
  );
}
