"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full space-y-12 text-center">
        {/* Logo/Title */}
        <div className="space-y-4">
          <h1 className="text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Verdict
            </span>
          </h1>
          <p className="text-2xl text-slate-400 font-light">
            CodeRabbit reviews the diff. Verdict reviews the decision.
          </p>
        </div>

        {/* Killer Line Teaser */}
        <div className="bg-slate-900/50 border border-red-900/30 rounded-lg p-8 backdrop-blur-sm">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 bg-red-950/50 border border-red-800/50 rounded-full text-red-400 text-sm font-mono">
              THE KILLER LINE
            </div>
            <p className="text-xl text-slate-300 font-mono leading-relaxed">
              "Surviving mutation M-1 is the same code path that caused INC-2024-0431"
            </p>
            <p className="text-slate-500 text-sm">
              Cross-temporal insight no diff-bound tool can produce
            </p>
          </div>
        </div>

        {/* Value Props */}
        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 space-y-2">
            <div className="text-3xl">🔍</div>
            <h3 className="text-lg font-semibold text-slate-200">Semantic Analysis</h3>
            <p className="text-sm text-slate-400">
              Identifies meaningful code changes, not just line diffs
            </p>
          </div>
          <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 space-y-2">
            <div className="text-3xl">🧬</div>
            <h3 className="text-lg font-semibold text-slate-200">Mutation Testing</h3>
            <p className="text-sm text-slate-400">
              Finds test gaps that survive in changed code
            </p>
          </div>
          <div className="bg-slate-900/30 border border-slate-800 rounded-lg p-6 space-y-2">
            <div className="text-3xl">⏳</div>
            <h3 className="text-lg font-semibold text-slate-200">Incident Mining</h3>
            <p className="text-sm text-slate-400">
              Connects current changes to past production incidents
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-8">
          <Link
            href="/analyze"
            className="inline-block px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-red-900/50"
          >
            Try Verdict
          </Link>
        </div>

        {/* Footer */}
        <div className="pt-12 text-slate-600 text-sm">
          <p>Powered by IBM Bob • Built for IBM Bob Hackathon 2026</p>
        </div>
      </div>
    </main>
  );
}

// Made with Bob
