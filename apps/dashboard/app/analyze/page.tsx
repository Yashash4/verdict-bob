"use client";

import { useState } from "react";
import KillerLineCallout from "@/components/KillerLineCallout";
import VerdictBanner from "@/components/VerdictBanner";
import ConfidenceMeter from "@/components/ConfidenceMeter";

// Hardcoded analysis data from demo/hero-pr-result.md
const ANALYSIS_DATA = {
  prUrl: "https://github.com/Yashash4/fastapi-tokenauth/pull/1",
  killerLine: "Surviving mutation M-1 is the same code path that caused INC-2024-0431",
  verdict: "DO NOT MERGE" as const,
  tldr: "Surviving mutation M-1 is the same code path that caused INC-2024-0431. This PR introduces verify_token_cached() with a 300-second TTL cache but no invalidation mechanism, amplifying the existing race condition from milliseconds to 5 minutes. Revoked tokens remain valid in cache for up to 300 seconds, creating a critical security gap across 3 production endpoints.",
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
  const [prUrl, setPrUrl] = useState(ANALYSIS_DATA.prUrl);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setShowResults(false);
    
    // Show results after 3 seconds (animation duration)
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-100">Verdict Analysis</h1>
          <p className="text-slate-400">CodeRabbit reviews the diff. Verdict reviews the decision.</p>
        </div>

        {/* PR URL Input */}
        {!isAnalyzing && !showResults && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 space-y-4">
            <label className="block text-sm font-semibold text-slate-300">
              Pull Request URL
            </label>
            <input
              type="text"
              value={prUrl}
              onChange={(e) => setPrUrl(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-red-600 transition-colors"
              placeholder="https://github.com/owner/repo/pull/123"
            />
            <button
              onClick={handleAnalyze}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Analyze PR
            </button>
          </div>
        )}

        {/* Analyzing State */}
        {isAnalyzing && (
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8">
            <ConfidenceMeter />
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Verdict Banner */}
            <VerdictBanner verdict={ANALYSIS_DATA.verdict} />

            {/* TL;DR with Killer Line */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 space-y-4">
              <h2 className="text-2xl font-bold text-slate-100">TL;DR</h2>
              <KillerLineCallout text={ANALYSIS_DATA.killerLine} />
              <p className="text-slate-300 leading-relaxed">
                {ANALYSIS_DATA.tldr}
              </p>
            </div>

            {/* Analysis Sections */}
            {ANALYSIS_DATA.sections.map((section, idx) => (
              <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 space-y-4">
                <h2 className="text-xl font-bold text-slate-100">{section.title}</h2>
                <div className="space-y-2 text-slate-300">
                  {section.content.map((line, lineIdx) => (
                    <p key={lineIdx} className={line.startsWith("•") ? "ml-4" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            {/* Analyze Another Button */}
            <div className="text-center pt-8">
              <button
                onClick={() => {
                  setShowResults(false);
                  setIsAnalyzing(false);
                }}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg transition-colors"
              >
                Analyze Another PR
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// Made with Bob
