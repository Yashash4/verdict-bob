"use client";

import { useEffect, useState } from "react";

interface Step {
  ts: string;
  status: "running" | "done" | "match" | "verdict";
  label: string;
  conf: number;
}

const STEPS: Step[] = [
  { ts: "00:00.0", status: "running", label: "semantic diff", conf: 94 },
  { ts: "00:01.2", status: "done",    label: "semantic diff ✓", conf: 87 },
  { ts: "00:01.2", status: "running", label: "blast radius", conf: 87 },
  { ts: "00:03.6", status: "done",    label: "blast radius ✓", conf: 71 },
  { ts: "00:03.6", status: "running", label: "mutation audit (mutmut)", conf: 71 },
  { ts: "00:06.7", status: "done",    label: "mutation audit ✓", conf: 52 },
  { ts: "00:06.7", status: "running", label: "incident mining (INCIDENTS.md)", conf: 52 },
  { ts: "00:08.5", status: "done",    label: "incident mining ✓", conf: 38 },
  { ts: "00:08.5", status: "running", label: "find_cross_layer_match", conf: 38 },
  { ts: "00:09.1", status: "match",   label: "⚡ MATCH FOUND: M-1 ↔ INC-2024-0431", conf: 22 },
  { ts: "00:12.6", status: "verdict", label: "🔴 VERDICT: DO NOT MERGE", conf: 12 },
];

export default function HeroTerminal() {
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (idx >= STEPS.length) {
      setDone(true);
      return;
    }
    const delay = idx === 0 ? 400 : idx === STEPS.length - 1 ? 1200 : 550;
    const t = setTimeout(() => setIdx(idx + 1), delay);
    return () => clearTimeout(t);
  }, [idx]);

  const visible = STEPS.slice(0, idx);

  return (
    <div className="bg-surface-1 border border-hairline rounded-12 overflow-hidden shadow-card">
      {/* Terminal Chrome */}
      <div className="flex items-center justify-between px-16 py-12 border-b border-hairline bg-surface-2">
        <div className="flex items-center gap-8">
          <div className="w-12 h-12 rounded-full bg-signal-danger/60" />
          <div className="w-12 h-12 rounded-full bg-signal-warning/60" />
          <div className="w-12 h-12 rounded-full bg-signal-success/60" />
        </div>
        <div className="font-mono text-[11px] text-ink-subtle tracking-wide">
          verdict /analyze · github.com/Yashash4/fastapi-tokenauth/pull/1
        </div>
        <div className="flex items-center gap-8">
          {!done && (
            <>
              <div className="w-8 h-8 rounded-full bg-signal-success pulse-dot" />
              <span className="font-mono text-[11px] text-ink-subtle">LIVE</span>
            </>
          )}
          {done && (
            <>
              <div className="w-8 h-8 rounded-full bg-signal-danger" />
              <span className="font-mono text-[11px] text-signal-danger">FAILED</span>
            </>
          )}
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-24 font-mono text-mono terminal-grid min-h-[340px]">
        <div className="space-y-6">
          <div className="flex items-center gap-12 text-ink-subtle">
            <span className="text-accent">$</span>
            <span>verdict --pr https://github.com/Yashash4/fastapi-tokenauth/pull/1</span>
          </div>
          <div className="text-ink-subtle pb-12">
            Running 6-layer pipeline · 3 MCP tools · cross-layer match enabled
          </div>

          {visible.map((s, i) => {
            const color =
              s.status === "match" || s.status === "verdict"
                ? "text-signal-danger"
                : s.status === "done"
                ? "text-signal-success"
                : "text-ink-muted";
            const weight = s.status === "match" || s.status === "verdict" ? "font-semibold" : "";
            return (
              <div key={i} className="flex items-center justify-between gap-16">
                <div className="flex items-center gap-12 min-w-0">
                  <span className="text-ink-subtle text-[12px] flex-shrink-0">[{s.ts}]</span>
                  <span className={`${color} ${weight} truncate`}>{s.label}</span>
                </div>
                <span className="text-ink-subtle text-[12px] flex-shrink-0">
                  conf {s.conf}%
                </span>
              </div>
            );
          })}

          {!done && idx < STEPS.length && (
            <div className="flex items-center gap-12 pt-4">
              <span className="text-accent">▸</span>
              <span className="text-ink-subtle">
                {idx > 0 ? "..." : "initializing..."}
                <span className="inline-block w-8 h-16 bg-accent/60 ml-4 align-middle pulse-dot" />
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
