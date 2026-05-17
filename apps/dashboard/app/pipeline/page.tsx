const LAYERS = [
  {
    number: 1,
    mode: "semantic",
    skill: "semantic-diff",
    output: "Meaningful code changes (ignores whitespace, formatting, renames)",
  },
  {
    number: 2,
    mode: "blast",
    skill: "blast-radius",
    output: "Full repository search for similar code patterns",
  },
  {
    number: 3,
    mode: "mutation",
    skill: "mutation-audit",
    output: "Surviving mutations with severity (CRITICAL/HIGH/LOW)",
  },
  {
    number: 4,
    mode: "incident",
    skill: "incident-mining",
    output: "Past incidents from INCIDENTS.md + git log (fix:, hotfix:, INC-)",
  },
  {
    number: 5,
    mode: "questions",
    skill: "pr-synthesis",
    output: "Exactly 3 specific risk questions for reviewers",
  },
  {
    number: 6,
    mode: "synthesis",
    skill: "pr-synthesis",
    output: "ONE final comment with TL;DR, verdict, and cross-layer insight",
  },
];

const MCP_TOOLS = [
  {
    name: "get_git_history",
    description: "Retrieves git commit history for a file",
    highlight: false,
  },
  {
    name: "find_incident_commits",
    description: "Mines INCIDENTS.md and git log for past incidents",
    highlight: false,
  },
  {
    name: "find_cross_layer_match",
    description: "Matches mutations to incidents by file/line overlap — this is where the killer line fires",
    highlight: true,
  },
];

export default function PipelinePage() {
  return (
    <main className="bg-canvas min-h-screen py-64">
      <div className="max-w-[1152px] mx-auto px-32 space-y-64">
        {/* Header */}
        <div className="space-y-16">
          <h1 className="text-display-md text-ink">How Verdict works</h1>
          <p className="text-body-lg text-ink-muted max-w-[640px]">
            Six sequential layers, each feeding the next. Three MCP tools power cross-layer matching.
          </p>
        </div>

        {/* Pipeline Layers */}
        <div className="space-y-24">
          <h2 className="text-headline text-ink">6-Layer Pipeline</h2>
          <div className="space-y-16">
            {LAYERS.map((layer, idx) => (
              <div key={layer.number}>
                <div className="bg-surface-1 border border-hairline rounded-12 p-24">
                  <div className="flex items-start gap-24">
                    {/* Layer Number */}
                    <div className="flex-shrink-0 w-48 h-48 bg-accent/10 border border-accent rounded-8 flex items-center justify-center">
                      <span className="text-headline text-accent">{layer.number}</span>
                    </div>

                    {/* Layer Details */}
                    <div className="flex-1 space-y-8">
                      <div className="flex items-center gap-12">
                        <span className="text-subhead text-ink font-mono">{layer.mode}</span>
                        <span className="text-caption uppercase text-ink-subtle">mode</span>
                      </div>
                      <div className="flex items-center gap-12">
                        <span className="text-body text-ink-muted font-mono">{layer.skill}</span>
                        <span className="text-caption uppercase text-ink-subtle">skill</span>
                      </div>
                      <p className="text-body text-ink-muted pt-8">
                        {layer.output}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                {idx < LAYERS.length - 1 && (
                  <div className="flex justify-center py-12">
                    <svg className="w-24 h-24 text-hairline-strong" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MCP Tools */}
        <div className="space-y-24 pt-32 border-t border-hairline">
          <h2 className="text-headline text-ink">3 MCP Tools</h2>
          <div className="grid md:grid-cols-3 gap-24">
            {MCP_TOOLS.map((tool) => (
              <div
                key={tool.name}
                className={`bg-surface-1 border rounded-12 p-24 space-y-12 ${
                  tool.highlight ? "border-signal-danger" : "border-hairline"
                }`}
              >
                <div className="font-mono text-body text-ink">{tool.name}</div>
                <p className={`text-body ${tool.highlight ? "text-signal-danger" : "text-ink-muted"}`}>
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-surface-1 border border-hairline rounded-12 p-32 space-y-16">
          <h3 className="text-subhead text-ink">Why this architecture matters</h3>
          <p className="text-body text-ink-muted leading-relaxed">
            Traditional PR review tools are diff-bound — they only see what changed in this PR. Verdict's 6-layer pipeline mines git history (layer 4), runs mutation testing (layer 3), then uses the find_cross_layer_match MCP tool to connect surviving mutations to past incidents by file + line proximity. When a match exists, the killer line fires in the synthesis output.
          </p>
        </div>
      </div>
    </main>
  );
}

// Made with Bob
