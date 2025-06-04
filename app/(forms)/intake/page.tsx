"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RiskScoreCircle } from "@/components/risk-score-circle";
import { 
  ArrowLeft, 
  ArrowRight, 
  Bot, 
  CheckCircle, 
  Clock, 
  Shield, 
  AlertTriangle,
  FileText,
  CreditCard
} from "lucide-react";

const assessmentSchema = z.object({
  careerCategory: z.string().min(1, "Please select a career category"),
  jobTitle: z.string().min(1, "Please enter your job title"),
  yearsExperience: z.string().min(1, "Please select your experience level"),
  companySize: z.string().optional(),
  dailyWorkSummary: z.string().min(50, "Please provide at least 50 characters describing your daily work"),
  keySkills: z.string().optional(),
});

type AssessmentFormData = z.infer<typeof assessmentSchema>;

interface AssessmentResult {
  id: string;
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
  hasFullReport: boolean;
}

export default function Intake() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      careerCategory: "",
      jobTitle: "",
      yearsExperience: "",
      companySize: "",
      dailyWorkSummary: "",
      keySkills: "",
    },
  });

  const onSubmit = async (data: AssessmentFormData) => {
    setIsAnalyzing(true);
    setCurrentStep(4);
    
    // Simulate analysis steps
    const steps = [
      "Processing your profile information",
      "Researching AI developments in your field", 
      "Calculating risk factors and timeline",
      "Generating personalized recommendations"
    ];
    
    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      setAnalysisStep(stepIndex);
      stepIndex++;
      if (stepIndex > steps.length) {
        clearInterval(stepInterval);
      }
    }, 1500);

    try {
      // Convert form data to match API expectations
      const taskHours = {
        [data.jobTitle]: 40 // Default weekly hours
      };

      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: data.jobTitle,
          tasks: taskHours,
          resume: uploadedFile ? await uploadedFile.text() : data.dailyWorkSummary
        })
      });

      if (!response.ok) {
        throw new Error('Assessment submission failed');
      }

      const { profile_id } = await response.json();
      
      // Poll for results
      const pollResults = async () => {
        const reportResponse = await fetch(`/api/reports/${profile_id}`);
        if (reportResponse.ok) {
          const reportData = await reportResponse.json();
          setResult({
            id: profile_id,
            riskScore: reportData.score || 50,
            riskBreakdown: {
              taskAutomation: 70,
              creativeRequirements: 30,
              humanInteraction: 20,
              strategicThinking: 40
            },
            timeline: "2-4 years",
            previewRecommendations: reportData.preview,
            hasFullReport: false
          });
          setCurrentStep(5);
          setIsAnalyzing(false);
          clearInterval(stepInterval);
        } else {
          // Continue polling
          setTimeout(pollResults, 2000);
        }
      };

      setTimeout(pollResults, 6000);
    } catch (error) {
      console.error('Assessment failed:', error);
      setIsAnalyzing(false);
      clearInterval(stepInterval);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 3) {
      form.handleSubmit(onSubmit)();
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Basic Information";
      case 2: return "Work Details"; 
      case 3: return "Resume & Review";
      case 4: return "AI Analysis";
      case 5: return "Your Risk Assessment";
      default: return "";
    }
  };

  const getProgressValue = () => {
    return (currentStep / 5) * 100;
  };

  const getRiskLevel = (score: number) => {
    if (score <= 33) return { label: "Low Risk", color: "text-green-600", bgColor: "bg-green-100" };
    if (score <= 66) return { label: "Moderate Risk", color: "text-amber-600", bgColor: "bg-amber-100" };
    return { label: "High Risk", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const analysisSteps = [
    "Processing your profile information",
    "Researching AI developments in your field",
    "Calculating risk factors and timeline", 
    "Generating personalized recommendations"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-slate-900">AI Risk Assessment</h1>
            <Button variant="ghost" onClick={() => router.push('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-2xl">{getStepTitle()}</CardTitle>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div
                    key={step}
                    className={`w-3 h-3 rounded-full ${
                      step < currentStep ? 'bg-green-500' : 
                      step === currentStep ? 'bg-primary' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <Progress value={getProgressValue()} className="h-2" />
          </CardHeader>

          <CardContent>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="careerCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Career Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your career category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="designer">Designer</SelectItem>
                            <SelectItem value="product-manager">Product Manager</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="accounting">Accounting</SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Senior UX Designer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="yearsExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Years of Experience</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select experience level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0-1">Less than 1 year</SelectItem>
                            <SelectItem value="1-3">1-3 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5-10">5-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companySize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Size (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select company size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="startup">Startup (1-50)</SelectItem>
                            <SelectItem value="small">Small (51-200)</SelectItem>
                            <SelectItem value="medium">Medium (201-1000)</SelectItem>
                            <SelectItem value="large">Large (1000+)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}

            {/* Step 2: Work Details */}
            {currentStep === 2 && (
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="dailyWorkSummary"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Work Summary</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={6}
                            placeholder="Describe what you do on a typical day at work. Include specific tasks, tools you use, and responsibilities..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm text-slate-500">
                          {field.value?.length || 0}/300 characters (minimum 50)
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="keySkills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Skills & Tools (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="List your main skills, software tools, and technologies you work with regularly..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            )}

            {/* Step 3: Resume Upload & Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Resume (Optional)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploadedFile && (
                    <div className="mt-2 flex items-center text-sm text-slate-600">
                      <FileText className="w-4 h-4 mr-2" />
                      {uploadedFile.name}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Ready for AI Analysis</h4>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-start">
                      <Bot className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Our AI will analyze your profile and research current developments in your field</span>
                    </li>
                    <li className="flex items-start">
                      <Clock className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Analysis typically takes 30-60 seconds</span>
                    </li>
                    <li className="flex items-start">
                      <Shield className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Your data is processed securely and not stored permanently</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Review Your Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Role:</strong> {form.watch('jobTitle')} ({form.watch('careerCategory')})</div>
                    <div><strong>Experience:</strong> {form.watch('yearsExperience')} years</div>
                    <div><strong>Company Size:</strong> {form.watch('companySize') || 'Not specified'}</div>
                    <div><strong>Resume:</strong> {uploadedFile ? 'Uploaded' : 'Not provided'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Analysis */}
            {currentStep === 4 && (
              <div className="text-center py-12">
                <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-slate-900 mb-6">AI Analysis in Progress</h3>
                <div className="space-y-3 max-w-md mx-auto">
                  {analysisSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-center text-sm ${
                        index < analysisStep ? 'text-green-600' :
                        index === analysisStep ? 'text-primary' : 'text-slate-400'
                      }`}
                    >
                      {index < analysisStep ? (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      ) : index === analysisStep ? (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                      ) : (
                        <div className="w-4 h-4 border-2 border-slate-300 rounded-full mr-2"></div>
                      )}
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Results */}
            {currentStep === 5 && result && (
              <div className="space-y-8">
                {/* Risk Score Display */}
                <div className="text-center">
                  <RiskScoreCircle score={result.riskScore} size={160} />
                  <div className="mt-4">
                    <Badge 
                      variant="secondary" 
                      className={`${getRiskLevel(result.riskScore).bgColor} ${getRiskLevel(result.riskScore).color}`}
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {getRiskLevel(result.riskScore).label}
                    </Badge>
                  </div>
                </div>

                {/* Timeline & Preview */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Key Insights (Preview)</h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex items-start">
                      <Clock className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Estimated timeline: {result.timeline}</span>
                    </div>
                    {result.previewRecommendations && (
                      <p className="text-slate-600 mt-3">{result.previewRecommendations}</p>
                    )}
                  </div>
                </div>

                {/* Upgrade CTA */}
                {!result.hasFullReport && (
                  <Card className="border-2 border-primary">
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg">Get Your Complete Report</CardTitle>
                      <CardDescription>
                        Unlock detailed analysis, specific recommendations, and your personalized action plan.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="flex items-center justify-center space-x-6 text-sm text-slate-600">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          Detailed timeline
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          Action plan
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                          Skill recommendations
                        </div>
                      </div>
                      <div className="flex space-x-4">
                        <Button variant="outline" className="flex-1" onClick={() => router.push('/')}>
                          Maybe Later
                        </Button>
                        <Button className="flex-1" onClick={() => router.push(`/paywall?id=${result.id}`)}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Get Full Report - $49
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Navigation */}
            {currentStep < 4 && (
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={previousStep}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={nextStep}>
                  {currentStep === 3 ? (
                    <>
                      <Bot className="w-4 h-4 mr-2" />
                      Start AI Analysis
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 