type VerdictType = "DO NOT MERGE" | "REVIEW REQUIRED" | "LOOKS GOOD";

const verdictConfig = {
  "DO NOT MERGE": {
    emoji: "🔴",
    bgColor: "bg-signal-danger/10",
    borderColor: "border-signal-danger",
    textColor: "text-signal-danger",
  },
  "REVIEW REQUIRED": {
    emoji: "⚠️",
    bgColor: "bg-signal-warning/10",
    borderColor: "border-signal-warning",
    textColor: "text-signal-warning",
  },
  "LOOKS GOOD": {
    emoji: "✅",
    bgColor: "bg-signal-success/10",
    borderColor: "border-signal-success",
    textColor: "text-signal-success",
  },
};

export default function VerdictBanner({ verdict }: { verdict: VerdictType }) {
  const config = verdictConfig[verdict];
  
  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-12 p-24`}>
      <div className="flex items-center gap-16">
        <div className="text-[32px]">{config.emoji}</div>
        <div>
          <div className="text-caption uppercase text-ink-subtle">
            Verdict
          </div>
          <div className={`text-headline ${config.textColor}`}>
            {verdict}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
