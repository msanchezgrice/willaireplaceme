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
  FileText,
  Linkedin,
  Trash2,
  MoreHorizontal
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Prevent static generation for this page
export const dynamic = 'force-dynamic';

interface UserReport {
  id: string;
  score: number;
  created_at: string;
  profile: {
    role: string;
    careerCategory?: string;
    yearsExperience?: string;
    companySize?: string;
    dailyWorkSummary?: string;
    keySkills?: string;
    linkedinUrl?: string;
    hasLinkedinData?: boolean;
  };
  linkedin_data?: any; // LinkedIn profile data if available
}

export default function Dashboard() {
  const router = useRouter();
  const { isSignedIn, isLoaded, user } = useUser();
  const [reports, setReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push('/sign-in');
      return;
    }

    // Fetch user's reports from API
    const fetchReports = async () => {
      try {
        console.log('📊 [Dashboard] Fetching user reports...');
        const response = await fetch('/api/user-reports');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch reports: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ [Dashboard] Reports fetched:', data.reports?.length || 0);
        setReports(data.reports || []);
      } catch (err) {
        console.error('❌ [Dashboard] Error fetching reports:', err);
        setError(err instanceof Error ? err.message : 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isSignedIn, isLoaded, router]);

  const getRiskLevel = (score: number) => {
    if (score <= 33) return { label: "Low Risk", color: "text-green-600", bgColor: "bg-green-100" };
    if (score <= 66) return { label: "Moderate Risk", color: "text-amber-600", bgColor: "bg-amber-100" };
    return { label: "High Risk", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const handleDeleteReport = async (reportId: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete report');
      }

      // Remove the report from the local state
      setReports(reports.filter(report => report.id !== reportId));
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteDialog = (reportId: string) => {
    setReportToDelete(reportId);
    setDeleteDialogOpen(true);
  };

  // Extract the best available profile information from LinkedIn, resume, or latest assessment
  const getProfileInfo = () => {
    if (reports.length === 0) return null;

    // Try to find the most recent report with LinkedIn data first
    const linkedinReport = reports.find(r => r.profile.hasLinkedinData);
    const latestReport = reports[0];
    
    // Use LinkedIn data if available, otherwise fallback to latest report
    const sourceReport = linkedinReport || latestReport;
    
    let profileInfo = {
      currentRole: sourceReport.profile.role || 'Not specified',
      yearsExperience: sourceReport.profile.yearsExperience || 'Not specified',
      companySize: sourceReport.profile.companySize || 'Not specified',
      keySkills: sourceReport.profile.keySkills || 'Not specified',
      dailyWorkSummary: sourceReport.profile.dailyWorkSummary || 'Not specified'
    };

    // If we have LinkedIn data, try to extract more specific information
    if (sourceReport.profile.hasLinkedinData && sourceReport.linkedin_data) {
      const linkedinData = sourceReport.linkedin_data;
      
      // Update with LinkedIn-specific data if available
      if (linkedinData.currentTitle) {
        profileInfo.currentRole = linkedinData.currentTitle;
      }
      if (linkedinData.yearsExperience) {
        profileInfo.yearsExperience = linkedinData.yearsExperience;
      }
      if (linkedinData.skills && Array.isArray(linkedinData.skills)) {
        profileInfo.keySkills = linkedinData.skills.slice(0, 5).join(', ');
      }
      if (linkedinData.dailyTasks) {
        profileInfo.dailyWorkSummary = linkedinData.dailyTasks;
      }
      if (linkedinData.companySize) {
        profileInfo.companySize = linkedinData.companySize;
      }
    }

    return profileInfo;
  };

  const profileInfo = getProfileInfo();

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

  if (error) {
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
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Unable to Load Reports</h2>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
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
              <Button onClick={() => router.push('/intake?from=dashboard')}>
                <Plus className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Welcome & Profile Summary Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome back, {user?.firstName || 'there'}!
            </h2>
            <p className="text-slate-600 mb-6">
              Track your AI career risk assessments and monitor changes over time.
            </p>

            {/* User Profile Summary Cards */}
            {reports.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Current Role</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold text-slate-900">
                      {profileInfo?.currentRole}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {reports[0]?.profile.careerCategory ? reports[0].profile.careerCategory.replace('-', ' ') : 'Latest assessment'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Experience Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold text-slate-900">
                      {profileInfo?.yearsExperience}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Years of experience</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">Company Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold text-slate-900 capitalize">
                      {profileInfo?.companySize}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Organization type</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-600">AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold text-slate-900">
                      {reports.filter(r => r.profile.hasLinkedinData).length}/{reports.length}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">With LinkedIn data</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Key Skills and Work Summary for Latest Assessment */}
            {reports.length > 0 && profileInfo && (profileInfo.keySkills !== 'Not specified' || profileInfo.dailyWorkSummary !== 'Not specified') && (
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                {profileInfo.keySkills !== 'Not specified' && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-slate-600">Your Key Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {profileInfo?.keySkills}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {profileInfo.dailyWorkSummary !== 'Not specified' && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-slate-600">Your Daily Work</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {profileInfo?.dailyWorkSummary}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Assessments Section */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Career Risk Reports</h3>
              <span className="text-sm text-slate-600">{reports.length} assessment{reports.length !== 1 ? 's' : ''}</span>
            </div>

            {reports.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-slate-900 mb-2">No assessments yet</h4>
                  <p className="text-slate-600 mb-6">
                    Get started by creating your first AI career risk assessment.
                  </p>
                  <Button onClick={() => router.push('/intake?from=dashboard')}>
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
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{report.profile.role}</CardTitle>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/report?id=${report.id}&paid=true&from=dashboard`)}
                                  >
                                    <FileText className="mr-2 h-4 w-4" />
                                    View Report
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => openDeleteDialog(report.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <CardDescription className="flex items-center mt-1">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(report.created_at).toLocaleDateString()}
                            </CardDescription>
                            
                            {/* Enhanced Profile Information */}
                            <div className="mt-3 space-y-1 text-xs text-slate-600">
                              {report.profile.careerCategory && (
                                <div>Category: {report.profile.careerCategory}</div>
                              )}
                              {report.profile.yearsExperience && (
                                <div>Experience: {report.profile.yearsExperience}</div>
                              )}
                              {report.profile.companySize && (
                                <div>Company: {report.profile.companySize}</div>
                              )}
                              {report.profile.hasLinkedinData && (
                                <div className="flex items-center text-blue-600">
                                  <Linkedin className="w-3 h-3 mr-1" />
                                  LinkedIn analyzed
                                </div>
                              )}
                            </div>
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
                          
                          {/* Daily Work Summary Preview */}
                          {report.profile.dailyWorkSummary && (
                            <div className="text-xs text-slate-600">
                              <div className="font-medium mb-1">Daily Work:</div>
                              <div className="overflow-hidden" style={{ 
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                              }}>
                                {report.profile.dailyWorkSummary.substring(0, 100)}
                                {report.profile.dailyWorkSummary.length > 100 && '...'}
                              </div>
                            </div>
                          )}
                          
                          {/* Key Skills */}
                          {report.profile.keySkills && (
                            <div className="text-xs text-slate-600">
                              <div className="font-medium mb-1">Key Skills:</div>
                              <div className="truncate">
                                {report.profile.keySkills.substring(0, 80)}
                                {report.profile.keySkills.length > 80 && '...'}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between text-sm pt-2 border-t">
                            <span className="text-slate-600">Risk Score</span>
                            <span className="font-semibold">{report.score}/100</span>
                          </div>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Assessment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this assessment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => reportToDelete && handleDeleteReport(reportToDelete)}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
} 