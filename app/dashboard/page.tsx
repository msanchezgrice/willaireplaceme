"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskScoreCircle } from "@/components/risk-score-circle";
import { 
  ArrowLeft, 
  Plus, 
  Clock, 
  AlertTriangle,
  Calendar,
  TrendingUp,
  FileText
} from "lucide-react";

// Prevent static generation for this page
export const dynamic = 'force-dynamic';

interface UserReport {
  id: string;
  score: number;
  created_at: string;
  profile: {
    role: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    // TODO: Fetch user's reports from API
    // For now, we'll show a placeholder
    setLoading(false);
  }, [isSignedIn, isLoaded, router]);

  const getRiskLevel = (score: number) => {
    if (score <= 33) return { label: "Low Risk", color: "text-green-600", bgColor: "bg-green-100" };
    if (score <= 66) return { label: "Moderate Risk", color: "text-amber-600", bgColor: "bg-amber-100" };
    return { label: "High Risk", color: "text-red-600", bgColor: "bg-red-100" };
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.push('/')} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-xl font-bold text-slate-900">Your Dashboard</h1>
            </div>
            <Button onClick={() => router.push('/intake')}>
              <Plus className="w-4 h-4 mr-2" />
              New Assessment
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.firstName || 'there'}!
          </h2>
          <p className="text-slate-600">
            Track your AI career risk assessments and monitor changes over time.
          </p>
        </div>

        {/* Reports Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Your Assessments</h3>
            <div className="text-sm text-slate-500">
              {reports.length} assessment{reports.length !== 1 ? 's' : ''}
            </div>
          </div>

          {reports.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-slate-900 mb-2">No assessments yet</h4>
                <p className="text-slate-600 mb-6">
                  Get started by creating your first AI career risk assessment.
                </p>
                <Button onClick={() => router.push('/intake')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Start Assessment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => {
                const riskLevel = getRiskLevel(report.score);
                return (
                  <Card key={report.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{report.profile.role}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(report.created_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <RiskScoreCircle score={report.score} size={60} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <Badge 
                          variant="secondary" 
                          className={`${riskLevel.bgColor} ${riskLevel.color}`}
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {riskLevel.label}
                        </Badge>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Risk Score</span>
                          <span className="font-semibold">{report.score}/100</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => router.push(`/report?id=${report.id}&paid=true`)}
                        >
                          View Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {reports.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Latest Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {reports[0]?.score || 0}/100
                </div>
                <p className="text-sm text-slate-600">
                  {getRiskLevel(reports[0]?.score || 0).label}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total Assessments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                  {reports.length}
                </div>
                <p className="text-sm text-slate-600">
                  Career evaluations completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm text-slate-600">
                    Improving security
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 