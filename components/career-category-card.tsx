"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ArrowRight } from "lucide-react";

interface CareerCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  averageRisk: number;
  assessmentCount: number;
}

interface CareerCategoryCardProps {
  category: CareerCategory;
}

export function CareerCategoryCard({ category }: CareerCategoryCardProps) {
  const getRiskColor = (risk: number) => {
    if (risk <= 33) return "text-green-600";
    if (risk <= 66) return "text-amber-600";
    return "text-red-600";
  };

  const getRiskBgColor = (risk: number) => {
    if (risk <= 33) return "bg-green-100";
    if (risk <= 66) return "bg-amber-100"; 
    return "bg-red-100";
  };

  const getIconComponent = (iconName: string) => {
    const iconClass = "w-6 h-6";
    
    // Map icon names to actual icon components
    const iconMap: Record<string, JSX.Element> = {
      palette: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v6a2 2 0 002 2h4a2 2 0 002-2V5zM21 15a2 2 0 00-2-2h-4a2 2 0 00-2 2v2a2 2 0 002 2h4a2 2 0 002-2v-2z" />
        </svg>
      ),
      "clipboard-list": (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      bullhorn: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      calculator: (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      "balance-scale": (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    };

    return iconMap[iconName] || iconMap.palette;
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-primary rounded-lg">
            {getIconComponent(category.icon)}
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getRiskColor(category.averageRisk)}`}>
              {category.averageRisk}
            </div>
            <div className="text-xs text-slate-500">Avg Risk</div>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-slate-900 mb-2">{category.name}</h3>
        <p className="text-slate-600 mb-4 text-sm">{category.description}</p>
        
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <Users className="w-4 h-4 mr-2" />
          <span>{category.assessmentCount.toLocaleString()} assessments</span>
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href="/intake">
            <Button className="w-full">
              Assess {category.name} Role
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
