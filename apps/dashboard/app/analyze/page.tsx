"use client";

import { useState } from "react";
import Link from "next/link";
import LayerSimulation from "@/components/LayerSimulation";

const DEMO_PR_URL = "https://github.com/Yashash4/fastapi-tokenauth/pull/1";

const RESULT = {
  killerLine: "Surviving mutation M-1 is the same code path that caused INC-2024-0431",
  mutationId: "M-1",
  incidentId: "INC-2024-0431",
  file: "auth/tokens.py",
  line: 13,
  lineDistance: 0,
  verdict: "DO NOT MERGE",
  tldr: "This PR introduces verify_token_cached() with a 300-second TTL cache but no invalidation mechanism, amplifying the existing race condition from milliseconds to 5 minutes. Revoked tokens remain valid in cache for up to 300 seconds, creating a critical security gap across 3 production endpoints.",
  sections: [
    {
      key: "semantic",
      title: "Semantic Diff",
      number: "01",
      severity: "ATTENTION",
      content: [
        { type: "bullet", text: "New function verify_token_cached() wraps existing verify_token() with 300s TTL cache" },
        { type: "bullet", text: "Global mutable state _token_cache with no invalidation on revoke_token() calls" },
        { type: "bullet", text: "INC-2024-0431 race condition window extended from ms to 5 minutes" },
        { type: "bullet", text: "First cache implementation in codebase — no invalidation infrastructure exists" },
      ],
    },
    {
      key: "blast",
      title: "Blast Radius",
      number: "02",
      severity: "MEDIUM",
      content: [
        { type: "label", text: "Production callers of verify_token():" },
        { type: "code-warn", text: "api/v1/auth.py:53 — not updated to use cache" },
        { type: "code-warn", text: "api/v1/auth.py:61 — not updated to use cache" },
        { type: "code-warn", text: "api/v1/refresh.py:16 — not updated to use cache" },
        { type: "label", text: "Revocation endpoints:" },
        { type: "code-ok", text: "api/v1/auth.py:55 calls revoke_token()" },
        { type: "code-ok", text: "api/v1/refresh.py:18 calls revoke_token()" },
      ],
    },
    {
      key: "mutation",
      title: "Test Audit",
      number: "03",
      severity: "CRITICAL",
      content: [
        { type: "stat", label: "Mutation", value: "M-1" },
        { type: "stat", label: "Location", value: "auth/tokens.py:13" },
        { type: "stat", label: "Type", value: "removed_lock" },
        { type: "stat", label: "Kill rate", value: "0%" },
        { type: "bullet", text: "Missing SELECT FOR UPDATE lock in db.query()" },
        { type: "bullet", text: "No concurrent access validation in tests/test_auth.py" },
      ],
    },
    {
      key: "incident",
      title: "Incident History",
      number: "04",
      severity: "CRITICAL",
      content: [
        { type: "stat", label: "Incident", value: "INC-2024-0431" },
        { type: "stat", label: "Date", value: "2024-10-15" },
        { type: "stat", label: "Location", value: "auth/tokens.py:13" },
        { type: "stat", label: "Line distance to mutation", value: "0" },
        { type: "bullet", text: "Race condition in token verification — missing database lock" },
        { type: "bullet", text: "This PR introduces caching that preserves the unfixed race condition for 300s" },
      ],
    },
    {
      key: "questions",
      title: "Three Questions",
      number: "05",
      severity: "REVIEW",
      content: [
        { type: "question", n: "1", text: "Does verify_token_cached() invalidate cache when revoke_token() is called, given INC-2024-0431 occurred at this exact line?" },
        { type: "question", n: "2", text: "What prevents concurrent calls from creating duplicate cache entries when SELECT FOR UPDATE lock is missing?" },
        { type: "question", n: "3", text: "How will api/v1/refresh.py:16 handle tokens that exist in cache but have been invalidated in database?" },
      ],
    },
  ],
};

type Phase = "idle" | "analyzing" | "done";

