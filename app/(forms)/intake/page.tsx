"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
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
  CreditCard,
  Upload,
  Linkedin,
  Link
} from "lucide-react";

const assessmentSchema = z.object({
  careerCategory: z.string().min(1, "Please select a career category"),
  customCareerCategory: z.string().optional(),
  jobTitle: z.string().min(1, "Please enter your job title"),
  yearsExperience: z.string().min(1, "Please select your experience level"),
  companySize: z.string().optional(),
  dailyWorkSummary: z.string().min(50, "Please provide at least 50 characters describing your daily work"),
  keySkills: z.string().optional(),
  linkedinUrl: z.string().min(1, "Please provide your LinkedIn profile URL").url("Please enter a valid LinkedIn URL"),
}).refine((data) => {
  // If "other" is selected, customCareerCategory is required
  if (data.careerCategory === 'other') {
    return data.customCareerCategory && data.customCareerCategory.trim().length > 0;
  }
  return true;
}, {
  message: "Please specify your career category",
  path: ["customCareerCategory"],
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
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    }>
      <IntakeContent />
    </Suspense>
  );
}

function IntakeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStepIndex, setAnalysisStepIndex] = useState(0);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const form = useForm<AssessmentFormData>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      careerCategory: "",
      customCareerCategory: "",
      jobTitle: "",
      yearsExperience: "",
      companySize: "",
      dailyWorkSummary: "",
      keySkills: "",
      linkedinUrl: "",
    },
  });

  // Handle URL parameters for pre-population
  useEffect(() => {
    const category = searchParams?.get('category');
    if (category && ['designer', 'product-manager', 'marketing', 'accounting', 'legal'].includes(category)) {
      form.setValue('careerCategory', category);
    }
  }, [searchParams, form]);

  // Watch the career category to show/hide custom input
  const selectedCareerCategory = form.watch('careerCategory');

  // Career-specific configurations
  const careerConfigs = {
    'designer': {
      name: 'Designer',
      description: 'UI/UX, Graphic, Product Design',
      jobTitlePlaceholder: 'e.g., Senior UX Designer, Product Designer, Graphic Designer',
      workSummaryPlaceholder: 'Describe your design process, tools you use (Figma, Sketch, Adobe Creative Suite), daily tasks like user research, wireframing, prototyping, stakeholder meetings, design reviews...',
      skillsPlaceholder: 'e.g., Figma, Sketch, Adobe Creative Suite, User Research, Prototyping, Design Systems, Interaction Design...'
    },
    'product-manager': {
      name: 'Product Manager',
      description: 'Product Strategy, Roadmapping, Stakeholder Management',
      jobTitlePlaceholder: 'e.g., Senior Product Manager, Product Owner, Associate PM',
      workSummaryPlaceholder: 'Describe your product management activities like roadmap planning, user story writing, stakeholder meetings, data analysis, feature prioritization, sprint planning...',
      skillsPlaceholder: 'e.g., Jira, Confluence, Product Analytics, User Research, Roadmapping, Agile/Scrum, SQL, Stakeholder Management...'
    },
    'marketing': {
      name: 'Marketing',
      description: 'Content, Digital Marketing, SEO, Campaign Management',
      jobTitlePlaceholder: 'e.g., Marketing Manager, Content Marketer, Digital Marketing Specialist',
      workSummaryPlaceholder: 'Describe your marketing activities like content creation, campaign management, social media strategy, SEO optimization, analytics reporting, lead generation...',
      skillsPlaceholder: 'e.g., Google Analytics, HubSpot, Content Creation, SEO/SEM, Social Media Marketing, Email Marketing, Adobe Creative Suite...'
    },
    'accounting': {
      name: 'Accounting',
      description: 'Bookkeeping, Financial Analysis, Tax Preparation',
      jobTitlePlaceholder: 'e.g., Staff Accountant, Financial Analyst, Bookkeeper, CPA',
      workSummaryPlaceholder: 'Describe your accounting work like bookkeeping, financial reporting, tax preparation, accounts payable/receivable, financial analysis, auditing...',
      skillsPlaceholder: 'e.g., QuickBooks, Excel, SAP, Financial Reporting, Tax Software, Bookkeeping, Financial Analysis, Audit...'
    },
    'legal': {
      name: 'Legal',
      description: 'Contract Review, Research, Document Preparation',
      jobTitlePlaceholder: 'e.g., Attorney, Legal Counsel, Paralegal, Legal Assistant',
      workSummaryPlaceholder: 'Describe your legal work like contract review, legal research, document drafting, client consultation, case preparation, regulatory compliance...',
      skillsPlaceholder: 'e.g., Legal Research Databases, Contract Review, Document Drafting, Client Relations, Case Management Software...'
    }
  };

  const currentCareerConfig = selectedCareerCategory && selectedCareerCategory !== '' && careerConfigs[selectedCareerCategory as keyof typeof careerConfigs] ? careerConfigs[selectedCareerCategory as keyof typeof careerConfigs] : undefined;

  const onSubmit = async (data: AssessmentFormData) => {
    console.log('🚀 [Frontend] Starting assessment submission...');
    console.log('📋 [Frontend] Form data:', data);
    
    setIsAnalyzing(true);
    setCurrentStep(4);
    setAnalysisStepIndex(0);
    
    // Updated carousel steps that can loop
    const analysisSteps = [
      "Analyzing your professional profile",
      "Researching AI trends in your field", 
      "Evaluating automation risk factors",
      "Generating personalized insights",
      "Finalizing your career assessment",
      "Compiling risk analysis data",
      "Preparing actionable recommendations"
    ];
    
    // Carousel that loops through steps until analysis completes
    const stepInterval = setInterval(() => {
      setAnalysisStepIndex(prev => (prev + 1) % 7); // 7 steps total
    }, 2000); // Slower, 2-second intervals

    try {
      // Convert form data to match API expectations
      const taskHours = {
        [data.jobTitle]: 40 // Default weekly hours
      };

      console.log('📄 [Frontend] Uploaded file:', uploadedFile?.name, uploadedFile?.type);
      console.log('🔗 [Frontend] LinkedIn URL:', data.linkedinUrl);

      let resumeContent = data.dailyWorkSummary;
      let fileData = null;
      
      if (uploadedFile) {
        console.log('📖 [Frontend] Processing uploaded file...');
        try {
          const fileContent = await fileToText(uploadedFile);
          fileData = {
            name: uploadedFile.name,
            type: uploadedFile.type,
            content: fileContent,
            size: uploadedFile.size
          };
          console.log('✅ [Frontend] File processed successfully');
          
          // For text files, also use as resume content
          if (uploadedFile.type === 'text/plain') {
            resumeContent = fileContent;
          }
        } catch (fileError) {
          console.error('❌ [Frontend] Error processing file:', fileError);
          console.log('📄 [Frontend] Continuing without file data');
        }
      }

      const requestBody = {
        role: data.jobTitle,
        tasks: taskHours,
        resume: resumeContent,
        linkedinUrl: data.linkedinUrl || null,
        uploadedFile: fileData, // Send processed file data
        profileData: {
          careerCategory: data.careerCategory,
          yearsExperience: data.yearsExperience,
          companySize: data.companySize,
          dailyWorkSummary: data.dailyWorkSummary,
          keySkills: data.keySkills
        }
      };
      
      console.log('📤 [Frontend] Sending request to /api/research');
      console.log('📋 [Frontend] Request body:', {
        role: requestBody.role,
        tasks: requestBody.tasks,
        resume_length: requestBody.resume.length,
        hasLinkedin: !!requestBody.linkedinUrl,
        hasUploadedFile: !!requestBody.uploadedFile
      });

      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minutes timeout instead of 45 seconds

      let response;
      let responseData;
      
      try {
        response = await fetch('/api/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        console.log('📥 [Frontend] Response status:', response.status);
        console.log('📥 [Frontend] Response ok:', response.ok);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ [Frontend] API error response:', errorText);
          
          // Handle specific error cases
          if (response.status === 504 || response.status === 408) {
            console.log('⏰ [Frontend] Request timed out, but analysis is processing in background');
            // For timeout, we'll try to recover by polling for any existing profile
            throw new Error('Analysis is taking longer than expected. Your assessment is still processing...');
          }
          
          throw new Error(`Assessment submission failed: ${response.status} ${errorText}`);
        }

        responseData = await response.json();
        console.log('✅ [Frontend] API response:', responseData);
        
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          console.log('⏰ [Frontend] Request aborted due to timeout');
          throw new Error('Analysis is taking longer than expected. Your assessment is still processing in the background...');
        }
        
        throw fetchError;
      }

      const { profile_id } = responseData;
      
      if (!profile_id) {
        throw new Error('No profile ID received from server');
      }
      
      console.log('🔄 [Frontend] Starting polling for results with profile ID:', profile_id);
      
      // Poll for results with improved error handling
      let pollAttempts = 0;
      const maxPollAttempts = 180; // Poll for up to 6 minutes (180 x 2 seconds)
      const pollResults = async () => {
        console.log(`🔍 [Frontend] Polling attempt ${pollAttempts + 1}/${maxPollAttempts}...`);
        pollAttempts++;
        
        try {
          const reportResponse = await fetch(`/api/reports/${profile_id}`);
          console.log('📊 [Frontend] Report response status:', reportResponse.status);
          
          if (reportResponse.ok) {
            const reportData = await reportResponse.json();
            console.log('✅ [Frontend] Report received:', {
              id: reportData.id,
              score: reportData.score,
              preview_length: reportData.preview?.length,
              full_report_length: reportData.full_report?.length
            });
            
            // Successfully got the report - display results
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
              recommendations: reportData.full_report,
              hasFullReport: Boolean(isSignedIn && isLoaded && reportData.full_report) // Only if signed in AND full report exists
            });
            
            // Move to results step and stop analysis animation
            setCurrentStep(5);
            setIsAnalyzing(false);
            clearInterval(stepInterval);
            
            console.log('🎉 [Frontend] Successfully transitioned to results view');
            return; // Success - stop polling
          } else if (reportResponse.status === 404) {
            console.log('⏳ [Frontend] Report not ready yet, continuing to poll...');
            // Continue polling if report not ready
          } else {
            console.error('❌ [Frontend] Unexpected response status:', reportResponse.status);
            const errorText = await reportResponse.text();
            console.error('❌ [Frontend] Error response:', errorText);
          }
        } catch (pollError) {
          console.error('❌ [Frontend] Polling error:', pollError);
        }

        // Check if we should continue polling
        if (pollAttempts < maxPollAttempts) {
          setTimeout(pollResults, 2000); // Poll every 2 seconds
        } else {
          console.error('❌ [Frontend] Polling timeout - max attempts reached');
          setIsAnalyzing(false);
          clearInterval(stepInterval);
          alert('Analysis is taking longer than expected. The report may still be processing. Please check back in a few minutes or contact support if the issue persists.');
        }
      };

      // Start polling after a brief delay to allow backend processing to begin
      setTimeout(pollResults, 5000); // Wait 5 seconds before first poll
      
    } catch (error) {
      console.error('💥 [Frontend] Assessment failed:', error);
      console.error('📚 [Frontend] Error details:', error instanceof Error ? error.stack : 'No stack trace');
      setIsAnalyzing(false);
      clearInterval(stepInterval);
      
      // Set the analysis error state
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAnalysisError(errorMessage);
      
      // Show user-friendly error message
      alert(`Assessment failed: ${errorMessage}\n\nPlease try again. If the problem persists, your assessment may still be processing in the background.`);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      
      if (validTypes.includes(file.type) || file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx') || file.name.endsWith('.txt')) {
        setUploadedFile(file);
      } else {
        alert('Please upload a PDF, DOC, DOCX, or TXT file');
      }
    }
  };

  // Function to convert file to base64 for backend processing
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 content
        const base64Content = result.split(',')[1];
        resolve(base64Content);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Function to convert file to text (for text files) or get readable content
  const fileToText = async (file: File): Promise<string> => {
    if (file.type === 'text/plain') {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
    } else {
      // For PDFs and other documents, we'll send the base64 content
      // and let the backend process it with OpenAI
      return await fileToBase64(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const nextStep = () => {
    if (currentStep < 3) {
      // Validate current step before proceeding
      if (currentStep === 1) {
        const basicFields = ['careerCategory', 'jobTitle', 'yearsExperience'];
        const formValues = form.getValues();
        
        // Check basic fields
        const hasBasicErrors = basicFields.some(field => {
          const value = formValues[field as keyof AssessmentFormData];
          return !value || value.toString().trim() === '';
        });
        
        // Check custom career category if "other" is selected
        const hasCustomCategoryError = formValues.careerCategory === 'other' && 
          (!formValues.customCareerCategory || formValues.customCareerCategory.trim() === '');
        
        if (hasBasicErrors || hasCustomCategoryError) {
          // Trigger validation display
          form.trigger(['careerCategory', 'customCareerCategory', 'jobTitle', 'yearsExperience']);
          return;
        }
      }
      
      if (currentStep === 2) {
        const workFields = ['dailyWorkSummary', 'linkedinUrl'];
        const hasErrors = workFields.some(field => {
          const value = form.getValues(field as keyof AssessmentFormData);
          if (field === 'dailyWorkSummary') {
            return !value || value.toString().trim().length < 50;
          }
          if (field === 'linkedinUrl') {
            return !value || value.toString().trim() === '';
          }
          return false;
        });
        
        if (hasErrors) {
          // Trigger validation display
          form.trigger(['dailyWorkSummary', 'linkedinUrl']);
          return;
        }
      }
      
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

  // Function to render markdown preview content
  const renderPreview = (content: string) => {
    if (!content) return '';
    
    // Limit content to approximately 750 words
    const wordLimit = 750;
    const words = content.split(/\s+/);
    const limitedContent = words.length > wordLimit 
      ? words.slice(0, wordLimit).join(' ') + '...'
      : content;
    
    return limitedContent
      // Remove all section markers and headers
      .replace(/\*\*SECTION \d+: PREVIEW\*\*/g, '')
      .replace(/SECTION \d+: PREVIEW/g, '')
      .replace(/\*\*PREVIEW\*\*/g, '')
      .replace(/PREVIEW/g, '')
      // Handle headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-slate-900 mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-slate-900 mt-6 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-slate-900 mt-6 mb-4">$1</h1>')
      // Handle bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      // Handle italic text
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>')
      // Handle markdown-style links [text](url) FIRST
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium">$1</a>')
      // Handle standalone URLs (http/https) - avoid double processing
      .replace(/(?<!href="|">|class=")https?:\/\/[^\s<>"{}|\\^`[\]]+/g, (url) => {
        // Clean up the URL (remove trailing punctuation)
        const cleanUrl = url.replace(/[.,;:)]+$/, '');
        const domain = cleanUrl.replace(/https?:\/\//, '').replace(/\/.*/, '');
        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline font-medium">${domain}</a>`;
      })
      // Handle bullet points
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 list-disc text-slate-700">$1</li>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1 list-disc text-slate-700">$1</li>')
      // Handle numbered lists
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 list-decimal text-slate-700">$1</li>')
      // Handle line breaks and create paragraphs
      .split('\n\n')
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0 && !paragraph.match(/^[\s\*\-]*$/))
      .map(paragraph => {
        // Don't wrap list items or headers in paragraphs
        if (paragraph.includes('<li') || paragraph.includes('<h')) {
          return paragraph;
        }
        return `<div class="mb-4 leading-relaxed text-slate-700">${paragraph.replace(/\n/g, '<br/>')}</div>`;
      })
      .join('');
  };

  // Get back navigation destination based on context
  const getBackDestination = () => {
    const from = searchParams.get('from');
    return from === 'dashboard' ? '/dashboard' : '/';
  };

  // Get back button text based on context
  const getBackButtonText = () => {
    const from = searchParams.get('from');
    return from === 'dashboard' ? 'Back to Dashboard' : 'Back to Home';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-slate-900">AI Risk Assessment</h1>
            <Button variant="ghost" onClick={() => router.push(getBackDestination())}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {getBackButtonText()}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Career-Specific Header */}
        {currentCareerConfig && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-2">
              <span className="mr-2">🎯</span>
              {currentCareerConfig.name} Risk Assessment
            </div>
            <p className="text-slate-600">
              Specialized analysis for {currentCareerConfig.description.toLowerCase()}
            </p>
          </div>
        )}

        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <CardTitle className="text-xl sm:text-2xl">{getStepTitle()}</CardTitle>
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
                        <Select onValueChange={field.onChange} value={field.value}>
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

                  {/* Custom Career Category Input - only show when "other" is selected */}
                  {selectedCareerCategory === 'other' && (
                    <FormField
                      control={form.control}
                      name="customCareerCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please specify your career category</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Software Engineering, Sales, HR..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="jobTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={currentCareerConfig?.jobTitlePlaceholder || "e.g., Senior UX Designer"} 
                            {...field} 
                          />
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
                            placeholder={currentCareerConfig?.workSummaryPlaceholder || "Describe what you do on a typical day at work. Include specific tasks, tools you use, and responsibilities..."}
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
                            placeholder={currentCareerConfig?.skillsPlaceholder || "List your main skills, software tools, and technologies you work with regularly..."}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Linkedin className="w-4 h-4 mr-2 text-blue-600" />
                          LinkedIn Profile URL
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://linkedin.com/in/your-profile" 
                            {...field} 
                          />
                        </FormControl>
                        <p className="text-sm text-slate-500">
                          We&apos;ll analyze your LinkedIn profile for comprehensive assessment
                        </p>
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
                  <label className="block text-sm font-medium text-slate-700 mb-4">
                    Upload Resume (Optional)
                  </label>
                  
                  {/* Enhanced File Upload Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center transition-colors ${
                      isDragOver 
                        ? 'border-primary bg-blue-50' 
                        : uploadedFile 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {uploadedFile ? (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                          <FileText className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <p className="text-green-700 font-medium">{uploadedFile.name}</p>
                          <p className="text-sm text-green-600">File uploaded successfully</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setUploadedFile(null)}
                        >
                          Remove File
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center">
                          <Upload className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-slate-600 font-medium">Drop your resume here</p>
                          <p className="text-sm text-slate-500">or click to browse files</p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload">
                          <Button variant="outline" size="sm" asChild>
                            <span className="cursor-pointer">
                              <Upload className="w-4 h-4 mr-2" />
                              Choose File
                            </span>
                          </Button>
                        </label>
                        <p className="text-xs text-slate-400">
                          Supports PDF, DOC, DOCX, TXT (max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
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
                    {form.watch('linkedinUrl') && (
                      <li className="flex items-start">
                        <Linkedin className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span>LinkedIn profile will be analyzed for comprehensive assessment</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="bg-slate-50 rounded-lg p-6">
                  <h4 className="font-semibold text-slate-900 mb-3">Review Your Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Role:</strong> {form.watch('jobTitle')} ({form.watch('careerCategory') === 'other' ? form.watch('customCareerCategory') : form.watch('careerCategory')})</div>
                    <div><strong>Experience:</strong> {form.watch('yearsExperience')} years</div>
                    <div><strong>Company Size:</strong> {form.watch('companySize') || 'Not specified'}</div>
                    <div><strong>Resume:</strong> {uploadedFile ? 'Uploaded' : 'Not provided'}</div>
                    <div><strong>LinkedIn:</strong> {form.watch('linkedinUrl') ? 'Provided' : 'Not provided'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Analysis */}
            {currentStep === 4 && (
              <div className="text-center py-12">
                {analysisError ? (
                  // Error state
                  <div className="space-y-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-red-900 mb-2">Analysis Failed</h3>
                      <p className="text-red-700 mb-4">{analysisError}</p>
                      <div className="space-y-2">
                        <Button onClick={() => {
                          setAnalysisError(null);
                          setCurrentStep(3);
                        }} variant="outline">
                          Back to Review
                        </Button>
                        <Button onClick={() => {
                          setAnalysisError(null);
                          setIsAnalyzing(true);
                          form.handleSubmit(onSubmit)();
                        }}>
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Normal analysis state with carousel
                  <>
                    <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-6">AI Analysis in Progress</h3>
                    
                    {/* Carousel Display */}
                    <div className="max-w-md mx-auto">
                      <div className="bg-blue-50 rounded-lg px-6 py-4 transition-all duration-500 ease-in-out">
                        <div className="flex items-center justify-center text-primary">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3"></div>
                          <span className="text-sm font-medium">
                            {isAnalyzing && (() => {
                              const steps = [
                                "Analyzing your professional profile",
                                "Researching AI trends in your field", 
                                "Evaluating automation risk factors",
                                "Generating personalized insights",
                                "Finalizing your career assessment",
                                "Compiling risk analysis data",
                                "Preparing actionable recommendations"
                              ];
                              return steps[analysisStepIndex] || steps[0];
                            })()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Progress dots */}
                      <div className="flex justify-center mt-4 space-x-1">
                        {[...Array(7)].map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === analysisStepIndex ? 'bg-primary' : 'bg-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}
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
                  <h4 className="font-semibold text-slate-900 mb-3">
                    {result.hasFullReport ? 'Complete Analysis Results' : 'Key Insights (Preview)'}
                  </h4>
                  <div className="space-y-2 text-sm text-slate-700">
                    <div className="flex items-start">
                      <Clock className="w-4 h-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>Estimated timeline: {result.timeline}</span>
                    </div>
                    
                    {/* Always show preview content if available */}
                    {result.previewRecommendations && (
                      <div className="mt-4 prose prose-sm max-w-none">
                        <div dangerouslySetInnerHTML={{ 
                          __html: renderPreview(result.previewRecommendations)
                        }} />
                      </div>
                    )}
                    
                    {/* Show full report content for signed-in users if different from preview */}
                    {result.hasFullReport && result.recommendations && result.recommendations !== result.previewRecommendations && (
                      <div className="mt-6">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <span className="font-medium text-green-800">Complete Analysis Available</span>
                          </div>
                          <p className="text-sm text-green-700 mt-1">Your full detailed report with comprehensive recommendations.</p>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <div dangerouslySetInnerHTML={{ 
                            __html: renderPreview(result.recommendations)
                          }} />
                        </div>
                      </div>
                    )}
                    
                    {/* For signed-in users, encourage them to view full report even if limited content */}
                    {result.hasFullReport && !result.recommendations && (
                      <div className="mt-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-center">
                            <Clock className="w-5 h-5 text-amber-600 mr-2" />
                            <span className="font-medium text-amber-800">Analysis Still Processing</span>
                          </div>
                          <p className="text-sm text-amber-700 mt-1">Your detailed report is being generated. You can view the full analysis on your dashboard shortly.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Signup CTA or Full Report Available */}
                {result.hasFullReport ? (
                  // Signed-in user with full report available
                  <Card className="border-2 border-green-500">
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg text-green-800">Analysis Complete!</CardTitle>
                      <CardDescription>
                        Your comprehensive AI risk assessment is available. You can view the complete report and track your progress on your dashboard.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <p className="text-green-800 font-medium">Full Report Access</p>
                        <p className="text-sm text-green-700">Your complete analysis includes detailed recommendations and action items.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <Button variant="outline" className="flex-1" onClick={() => router.push('/dashboard')}>
                          View All Reports
                        </Button>
                        <Button className="flex-1" onClick={() => router.push(`/report?id=${result.id}&paid=true&from=intake`)}>
                          View Full Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : isSignedIn && isLoaded ? (
                  // Signed-in user but full report not ready yet
                  <Card className="border-2 border-amber-500">
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg text-amber-800">Report Processing</CardTitle>
                      <CardDescription>
                        Your detailed analysis is being generated. You can view the preview above and check your dashboard for the complete report.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="bg-amber-50 rounded-lg p-4">
                        <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                        <p className="text-amber-800 font-medium">Full Report In Progress</p>
                        <p className="text-sm text-amber-700">Your complete analysis with detailed recommendations is being prepared.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <Button variant="outline" className="flex-1" onClick={() => router.push('/dashboard')}>
                          Go to Dashboard
                        </Button>
                        <Button className="flex-1" onClick={() => router.push(`/report?id=${result.id}&paid=true&from=intake`)}>
                          View Current Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  // Non-signed-in user - show paywall
                  <Card className="border-2 border-primary">
                    <CardHeader className="text-center">
                      <CardTitle className="text-lg">Get Your Complete Report</CardTitle>
                      <CardDescription>
                        Sign up with your email to unlock detailed analysis, specific recommendations, and your personalized action plan.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          Detailed timeline
                        </div>
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          Action plan
                        </div>
                        <div className="flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          Skill recommendations
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <Button variant="outline" className="flex-1" onClick={() => router.push(getBackDestination())}>
                          Maybe Later
                        </Button>
                        <Button className="flex-1" onClick={() => router.push(`/paywall?id=${result.id}`)}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Sign Up for Full Report
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Navigation */}
            {currentStep < 4 && (
              <div className="flex flex-col sm:flex-row justify-between pt-6 space-y-2 sm:space-y-0">
                <Button
                  variant="outline"
                  onClick={previousStep}
                  disabled={currentStep === 1}
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={nextStep} className="w-full sm:w-auto">
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