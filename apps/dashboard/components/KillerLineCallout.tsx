export default function KillerLineCallout({ text }: { text: string }) {
  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-16 shadow-killer-glow animate-killer-glow" />
      
      {/* Content */}
      <div className="relative bg-surface-1 border border-signal-danger rounded-16 p-32 space-y-16">
        <div className="text-caption uppercase text-signal-danger">
          Cross-Layer Match Found
        </div>
        <p className="text-display-md font-mono text-ink leading-tight">
          {text}
        </p>
        <p className="text-body text-ink-muted">
          Surviving mutation × past incident — no diff-bound tool produces this
        </p>
      </div>
    </div>
  );
}

// Made with Bob
