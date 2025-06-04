import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RiskScoreCircle } from "@/components/risk-score-circle";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  CheckCircle, 
  CreditCard, 
  Download, 
  FileText, 
  Lock, 
  Shield,
  AlertTriangle,
  Loader2
} from "lucide-react";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface AssessmentResult {
  id: number;
  riskScore: number;
  riskBreakdown: {
    taskAutomation: number;
    creativeRequirements: number;
    humanInteraction: number;
    strategicThinking: number;
  };
  timeline: string;
  previewRecommendations?: string;
  recommendations?: string;
  fullAnalysis?: string;
  hasFullReport: boolean;
}

const CheckoutForm = ({ assessmentId }: { assessmentId: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/${assessmentId}?success=true`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Lock className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-sm font-medium text-slate-700">Secure Payment</span>
        </div>
        <PaymentElement />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={!stripe || !elements || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4 mr-2" />
            Complete Purchase - $49
          </>
        )}
      </Button>
      
      <div className="text-center text-sm text-slate-500">
        <Shield className="w-4 h-4 inline mr-1" />
        Secured by Stripe • 30-day money-back guarantee
      </div>
    </form>
  );
};

export default function Checkout() {
  const [, params] = useRoute("/checkout/:assessmentId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const assessmentId = parseInt(params?.assessmentId || "0");

  // Check for payment success in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get('payment_intent');
    const success = urlParams.get('success');
    
    if (success === 'true' && paymentIntent) {
      // Handle successful payment
      apiRequest("POST", "/api/payment-success", { paymentIntentId: paymentIntent })
        .then(() => {
          setPaymentSucceeded(true);
          toast({
            title: "Payment Successful",
            description: "Thank you for your purchase! Your full report is now available.",
          });
        })
        .catch(() => {
          toast({
            title: "Payment Processing Error",
            description: "Payment was successful but there was an error processing your order. Please contact support.",
            variant: "destructive",
          });
        });
    }
  }, [toast]);

  const { data: assessment, isLoading: assessmentLoading } = useQuery<AssessmentResult>({
    queryKey: [`/api/assessments/${assessmentId}`],
    enabled: assessmentId > 0,
  });

  useEffect(() => {
    if (!assessment || assessment.hasFullReport || paymentSucceeded) {
      return;
    }

    // Create PaymentIntent when component loads
    apiRequest("POST", "/api/create-payment-intent", { assessmentId })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        toast({
          title: "Payment Setup Error",
          description: "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
      });
  }, [assessmentId, assessment, paymentSucceeded, toast]);

  if (assessmentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading assessment...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Assessment Not Found</h2>
              <p className="text-slate-600 mb-4">
                The assessment you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => setLocation('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (assessment.hasFullReport || paymentSucceeded) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-bold text-slate-900">Full Assessment Report</h1>
              <Button variant="ghost" onClick={() => setLocation('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <CardTitle className="text-2xl text-green-900">Report Ready!</CardTitle>
                  <CardDescription className="text-green-700">
                    Your complete AI risk assessment and recommendations are now available.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 pt-8">
              {/* Risk Score Display */}
              <div className="text-center">
                <RiskScoreCircle score={assessment.riskScore} size={160} />
                <div className="mt-4">
                  <Badge 
                    variant="secondary" 
                    className={
                      assessment.riskScore <= 33 ? "bg-green-100 text-green-800" :
                      assessment.riskScore <= 66 ? "bg-amber-100 text-amber-800" : 
                      "bg-red-100 text-red-800"
                    }
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {assessment.riskScore <= 33 ? "Low Risk" :
                     assessment.riskScore <= 66 ? "Moderate Risk" : "High Risk"}
                  </Badge>
                </div>
              </div>

              {/* Risk Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Detailed Risk Analysis</h3>
                {Object.entries(assessment.riskBreakdown).map(([key, value]) => {
                  const labels = {
                    taskAutomation: "Task Automation Risk",
                    creativeRequirements: "Creative Protection Score", 
                    humanInteraction: "Human Interaction Protection",
                    strategicThinking: "Strategic Thinking Protection"
                  };
                  
                  return (
                    <div key={key} className="bg-slate-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-700">
                          {labels[key as keyof typeof labels]}
                        </span>
                        <span className={`text-sm font-semibold ${
                          key === 'taskAutomation' ? 
                            (value >= 70 ? 'text-red-600' : value >= 40 ? 'text-amber-600' : 'text-green-600') :
                            (value <= 30 ? 'text-red-600' : value <= 60 ? 'text-amber-600' : 'text-green-600')
                        }`}>
                          {value}%
                        </span>
                      </div>
                      <div className="bg-slate-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            key === 'taskAutomation' ? 
                              (value >= 70 ? 'bg-red-500' : value >= 40 ? 'bg-amber-500' : 'bg-green-500') :
                              (value <= 30 ? 'bg-red-500' : value <= 60 ? 'bg-amber-500' : 'bg-green-500')
                          }`}
                          style={{width: `${value}%`}}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              {/* Timeline */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="font-semibold text-slate-900 mb-3">Timeline Assessment</h4>
                <p className="text-slate-700">{assessment.timeline}</p>
              </div>

              {/* Full Recommendations */}
              {assessment.recommendations && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Personalized Recommendations</h4>
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700">
                      {assessment.recommendations}
                    </div>
                  </div>
                </div>
              )}

              {/* Full Analysis */}
              {assessment.fullAnalysis && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Complete Analysis Report</h4>
                  <div className="prose prose-slate max-w-none">
                    <div className="whitespace-pre-wrap text-slate-700 bg-slate-50 rounded-lg p-6">
                      {assessment.fullAnalysis}
                    </div>
                  </div>
                </div>
              )}

              {/* Download Options */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </Button>
                <Button variant="outline" className="flex-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Email Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Setting up secure payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-slate-900">Complete Your Purchase</h1>
            <Button variant="ghost" onClick={() => setLocation('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Assessment Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Your Assessment Preview</CardTitle>
              <CardDescription>
                Upgrade to unlock the complete analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Risk Score */}
              <div className="text-center">
                <RiskScoreCircle score={assessment.riskScore} size={120} />
                <div className="mt-3">
                  <Badge 
                    variant="secondary"
                    className={
                      assessment.riskScore <= 33 ? "bg-green-100 text-green-800" :
                      assessment.riskScore <= 66 ? "bg-amber-100 text-amber-800" : 
                      "bg-red-100 text-red-800"
                    }
                  >
                    {assessment.riskScore <= 33 ? "Low Risk" :
                     assessment.riskScore <= 66 ? "Moderate Risk" : "High Risk"}
                  </Badge>
                </div>
              </div>

              {/* Basic Timeline */}
              <div className="text-center text-sm text-slate-600">
                <strong>Timeline:</strong> {assessment.timeline}
              </div>

              {/* Preview Text */}
              {assessment.previewRecommendations && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 text-sm">
                    {assessment.previewRecommendations}
                  </p>
                  <p className="text-slate-500 text-xs mt-2 italic">
                    Unlock full recommendations and detailed action plan...
                  </p>
                </div>
              )}

              {/* What's Included */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Full Report Includes:</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  {[
                    "Detailed AI impact timeline",
                    "Personalized mitigation strategies",
                    "Career pivot recommendations", 
                    "Skill development roadmap",
                    "Industry trend analysis",
                    "Actionable next steps",
                    "PDF download + email delivery"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Secure Checkout
              </CardTitle>
              <CardDescription>
                Get your complete AI risk assessment report for $49
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm assessmentId={assessmentId} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
