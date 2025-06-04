"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowLeft, CreditCard, Shield } from "lucide-react";

function PaywallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get('id');
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!assessmentId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId })
      });

      if (!response.ok) {
        throw new Error('Payment setup failed');
      }

      const { clientSecret } = await response.json();
      
      // In a real implementation, you'd integrate with Stripe Elements here
      // For now, simulate payment success
      setTimeout(() => {
        fetch('/api/payment-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: 'pi_mock_success' })
        });
        
        // Redirect to full report
        router.push(`/report?id=${assessmentId}&paid=true`);
      }, 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      setIsLoading(false);
    }
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
              Get detailed insights, personalized recommendations, and actionable strategies
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

            {/* Pricing */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-slate-900 mb-2">$49</div>
              <div className="text-slate-600">One-time payment • Instant access</div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                onClick={handlePurchase} 
                className="w-full h-12 text-lg shadow-lg"
                disabled={isLoading || !assessmentId}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Get Complete Report Now
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="w-full"
                disabled={isLoading}
              >
                Maybe Later
              </Button>
            </div>

            {/* Security Note */}
            <div className="text-center text-sm text-slate-600">
              <div className="flex items-center justify-center">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                <span>Secure payment • 30-day money-back guarantee</span>
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
    <Suspense fallback={<div>Loading...</div>}>
      <PaywallContent />
    </Suspense>
  );
} 