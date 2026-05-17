export default function KillerLineCallout({ text }: { text: string }) {
  return (
    <div className="my-8 p-6 bg-red-950/30 border-2 border-red-600 rounded-lg animate-glow">
      <div className="flex items-start gap-4">
        <div className="text-3xl">⚠️</div>
        <div className="flex-1 space-y-2">
          <div className="inline-block px-3 py-1 bg-red-900/50 border border-red-700 rounded-full text-red-300 text-xs font-bold uppercase tracking-wider">
            Killer Line Detected
          </div>
          <p className="text-xl font-mono text-red-100 leading-relaxed">
            {text}
          </p>
          <p className="text-sm text-red-300/70">
            This mutation targets the exact code path that caused a past production incident.
          </p>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
