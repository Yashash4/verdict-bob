import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-canvas">
      {/* Hero Section */}
      <section className="min-h-[640px] flex items-center">
        <div className="max-w-[1152px] mx-auto px-32 w-full">
          <div className="max-w-[800px] space-y-32">
            {/* Eyebrow */}
            <div className="text-caption uppercase text-signal-success">
              IBM Bob Hackathon 2026
            </div>

            {/* Heading */}
            <div className="space-y-24">
              <h1 className="text-display-xl text-ink">
                Verdict
              </h1>
              <p className="text-subhead text-ink-muted">
                CodeRabbit reviews the diff. Verdict reviews the decision.
              </p>
              <p className="text-body-lg text-ink-muted max-w-[640px]">
                See what no diff-bound tool can see: surviving mutations matched to past incidents by file and line proximity.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-24">
              <Link
                href="/analyze"
                className="inline-flex items-center gap-8 px-24 py-12 bg-accent hover:bg-accent-hover text-ink font-medium rounded-8 transition-colors"
              >
                Try the demo
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <a
                href="https://github.com/Yashash4/verdict-bob/blob/main/KILLER_LINE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-8 text-body text-ink-muted hover:text-ink transition-colors"
              >
                Read KILLER_LINE.md
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-96">
        <div className="max-w-[1152px] mx-auto px-32">
          <div className="grid md:grid-cols-3 gap-24">
            {/* Card 1 */}
            <div className="bg-surface-1 border border-hairline rounded-12 p-32 space-y-16">
              <div className="text-headline text-ink">6 layers</div>
              <p className="text-body text-ink-muted">
                Semantic diff, blast radius, mutation audit, incident mining, reviewer questions, synthesis. Each layer feeds the next.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-1 border border-hairline rounded-12 p-32 space-y-16">
              <div className="text-headline text-ink">3 MCP tools</div>
              <p className="text-body text-ink-muted">
                find_cross_layer_match connects mutations to incidents. get_git_history mines commits. find_incident_commits parses INCIDENTS.md.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-1 border border-hairline rounded-12 p-32 space-y-16">
              <div className="text-headline text-ink">Built on Bob</div>
              <p className="text-body text-ink-muted">
                6 custom modes, 5 skills, 2 slash commands, 3 MCP tools. Bob planned it, built it, and runs it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-96 border-t border-hairline">
        <div className="max-w-[1152px] mx-auto px-32">
          <p className="text-subhead text-ink-subtle text-center max-w-[640px] mx-auto">
            Every other PR tool reads the diff. Verdict reads the history.
          </p>
        </div>
      </section>
    </main>
  );
}

// Made with Bob
