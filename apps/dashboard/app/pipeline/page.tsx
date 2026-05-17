import Link from "next/link";

const LAYERS = [
  {
    n: "01",
    mode: "verdict-semantic",
    skill: "semantic-diff",
    title: "Semantic Diff",
    desc: "What changed in meaning. Function signatures, return types, invariants, lifecycle. Ignores whitespace, formatting, and renames.",
    output: { mode_name: "semantic", findings: "[changes]", next_mode_input: "{...}" },
  },
  {
    n: "02",
    mode: "verdict-blast",
    skill: "blast-radius",
    title: "Blast Radius",
    desc: "What else in the full repository depends on what changed. Uses @file references to read every potentially affected file.",
    output: { mode_name: "blast", findings: "[callers]", next_mode_input: "{...}" },
  },
  {
    n: "03",
    mode: "verdict-mutation",
    skill: "mutation-audit",
    title: "Mutation Audit",
    desc: "Which surviving mutations represent real bugs. Classifies by type and severity. CRITICAL = auth, payment, data integrity.",
    output: { mode_name: "mutation", findings: "[survivors]", next_mode_input: "{...}" },
    mcp: "uvx mutmut-mcp",
  },
  {
    n: "04",
    mode: "verdict-incident",
    skill: "incident-mining",
    title: "Incident Mining",
    desc: "What broke here before. Parses INCIDENTS.md and git log for fix:, hotfix:, revert:, rollback:, INC- commits.",
    output: { mode_name: "incident", findings: "[incidents]", next_mode_input: "{...}" },
    mcp: "find_incident_commits",
  },
  {
    n: "05",
    mode: "verdict-questions",
    skill: "pr-synthesis",
    title: "Reviewer Questions",
    desc: "Exactly three specific risk questions. Each must reference a finding from a prior layer. No style, no 'have you considered'.",
    output: { mode_name: "questions", findings: "[Q1, Q2, Q3]", next_mode_input: "{...}" },
  },
  {
    n: "06",
    mode: "verdict-synthesis",
    skill: "pr-synthesis",
    title: "Synthesis",
    desc: "One GitHub comment. TL;DR + Verdict + 5 sections. If cross-layer match exists, TL;DR sentence 1 is the killer line — non-negotiable.",
    output: { mode_name: "synthesis", findings: "<full PR VERDICT comment>", next_mode_input: "{}" },
    mcp: "find_cross_layer_match",
    hero: true,
  },
];

const MCP_TOOLS = [
  {
    name: "get_git_history",
    sig: "get_git_history(file_path, since_days=90)",
    desc: "Retrieves git commit history for a specific file. Returns a list of commits with sha, date, and message.",
    danger: false,
  },
  {
    name: "find_incident_commits",
    sig: "find_incident_commits(file_paths)",
    desc: "Mines INCIDENTS.md and git log for past incidents involving the changed files. Extracts incident IDs, line ranges, root causes.",
    danger: false,
  },
  {
    name: "find_cross_layer_match",
    sig: "find_cross_layer_match(mutations, incidents)",
    desc: "Matches mutations to incidents by file path + line distance (≤5 lines). When a match exists, it returns the killer_line string.",
    danger: true,
  },
];

