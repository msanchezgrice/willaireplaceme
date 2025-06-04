"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function AuthCallback() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      // Check for pending report ID
      const pendingReportId = sessionStorage.getItem('pendingReportId');
      
      if (pendingReportId) {
        // Clear the stored report ID
        sessionStorage.removeItem('pendingReportId');
        // Redirect to the report with paid access
        router.push(`/report?id=${pendingReportId}&paid=true`);
      } else {
        // No pending report, go to home
        router.push('/');
      }
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