export default function AnalyzePage() {
  const [phase, setPhase] = useState<Phase>("idle");

  const handleAnalyze = () => setPhase("analyzing");
  const handleComplete = () => setPhase("done");
  const reset = () => setPhase("idle");

  return (
    <main className="bg-canvas min-h-screen">
      {/* ───── Command Bar ───── */}
      <div className="sticky top-64 z-40 bg-canvas/80 backdrop-blur-md border-b border-hairline">
        <div className="max-w-[1152px] mx-auto px-32 py-16">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-8 px-12 py-6 bg-surface-1 border border-hairline rounded-6 flex-shrink-0">
              <span className="text-caption uppercase text-ink-subtle">verdict</span>
              <span className="text-ink-subtle">/</span>
              <span className="text-caption uppercase text-accent">analyze</span>
            </div>

            {/* Locked URL bar */}
            <div className="flex-1 flex items-center gap-12 px-12 py-8 bg-surface-1 border border-hairline rounded-8">
              <svg className="w-14 h-14 text-ink-subtle flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-caption uppercase text-ink-subtle flex-shrink-0">Demo PR</span>
              <div className="flex-1 flex items-center gap-8 min-w-0">
                <a
                  href={DEMO_PR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-body text-ink-muted hover:text-ink truncate transition-colors"
                  title={DEMO_PR_URL}
                >
                  {DEMO_PR_URL}
                </a>
              </div>
            </div>

            {phase === "done" ? (
              <button onClick={reset} className="px-16 py-8 border border-hairline rounded-8 text-body text-ink-muted hover:text-ink hover:border-hairline-strong transition-colors flex-shrink-0">
                Re-run
              </button>
            ) : (
              <button
                onClick={handleAnalyze}
                disabled={phase === "analyzing"}
                className="px-24 py-8 bg-ink text-canvas font-medium rounded-8 hover:bg-ink-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                {phase === "analyzing" ? "Running..." : "Analyze"}
              </button>
            )}
          </div>

          <div className="flex items-center gap-8 pt-8 text-caption text-ink-subtle">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>The dashboard demo is locked to one engineered PR. The CLI runs the same pipeline on any repo with INCIDENTS.md + mutmut.</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1152px] mx-auto px-32 py-48 space-y-48">
        {/* ───── IDLE: pre-analysis hint ───── */}
        {phase === "idle" && (
          <>
            <div className="space-y-24">
              <div className="text-caption uppercase text-ink-subtle">Pre-merge analysis</div>
              <h1 className="text-display-lg text-ink max-w-[800px]">
                Click Analyze. Watch Verdict refuse to let history repeat itself.
              </h1>
              <p className="text-body-lg text-ink-muted max-w-[640px]">
                The 6-layer pipeline will run against this PR. Three MCP tools will fire. The cross-layer match will produce the killer line.
              </p>
            </div>

            {/* What will run */}
            <div className="grid md:grid-cols-2 gap-16">
              <div className="bg-surface-1 border border-hairline rounded-12 p-24 space-y-16">
                <div className="text-caption uppercase text-ink-subtle">What will run</div>
                <div className="space-y-8 font-mono text-mono text-ink-muted">
                  <Step n="01" name="semantic" />
                  <Step n="02" name="blast" />
                  <Step n="03" name="mutation" />
                  <Step n="04" name="incident" />
                  <Step n="05" name="questions" />
                  <Step n="06" name="synthesis" />
                </div>
              </div>
              <div className="bg-surface-1 border border-hairline rounded-12 p-24 space-y-16">
                <div className="text-caption uppercase text-ink-subtle">MCP tools called</div>
                <div className="space-y-8 font-mono text-mono">
                  <div className="flex items-center gap-12 text-ink-muted"><Dot /> get_git_history</div>
                  <div className="flex items-center gap-12 text-ink-muted"><Dot /> find_incident_commits</div>
                  <div className="flex items-center gap-12 text-signal-danger"><Dot danger /> find_cross_layer_match</div>
                </div>
                <p className="text-body text-ink-subtle pt-8">
                  The third tool is where the killer line fires.
                </p>
              </div>
            </div>
          </>
        )}

        {/* ───── ANALYZING ───── */}
        {phase === "analyzing" && (
          <div className="space-y-32">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-12">
                <div className="w-8 h-8 rounded-full bg-signal-success pulse-dot" />
                <span className="text-caption uppercase text-ink-muted">Pipeline running</span>
              </div>
              <span className="font-mono text-mono text-ink-subtle truncate max-w-[60%]">{DEMO_PR_URL}</span>
            </div>
            <LayerSimulation onComplete={handleComplete} />
          </div>
        )}

        {/* ───── DONE: Results ───── */}
        {phase === "done" && (
          <div className="space-y-48">
            {/* Verdict banner */}
            <div className="bg-signal-danger/10 border border-signal-danger rounded-12 p-24 flex items-center gap-24">
              <div className="flex-shrink-0 w-48 h-48 rounded-full bg-signal-danger/20 border border-signal-danger flex items-center justify-center text-2xl">
                🔴
              </div>
              <div className="flex-1 space-y-4">
                <div className="text-caption uppercase text-signal-danger">Verdict</div>
                <div className="text-headline text-ink font-mono">DO NOT MERGE</div>
              </div>
              <div className="hidden md:flex flex-col items-end gap-4">
                <div className="text-caption uppercase text-ink-subtle">Analyzed</div>
                <div className="text-body text-ink-muted font-mono">PR #1 · fastapi-tokenauth</div>
              </div>
            </div>

            {/* Killer Line Callout */}
            <div className="relative">
              <div className="absolute inset-0 rounded-16 shadow-killer-glow animate-killer-glow" />
              <div className="relative bg-surface-1 border border-signal-danger rounded-16 p-48 space-y-20">
                <div className="flex items-center gap-12">
                  <span className="text-caption uppercase text-signal-danger">Cross-Layer Match Found</span>
                  <span className="w-4 h-4 rounded-full bg-signal-danger pulse-dot" />
                </div>
                <p className="text-display-md font-mono text-ink leading-tight">
                  Surviving mutation <span className="text-signal-danger">{RESULT.mutationId}</span> is the same code path that caused <span className="text-signal-danger">{RESULT.incidentId}</span>
                </p>
                <div className="flex flex-wrap items-center gap-x-32 gap-y-8 pt-8">
                  <Meta label="File" value={RESULT.file} />
                  <Meta label="Line" value={String(RESULT.line)} />
                  <Meta label="Line distance" value={String(RESULT.lineDistance)} />
                  <Meta label="MCP tool" value="find_cross_layer_match" mono />
                </div>
              </div>
            </div>

            {/* TL;DR */}
            <div className="bg-surface-1 border border-hairline rounded-12 p-32 space-y-16">
              <div className="flex items-center gap-12">
                <div className="text-caption uppercase text-ink-subtle">TL;DR</div>
                <div className="flex-1 h-px bg-hairline" />
              </div>
              <p className="text-body-lg text-ink leading-relaxed">{RESULT.tldr}</p>
            </div>

            {/* Section Cards */}
            <div className="space-y-24">
              {RESULT.sections.map((s) => (
                <div key={s.key} className="bg-surface-1 border border-hairline rounded-12 overflow-hidden">
                  <div className="px-32 py-16 border-b border-hairline flex items-center justify-between">
                    <div className="flex items-center gap-16">
                      <span className="font-mono text-caption text-ink-subtle">{s.number}</span>
                      <span className="text-headline text-ink">{s.title}</span>
                    </div>
                    <SeverityBadge level={s.severity} />
                  </div>
                  <div className="px-32 py-24 space-y-12">
                    {s.content.map((c: any, i: number) => {
                      if (c.type === "bullet")
                        return <div key={i} className="flex gap-12 text-body text-ink-muted"><span className="text-ink-subtle">·</span>{c.text}</div>;
                      if (c.type === "label")
                        return <div key={i} className="text-caption uppercase text-ink-subtle pt-8">{c.text}</div>;
                      if (c.type === "code-warn")
                        return <div key={i} className="flex items-center gap-12 font-mono text-mono"><span className="text-signal-warning">⚠</span><span className="text-ink-muted">{c.text}</span></div>;
                      if (c.type === "code-ok")
                        return <div key={i} className="flex items-center gap-12 font-mono text-mono"><span className="text-signal-success">✓</span><span className="text-ink-muted">{c.text}</span></div>;
                      if (c.type === "stat")
                        return (
                          <div key={i} className="flex items-baseline gap-16">
                            <span className="text-caption uppercase text-ink-subtle w-[180px] flex-shrink-0">{c.label}</span>
                            <span className="font-mono text-body text-ink">{c.value}</span>
                          </div>
                        );
                      if (c.type === "question")
                        return (
                          <div key={i} className="flex gap-16 py-8 border-t border-hairline first:border-t-0 first:pt-0">
                            <span className="font-mono text-body text-accent flex-shrink-0">Q{c.n}</span>
                            <p className="text-body text-ink-muted leading-relaxed">{c.text}</p>
                          </div>
                        );
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Closing actions */}
            <div className="flex flex-wrap items-center justify-between gap-16 pt-16 border-t border-hairline">
              <div className="text-body text-ink-subtle">
                Analysis complete · 6 layers · 3 MCP tools called · cross-layer match found
              </div>
              <div className="flex items-center gap-12">
                <Link href="/pipeline" className="px-16 py-8 border border-hairline rounded-8 text-body text-ink-muted hover:text-ink hover:border-hairline-strong transition-colors">
                  See architecture
                </Link>
                <button onClick={reset} className="px-16 py-8 bg-ink text-canvas font-medium rounded-8 hover:bg-ink-muted transition-colors">
                  Run again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Step({ n, name }: { n: string; name: string }) {
  return (
    <div className="flex items-center gap-12">
      <span className="text-ink-subtle">{n}</span>
      <span className="text-ink-muted">verdict-{name}</span>
    </div>
  );
}

function Dot({ danger }: { danger?: boolean } = {}) {
  return <span className={`w-8 h-8 rounded-full ${danger ? "bg-signal-danger pulse-dot" : "bg-ink-subtle"}`} />;
}

function Meta({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-caption uppercase text-ink-subtle">{label}</span>
      <span className={`text-body text-ink-muted ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

function SeverityBadge({ level }: { level: string }) {
  const map: Record<string, string> = {
    CRITICAL:  "bg-signal-danger/10 border-signal-danger text-signal-danger",
    MEDIUM:    "bg-signal-warning/10 border-signal-warning text-signal-warning",
    ATTENTION: "bg-accent/10 border-accent text-accent",
    REVIEW:    "bg-ink-subtle/10 border-ink-subtle text-ink-muted",
  };
  return (
    <span className={`px-12 py-4 text-caption uppercase border rounded-4 ${map[level] || map.REVIEW}`}>
      {level}
    </span>
  );
}
