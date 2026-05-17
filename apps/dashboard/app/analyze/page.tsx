"use client";

import { useState } from "react";
import KillerLineCallout from "@/components/KillerLineCallout";
import VerdictBanner from "@/components/VerdictBanner";
import LayerSimulation from "@/components/LayerSimulation";

const VALID_PR_URL = "https://github.com/Yashash4/fastapi-tokenauth/pull/1";

const ANALYSIS_DATA = {
  killerLine: "Surviving mutation M-1 is the same code path that caused INC-2024-0431",
  verdict: "DO NOT MERGE" as const,
  tldr: "This PR introduces verify_token_cached() with a 300-second TTL cache but no invalidation mechanism, amplifying the existing race condition from milliseconds to 5 minutes. Revoked tokens remain valid in cache for up to 300 seconds, creating a critical security gap across 3 production endpoints.",
  sections: [
    {
      title: "1. SEMANTIC DIFF",
      content: [
        "• New function: verify_token_cached() wraps existing verify_token() with 300-second TTL cache",
        "• Global mutable state: _token_cache dict with no invalidation on revoke_token() calls",
        "• Risk amplification: INC-2024-0431 race condition window extended from milliseconds to 5 minutes",
        "• No caching patterns: First cache implementation in codebase - no existing invalidation infrastructure"
      ]
    },
    {
      title: "2. BLAST RADIUS",
      content: [
        "Production callers of verify_token():",
        "• ⚠️ api/v1/auth.py:53 - not updated to use cache",
        "• ⚠️ api/v1/auth.py:61 - not updated to use cache",
        "• ⚠️ api/v1/refresh.py:16 - not updated to use cache",
        "",
        "Revocation endpoints:",
        "• ✓ api/v1/auth.py:55 calls revoke_token()",
        "• ✓ api/v1/refresh.py:18 calls revoke_token()",
        "",
        "Impact: MEDIUM - Core authentication flow affected, but cache not yet integrated into production endpoints."
      ]
    },
    {
      title: "3. TEST AUDIT",
      content: [
        "Mutation M-1 at auth/tokens.py:13 - CRITICAL severity",
        "• Description: Missing SELECT FOR UPDATE lock in db.query()",
        "• Test gap: No concurrent access validation in tests/test_auth.py",
        "• Kill rate: 0% - mutation survives all tests"
      ]
    },
    {
      title: "4. HISTORY",
      content: [
        "INC-2024-0431 - Race condition in token verification",
        "• Date: 2024-04-31",
        "• Location: auth/tokens.py:13 (exact line match, distance: 0)",
        "• Root cause: Missing database lock on token verification query",
        "• This PR: Introduces caching layer that preserves the unfixed race condition for 300 seconds"
      ]
    },
    {
      title: "5. THREE QUESTIONS",
      content: [
        "Q1: Does verify_token_cached() invalidate cache when revoke_token() is called, given INC-2024-0431 occurred at this exact line?",
        "",
        "Q2: What prevents concurrent calls to verify_token_cached() from creating duplicate cache entries when SELECT FOR UPDATE lock is missing?",
        "",
        "Q3: How will api/v1/refresh.py:16 handle tokens that exist in cache but have been invalidated in database?"
      ]
    }
  ]
};

export default function AnalyzePage() {
  const [prUrl, setPrUrl] = useState(VALID_PR_URL);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleAnalyze = () => {
    setShowError(false);
    
    if (prUrl !== VALID_PR_URL) {
      setShowError(true);
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);
  };

  const handleSimulationComplete = () => {
    setIsAnalyzing(false);
    setShowResults(true);
  };

  const loadDemoUrl = () => {
    setPrUrl(VALID_PR_URL);
    setShowError(false);
  };

  return (
    <main className="bg-canvas min-h-screen py-64">
      <div className="max-w-[1152px] mx-auto px-32 space-y-48">
        {/* Header */}
        <div className="space-y-16">
          <h1 className="text-display-md text-ink">Analyze PR</h1>
          <p className="text-body text-ink-muted max-w-[640px]">
            Enter a pull request URL to run Verdict's 6-layer analysis pipeline.
          </p>
        </div>

        {/* Input Section */}
        {!isAnalyzing && !showResults && (
          <div className="space-y-24">
            <div className="flex gap-12">
              <input
                type="text"
                value={prUrl}
                onChange={(e) => setPrUrl(e.target.value)}
                className="flex-1 px-16 py-12 bg-surface-1 border border-hairline rounded-8 text-body text-ink placeholder:text-ink-subtle focus:outline-none focus:border-accent transition-colors"
                placeholder="https://github.com/owner/repo/pull/123"
              />
              <button
                onClick={handleAnalyze}
                className="px-24 py-12 bg-accent hover:bg-accent-hover text-ink font-medium rounded-8 transition-colors"
              >
                Analyze
              </button>
            </div>

            {showError && (
              <div className="bg-surface-1 border border-hairline rounded-12 p-24 space-y-16">
                <p className="text-body text-ink-muted">
                  Live demo runs on a pre-engineered scenario. The full pipeline runs on any repo with INCIDENTS.md + mutmut via the CLI.
                </p>
                <div className="flex items-center gap-12">
                  <span className="text-body text-ink-subtle">Try the demo PR:</span>
                  <button
                    onClick={loadDemoUrl}
                    className="px-16 py-8 bg-accent hover:bg-accent-hover text-ink text-body rounded-6 transition-colors"
                  >
                    Load demo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Simulation */}
        {isAnalyzing && (
          <LayerSimulation onComplete={handleSimulationComplete} />
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-32">
            {/* Verdict Banner */}
            <VerdictBanner verdict={ANALYSIS_DATA.verdict} />

            {/* Killer Line Callout */}
            <KillerLineCallout text={ANALYSIS_DATA.killerLine} />

            {/* TL;DR */}
            <div className="bg-surface-1 border border-hairline rounded-12 p-32 space-y-16">
              <h2 className="text-headline text-ink">TL;DR</h2>
              <p className="text-body text-ink-muted leading-relaxed">
                {ANALYSIS_DATA.tldr}
              </p>
            </div>

            {/* Analysis Sections */}
            {ANALYSIS_DATA.sections.map((section, idx) => (
              <div key={idx} className="bg-surface-1 border border-hairline rounded-12 p-32 space-y-16">
                <h2 className="text-headline text-ink">{section.title}</h2>
                <div className="space-y-8 text-body text-ink-muted">
                  {section.content.map((line, lineIdx) => (
                    <p key={lineIdx} className={line.startsWith("•") ? "ml-16" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Analyze Another */}
            <div className="pt-32 border-t border-hairline">
              <button
                onClick={() => {
                  setShowResults(false);
                  setIsAnalyzing(false);
                }}
                className="px-24 py-12 bg-surface-1 hover:bg-surface-2 border border-hairline text-ink rounded-8 transition-colors"
              >
                Analyze another PR
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Made with Bob
