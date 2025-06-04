import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RiskScoreCircleProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function RiskScoreCircle({ 
  score, 
  size = 120, 
  strokeWidth = 8,
  className 
}: RiskScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreColor = (score: number) => {
    if (score <= 33) return "#10B981"; // green
    if (score <= 66) return "#F59E0B"; // amber  
    return "#EF4444"; // red
  };

  const getScoreLabel = (score: number) => {
    if (score <= 33) return "Low Risk";
    if (score <= 66) return "Moderate Risk";
    return "High Risk";
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getScoreColor(score)}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-2000 ease-out"
        />
      </svg>
      
      {/* Score text overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div 
            className="text-3xl font-bold transition-colors duration-500"
            style={{ color: getScoreColor(score) }}
          >
            {Math.round(animatedScore)}
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Risk Score
          </div>
        </div>
      </div>
    </div>
  );
}
