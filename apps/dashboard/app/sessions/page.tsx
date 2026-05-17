const SESSIONS = [
  {
    number: "06",
    name: "dashboard",
    feature: "Code mode",
    proof: "Bob built the Next.js dashboard with confidence-score animation that renders the hero synthesis",
    folder: "06-dashboard",
  },
  {
    number: "05",
    name: "docs",
    feature: "Code mode",
    proof: "Bob wrote README, KILLER_LINE.md, LICENSE, and saved the demo synthesis output",
    folder: "05-docs",
  },
  {
    number: "04",
    name: "live-analysis",
    feature: "Orchestrator mode + /verdict slash command + 6 custom modes + 3 MCP tools",
    proof: "Full pipeline end-to-end on a real PR. Cross-layer match found via find_cross_layer_match MCP tool. Killer line fires: \"Surviving mutation M-1 is the same code path that caused INC-2024-0431\"",
    folder: "04-live-analysis",
  },
  {
    number: "03",
    name: "harness-hardening",
    feature: "Code mode",
    proof: "Bob hardened the pipeline — robust JSON parsing, deterministic cross-layer matching, retry logic",
    folder: "03-harness-hardening",
  },
  {
    number: "02",
    name: "mcp-server",
    feature: "Code mode + Advanced mode",
    proof: "Bob built verdict-tools MCP server (3 tools), pipeline harness, CLI, and MCP config",
    folder: "02-mcp-server",
  },
  {
    number: "01",
    name: "init",
    feature: "/init slash command",
    proof: "Bob generated AGENTS.md for the project",
    folder: "01-init",
  },
  {
    number: "00",
    name: "planning",
    feature: "Plan mode",
    proof: "Bob architected Verdict before we wrote code",
    folder: "00-planning",
  },
];

export default function SessionsPage() {
  return (
    <main className="bg-canvas min-h-screen py-64">
      <div className="max-w-[1152px] mx-auto px-32 space-y-64">
        {/* Header */}
        <div className="space-y-16">
          <h1 className="text-display-md text-ink">Bob built this</h1>
          <p className="text-body-lg text-ink-muted max-w-[640px]">
            6 exported sessions, every step traceable. Bob planned it, built it, and runs it.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-24">
          {SESSIONS.map((session, idx) => (
            <a
              key={session.number}
              href={`https://github.com/Yashash4/verdict-bob/tree/main/bob_sessions/${session.folder}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-surface-1 border border-hairline hover:border-accent rounded-12 p-32 transition-colors group"
            >
              <div className="flex items-start gap-24">
                {/* Session Number Badge */}
                <div className="flex-shrink-0 w-64 h-64 bg-accent/10 border border-accent rounded-12 flex items-center justify-center">
                  <span className="text-headline text-accent font-mono">{session.number}</span>
                </div>

                {/* Session Details */}
                <div className="flex-1 space-y-12">
                  <div className="flex items-center gap-12">
                    <h3 className="text-subhead text-ink group-hover:text-accent transition-colors">
                      {session.name}
                    </h3>
                    <svg className="w-16 h-16 text-ink-subtle group-hover:text-accent transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>

                  <div className="flex items-center gap-8">
                    <span className="text-caption uppercase text-ink-subtle">Bob feature used:</span>
                    <span className="text-body text-ink-muted font-mono">{session.feature}</span>
                  </div>

                  <p className="text-body text-ink-muted leading-relaxed">
                    {session.proof}
                  </p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Footer Note */}
        <div className="bg-surface-1 border border-hairline rounded-12 p-32 space-y-16">
          <h3 className="text-subhead text-ink">The narrative</h3>
          <p className="text-body text-ink-muted leading-relaxed">
            This project demonstrates Bob at three levels: Bob planned Verdict (session 00), Bob built Verdict (sessions 01-06), and Bob runs Verdict (the 6 custom modes ARE Bob executing analysis). Every session above is an exported Bob task history proving meaningful usage.
          </p>
        </div>
      </div>
    </main>
  );
}

// Made with Bob
