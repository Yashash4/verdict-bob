"use client";

import { useEffect, useState } from "react";

interface LayerStep {
  timestamp: string;
  status: "running" | "complete" | "match";
  layer: string;
  message: string;
  confidence?: number;
}

const SIMULATION_STEPS: LayerStep[] = [
  { timestamp: "00:00.0", status: "running", layer: "Layer 1", message: "Semantic diff analysis...", confidence: 94 },
  { timestamp: "00:01.2", status: "complete", layer: "Layer 1", message: "complete (1.2s)", confidence: 87 },
  { timestamp: "00:01.2", status: "running", layer: "Layer 2", message: "Blast radius mapping...", confidence: 87 },
  { timestamp: "00:03.6", status: "complete", layer: "Layer 2", message: "complete (2.4s)", confidence: 71 },
  { timestamp: "00:03.6", status: "running", layer: "Layer 3", message: "Mutation audit (mutmut)...", confidence: 71 },
  { timestamp: "00:06.7", status: "complete", layer: "Layer 3", message: "complete (3.1s)", confidence: 52 },
  { timestamp: "00:06.7", status: "running", layer: "Layer 4", message: "Incident mining (git log + INCIDENTS.md)...", confidence: 52 },
  { timestamp: "00:08.5", status: "complete", layer: "Layer 4", message: "complete (1.8s)", confidence: 38 },
  { timestamp: "00:08.5", status: "running", layer: "MCP", message: "Calling find_cross_layer_match MCP tool...", confidence: 38 },
  { timestamp: "00:09.1", status: "match", layer: "MCP", message: "MATCH FOUND: M-1 ↔ INC-2024-0431", confidence: 22 },
  { timestamp: "00:09.1", status: "running", layer: "Layer 5", message: "Generating reviewer questions...", confidence: 22 },
  { timestamp: "00:10.6", status: "complete", layer: "Layer 5", message: "complete (1.5s)", confidence: 16 },
  { timestamp: "00:10.6", status: "running", layer: "Layer 6", message: "Synthesis...", confidence: 16 },
  { timestamp: "00:12.6", status: "complete", layer: "Layer 6", message: "complete (2.0s)", confidence: 12 },
];

export default function LayerSimulation({ onComplete }: { onComplete: () => void }) {
  const [visibleSteps, setVisibleSteps] = useState<LayerStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= SIMULATION_STEPS.length) {
      setTimeout(onComplete, 1000);
      return;
    }

    const delay = currentIndex === 0 ? 0 : 800; // 800ms between steps
    const timer = setTimeout(() => {
      setVisibleSteps((prev) => [...prev, SIMULATION_STEPS[currentIndex]]);
      setCurrentIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, onComplete]);

  const getStatusIcon = (status: string) => {
    if (status === "running") return "⏳";
    if (status === "complete") return "✓";
    if (status === "match") return "⚡";
    return "";
  };

  const getStatusColor = (status: string) => {
    if (status === "match") return "text-signal-danger";
    if (status === "complete") return "text-signal-success";
    return "text-ink-muted";
  };

  return (
    <div className="bg-surface-1 border border-hairline rounded-12 p-32 font-mono text-mono">
      <div className="space-y-8">
        {visibleSteps.map((step, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <span className="text-ink-subtle">[{step.timestamp}]</span>
              <span className={getStatusColor(step.status)}>{getStatusIcon(step.status)}</span>
              <span className={step.status === "match" ? "text-signal-danger font-semibold" : "text-ink"}>
                {step.layer} — {step.message}
              </span>
            </div>
            {step.confidence !== undefined && (
              <span className="text-ink-subtle">confidence: {step.confidence}%</span>
            )}
          </div>
        ))}
        {currentIndex >= SIMULATION_STEPS.length && (
          <div className="flex items-center gap-12 pt-16 border-t border-hairline mt-16">
            <span className="text-ink-subtle">[00:12.6]</span>
            <span className="text-signal-danger">🔴</span>
            <span className="text-signal-danger font-semibold">VERDICT: DO NOT MERGE</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Made with Bob
