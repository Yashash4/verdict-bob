type VerdictType = "DO NOT MERGE" | "REVIEW REQUIRED" | "LOOKS GOOD";

const verdictConfig = {
  "DO NOT MERGE": {
    emoji: "🔴",
    bgColor: "bg-red-950/50",
    borderColor: "border-red-600",
    textColor: "text-red-100",
  },
  "REVIEW REQUIRED": {
    emoji: "⚠️",
    bgColor: "bg-yellow-950/50",
    borderColor: "border-yellow-600",
    textColor: "text-yellow-100",
  },
  "LOOKS GOOD": {
    emoji: "✅",
    bgColor: "bg-green-950/50",
    borderColor: "border-green-600",
    textColor: "text-green-100",
  },
};

export default function VerdictBanner({ verdict }: { verdict: VerdictType }) {
  const config = verdictConfig[verdict];
  
  return (
    <div className={`p-6 ${config.bgColor} border-2 ${config.borderColor} rounded-lg mb-8`}>
      <div className="flex items-center gap-4">
        <div className="text-4xl">{config.emoji}</div>
        <div>
          <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">
            Verdict
          </div>
          <div className={`text-2xl font-bold ${config.textColor}`}>
            {verdict}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
