"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, Shield, Mail, User } from "lucide-react";

// Prevent static generation for this page
export const dynamic = 'force-dynamic';

function PaywallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, user, isLoaded } = useUser();
  const assessmentId = searchParams.get('id');
  const [clerkError, setClerkError] = useState(false);

  useEffect(() => {
    // If user is already signed in, redirect to full report
    if (isSignedIn && assessmentId) {
      router.push(`/report?id=${assessmentId}&paid=true`);
    }
  }, [isSignedIn, assessmentId, router]);

  useEffect(() => {
    // Set a timeout to detect if Clerk isn't loading
    const timeout = setTimeout(() => {
      if (!isLoaded) {
        console.error('Clerk failed to load within 10 seconds');
        setClerkError(true);
      }
    }, 10000);

    if (isLoaded) {
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [isLoaded]);

  // Show error state if Clerk fails to load
  if (clerkError) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-bold text-slate-900">Complete Your Report</h1>
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Authentication Unavailable</CardTitle>
              <CardDescription className="text-lg">
                We&apos;re having trouble loading the sign-in system. Please try refreshing the page.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="space-y-4">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="w-full h-12 text-lg shadow-lg"
                >
                  Refresh Page
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/')}
                  className="w-full"
                >
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (isSignedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Welcome back!</h2>
            <p className="text-slate-600 mb-4">Redirecting you to your full report...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSignUp = () => {
    // Store the report ID for after signup
    if (assessmentId) {
      sessionStorage.setItem('pendingReportId', assessmentId);
    }
    router.push('/sign-up');
  };

  const handleSignIn = () => {
    // Store the report ID for after signin
    if (assessmentId) {
      sessionStorage.setItem('pendingReportId', assessmentId);
    }
    router.push('/sign-in');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-slate-900">Complete Your Report</h1>
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Unlock Your Complete Analysis</CardTitle>
            <CardDescription className="text-lg">
              Sign up with your email to get detailed insights, personalized recommendations, and actionable strategies
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Features List */}
            <div className="space-y-6">
              <h3 className="font-semibold text-lg text-slate-900">What&apos;s included in your full report:</h3>
              <div className="space-y-4">
                {[
                  "Detailed task-by-task AI impact analysis",
                  "Comprehensive timeline with milestone dates",
                  "Personalized career pivot recommendations",
                  "Specific skill development roadmap",
                  "Industry trend insights and predictions",
                  "Mitigation strategies for high-risk areas",
                  "PDF export for easy sharing and reference"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Auth Section */}
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-slate-900 mb-2">Free</div>
                <div className="text-slate-600">Just sign up with your email • Instant access</div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleSignUp} 
                  className="w-full h-12 text-lg shadow-lg"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Sign Up for Complete Report
                </Button>

                <div className="text-center text-sm text-slate-600">
                  Already have an account?{" "}
                  <button 
                    onClick={handleSignIn}
                    className="text-primary hover:text-primary/90 font-medium"
                  >
                    Sign in here
                  </button>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => router.push('/')}
                  className="w-full"
                >
                  Maybe Later
                </Button>
              </div>
            </div>

            {/* Security Note */}
            <div className="text-center text-sm text-slate-600">
              <div className="flex items-center justify-center">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                <span>Secure signup • No spam ever • Unsubscribe anytime</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Paywall() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    }>
      <PaywallContent />
    </Suspense>
  );
} 