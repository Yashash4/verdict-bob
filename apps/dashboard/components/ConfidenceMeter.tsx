"use client";

import { useEffect, useState } from "react";

export default function ConfidenceMeter() {
  const [confidence, setConfidence] = useState(94);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;

    const duration = 3000; // 3 seconds
    const startValue = 94;
    const endValue = 12;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      const currentValue = Math.round(
        startValue - (startValue - endValue) * easedProgress
      );
      
      setConfidence(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animate();
  }, [isAnimating]);

  const getColor = () => {
    if (confidence > 70) return "text-green-500";
    if (confidence > 30) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">
        Analyzing PR
      </div>
      <div className={`text-7xl font-bold ${getColor()} transition-colors duration-300`}>
        {confidence}%
      </div>
      <div className="text-slate-500 text-sm">
        {isAnimating ? "Running 6-layer analysis..." : "Analysis complete"}
      </div>
      <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${
            confidence > 70 ? "bg-green-500" : confidence > 30 ? "bg-yellow-500" : "bg-red-500"
          } transition-all duration-300`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}

// Made with Bob