export default function PipelinePage() {
  return (
    <main className="bg-canvas min-h-screen">
      {/* ───── Hero ───── */}
      <section className="pt-64 pb-48">
        <div className="max-w-[1152px] mx-auto px-32 space-y-32">
          <div className="flex items-center gap-12">
            <span className="text-caption uppercase text-ink-subtle">Architecture</span>
            <span className="text-ink-subtle">·</span>
            <span className="text-caption text-ink-subtle">6 layers · 3 MCP tools · 1 verdict</span>
          </div>

          <div className="space-y-16 max-w-[800px]">
            <h1 className="text-display-lg text-ink">How Verdict works</h1>
            <p className="text-body-lg text-ink-muted">
              Each layer is a Bob custom mode that emits structured JSON. The next layer reads it. The synthesis at the end calls a deterministic MCP tool to find the cross-layer match — guaranteeing the killer line fires when it should.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-16 max-w-[720px]">
            <Stat n="6" label="Pipeline layers" />
            <Stat n="3" label="MCP tools" />
            <Stat n="5" label="Bob skills" />
          </div>
        </div>
      </section>

      {/* ───── Layer Cards ───── */}
      <section className="py-64 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 space-y-32">
          <div className="space-y-8">
            <div className="text-caption uppercase text-ink-subtle">The pipeline</div>
            <h2 className="text-display-md text-ink">Six sequential layers</h2>
          </div>

          <div className="space-y-12">
            {LAYERS.map((l, i) => (
              <div key={l.n}>
                <div className={`bg-surface-1 border rounded-12 overflow-hidden ${l.hero ? "border-signal-danger" : "border-hairline"}`}>
                  <div className="grid md:grid-cols-[80px_1fr_280px] gap-0">
                    {/* Number badge */}
                    <div className={`flex items-center justify-center py-32 border-r border-hairline ${l.hero ? "bg-signal-danger/5" : "bg-canvas/40"}`}>
                      <span className={`font-mono text-display-md ${l.hero ? "text-signal-danger" : "text-ink-subtle"}`}>{l.n}</span>
                    </div>

                    {/* Layer body */}
                    <div className="px-24 py-24 space-y-16">
                      <div className="flex items-baseline gap-16 flex-wrap">
                        <h3 className="text-subhead text-ink">{l.title}</h3>
                        {l.hero && <span className="px-8 py-2 text-caption uppercase bg-signal-danger/10 border border-signal-danger text-signal-danger rounded-4">Killer line fires here</span>}
                      </div>
                      <p className="text-body text-ink-muted">{l.desc}</p>
                      <div className="flex flex-wrap items-center gap-x-16 gap-y-8 pt-4">
                        <Tag label="mode" value={l.mode} />
                        <Tag label="skill" value={l.skill} />
                        {l.mcp && <Tag label="mcp" value={l.mcp} danger={l.hero} />}
                      </div>
                    </div>

                    {/* JSON Output preview */}
                    <div className="px-16 py-16 border-l border-hairline bg-canvas/40 font-mono text-[12px] leading-relaxed">
                      <div className="text-ink-subtle pb-8">// output schema</div>
                      <div className="text-ink-muted">
                        <span className="text-ink-subtle">{"{"}</span>
                      </div>
                      {Object.entries(l.output).map(([k, v]) => (
                        <div key={k} className="text-ink-muted ml-8">
                          <span className="text-accent">&quot;{k}&quot;</span>: <span className="text-signal-success">&quot;{v}&quot;</span>,
                        </div>
                      ))}
                      <div className="text-ink-subtle">{"}"}</div>
                    </div>
                  </div>
                </div>

                {i < LAYERS.length - 1 && (
                  <div className="flex justify-center py-6">
                    <svg className="w-16 h-16 text-hairline-strong" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── MCP Tools ───── */}
      <section className="py-96 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 space-y-32">
          <div className="space-y-16 max-w-[720px]">
            <div className="text-caption uppercase text-ink-subtle">MCP server</div>
            <h2 className="text-display-md text-ink">Three tools, one moment.</h2>
            <p className="text-body-lg text-ink-muted">
              The verdict-tools MCP server is FastMCP-based and exposes 3 tools to Bob. The third is the one that fires the killer line.
            </p>
          </div>

          <div className="space-y-12">
            {MCP_TOOLS.map((t) => (
              <div key={t.name} className={`bg-surface-1 border rounded-12 p-24 ${t.danger ? "border-signal-danger" : "border-hairline"}`}>
                <div className="grid md:grid-cols-[1fr_2fr] gap-24">
                  <div className="space-y-8">
                    <div className="flex items-center gap-8">
                      <span className={`w-8 h-8 rounded-full ${t.danger ? "bg-signal-danger pulse-dot" : "bg-ink-subtle"}`} />
                      <span className="font-mono text-body text-ink">{t.name}</span>
                    </div>
                    <div className="font-mono text-[12px] text-ink-subtle pl-16">{t.sig}</div>
                  </div>
                  <div className={`text-body ${t.danger ? "text-signal-danger" : "text-ink-muted"}`}>
                    {t.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-1 border border-hairline rounded-12 p-32 space-y-12">
            <div className="text-caption uppercase text-ink-subtle">.bob/mcp.json</div>
            <pre className="font-mono text-[12px] text-ink-muted leading-relaxed overflow-x-auto">
{`{
  "mcpServers": {
    "verdict-tools": {
      "command": "python",
      "args": ["packages/mcp-server/server.py"]
    },
    "mutmut": {
      "command": "uvx",
      "args": ["mutmut-mcp"]
    }
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* ───── Why it works ───── */}
      <section className="py-96 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 grid md:grid-cols-2 gap-48">
          <div className="space-y-16">
            <div className="text-caption uppercase text-ink-subtle">Why this architecture</div>
            <h2 className="text-display-md text-ink">Each layer is just JSON in, JSON out.</h2>
          </div>
          <div className="space-y-16 text-body-lg text-ink-muted">
            <p>
              The 6-layer split means every step is independently testable, swappable, and observable. The Python harness orchestrates Bob Shell calls; the MCP server provides deterministic tools; the cross-layer match is computed in Python before synthesis — so the killer line cannot be hallucinated.
            </p>
            <p className="text-ink">
              Bob plans the pipeline. Bob runs the pipeline. The pipeline produces the killer line.
            </p>
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-96 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 text-center space-y-24">
          <h2 className="text-display-md text-ink">See it fire.</h2>
          <Link href="/analyze" className="inline-flex items-center gap-8 px-24 py-12 bg-ink text-canvas font-medium rounded-8 hover:bg-ink-muted transition-colors">
            Run the demo
            <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
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

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="bg-surface-1 border border-hairline rounded-12 p-16">
      <div className="font-mono text-display-md text-ink">{n}</div>
      <div className="text-caption uppercase text-ink-subtle pt-4">{label}</div>
    </div>
  );
}

function Tag({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="flex items-baseline gap-6">
      <span className="text-caption uppercase text-ink-subtle">{label}</span>
      <span className={`font-mono text-[13px] ${danger ? "text-signal-danger" : "text-accent"}`}>{value}</span>
    </div>
  );
}
