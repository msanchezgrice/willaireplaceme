"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RiskScoreCircleProps {
  score: number;
  size?: number;
  className?: string;
}

export function RiskScoreCircle({ 
  score, 
  size = 120, 
  className 
}: RiskScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - 8) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score <= 33) return "text-green-600 stroke-green-600";
    if (score <= 66) return "text-amber-600 stroke-amber-600";
    return "text-red-600 stroke-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score <= 33) return "Low Risk";
    if (score <= 66) return "Moderate Risk";
    return "High Risk";
  };

  return (
    <div 
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-slate-200"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-out", getScoreColor(score))}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={cn("text-2xl font-bold", getScoreColor(score))}>
          {Math.round(animatedScore)}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {getScoreLabel(score)}
        </div>
      </div>
    </div>
  );
}
