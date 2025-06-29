"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

// Prevent static generation for this page
export const dynamic = 'force-dynamic';

export default function AuthCallback() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      // Check for pending report ID first
      const pendingReportId = sessionStorage.getItem('pendingReportId');
      
      if (pendingReportId) {
        // Clear the stored report ID
        sessionStorage.removeItem('pendingReportId');
        // Redirect to the report with paid access
        router.push(`/report?id=${pendingReportId}&paid=true`);
        return;
      }

      // Check if user has recent reports to determine if first time user
      const checkUserReports = async () => {
        try {
          const response = await fetch('/api/user-reports');
          if (response.ok) {
            const data = await response.json();
            const reports = data.reports || [];
            
            // If user has reports from today (likely just completed assessment), go to latest report
            const today = new Date().toDateString();
            const todaysReports = reports.filter((report: any) => 
              new Date(report.created_at).toDateString() === today
            );
            
            if (todaysReports.length > 0) {
              // User just completed an assessment, show them their latest report
              const latestReport = todaysReports[0];
              router.push(`/report?id=${latestReport.id}&paid=true&from=signin`);
            } else {
              // Existing user, go to dashboard
              router.push('/dashboard');
            }
          } else {
            // API call failed, default to dashboard
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Error checking user reports:', error);
          // Default to dashboard on error
          router.push('/dashboard');
        }
      };

      // Small delay to ensure user is fully authenticated
      setTimeout(checkUserReports, 500);
    } else {
      // Not signed in, redirect to home
      router.push('/');
    }
  }, [isSignedIn, isLoaded, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-600">Completing your sign-in...</p>
      </div>
    </div>
  );
} 