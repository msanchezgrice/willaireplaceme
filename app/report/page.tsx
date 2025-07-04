"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RiskScoreCircle } from "@/components/risk-score-circle";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Target,
  Shield,
  BookOpen,
  Calendar,
  Lightbulb,
  Copy,
  Twitter,
  Linkedin,
  Facebook
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Prevent static generation for this page
export const dynamic = 'force-dynamic';

interface ReportData {
  id: string;
  score: number;
  preview: string;
  full_report: string;
  evidence: any;
  created_at: string;
}

// Social sharing utilities
const generateShareText = (score: number, riskLevel: string) => {
  return `I just completed my AI career risk assessment! 🤖

My AI replacement risk score: ${score}/100 (${riskLevel})

Find out your risk level and get personalized strategies to future-proof your career 👇`;
};

const shareToTwitter = (text: string, url: string) => {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
};

const shareToLinkedIn = (title: string, summary: string, url: string) => {
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedinUrl, '_blank', 'width=550,height=420');
};

const shareToFacebook = (url: string) => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'width=550,height=420');
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
};

// Markdown renderer component
function MarkdownContent({ content }: { content: string }) {
  // Enhanced markdown-to-HTML converter with better URL handling
  const renderMarkdown = (text: string) => {
    return text
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-slate-900 mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-slate-900 mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-slate-900 mt-8 mb-4">$1</h1>')
      
      // Bold and italic
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      
      // Handle markdown-style links [text](url) FIRST before URL conversion
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        // Clean URL and validate
        const cleanUrl = url.trim();
        if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
          return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${text}</a>`;
        } else {
          // If not a valid URL, treat as plain text reference
          return `<span class="text-blue-600 font-medium">${text}</span>`;
        }
      })
      
      // Convert standalone URLs to clickable links (avoiding already processed markdown links)
      .replace(/(?<!href="|">)https?:\/\/[^\s<]+/g, (url) => {
        // Clean up the URL (remove trailing punctuation)
        const cleanUrl = url.replace(/[.,;:)]+$/, '');
        const domain = cleanUrl.replace(/https?:\/\//, '').replace(/\/.*/, '');
        return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">${domain}</a>`;
      })
      
      // Handle numbered references like [1], [2], etc. as clickable footnotes
      .replace(/\[(\d+)\]/g, '<span class="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">$1</span>')
      
      // Lists - improved handling
      .replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1 list-disc">$1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>')
      
      // Handle bullet points with dashes
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 list-disc">$1</li>')
      
      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div 
      className="prose prose-slate max-w-none"
      dangerouslySetInnerHTML={{ 
        __html: `<p class="mb-4">${renderMarkdown(content)}</p>`
      }} 
    />
  );
}

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded, user } = useUser();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reportId = searchParams.get('id');
  const isPaid = searchParams.get('paid') === 'true';
  
  // Get back navigation destination based on context
  const getBackDestination = () => {
    const from = searchParams.get('from');
    if (from === 'intake') {
      // If coming from intake, decide based on sign-in status
      return isSignedIn ? '/dashboard' : '/';
    }
    if (from === 'dashboard') {
      return '/dashboard';
    }
    // Default: if signed in, go to dashboard; otherwise go to home
    return isSignedIn ? '/dashboard' : '/';
  };

  // Get back button text based on context
  const getBackButtonText = () => {
    const from = searchParams.get('from');
    if (from === 'intake') {
      return isSignedIn ? 'Back to Dashboard' : 'Back to Home';
    }
    if (from === 'dashboard') {
      return 'Back to Dashboard';
    }
    return isSignedIn ? 'Back to Dashboard' : 'Back to Home';
  };

  useEffect(() => {
    if (!isLoaded) return;

    // Redirect to paywall if not signed in
    if (!isSignedIn && reportId) {
      router.push(`/paywall?id=${reportId}`);
      return;
    }

    // Fetch report data
    const fetchReport = async () => {
      if (!reportId) {
        setError('No report ID provided');
        setLoading(false);
        return;
      }

      try {
        console.log('📊 [Report Page] Fetching report:', reportId);
        const response = await fetch(`/api/reports/${reportId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Report not found or still processing');
          } else {
            setError('Failed to load report');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('✅ [Report Page] Report loaded successfully');
        setReportData(data);
        
        // Update page title and meta tags for social sharing
        if (data.score) {
          const riskLevel = getRiskLevel(data.score);
          const title = `My AI Career Risk Assessment - ${data.score}/100 (${riskLevel.label})`;
          const description = `I just completed my AI replacement risk assessment! My risk score is ${data.score}/100 (${riskLevel.label}). Get your personalized analysis and strategies to future-proof your career.`;
          
          document.title = title;
          
          // Update meta description
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', description);
          } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = description;
            document.head.appendChild(meta);
          }
          
          // Update Open Graph tags
          const updateOrCreateMetaTag = (property: string, content: string) => {
            let metaTag = document.querySelector(`meta[property="${property}"]`);
            if (metaTag) {
              metaTag.setAttribute('content', content);
            } else {
              metaTag = document.createElement('meta');
              metaTag.setAttribute('property', property);
              metaTag.setAttribute('content', content);
              document.head.appendChild(metaTag);
            }
          };
          
          updateOrCreateMetaTag('og:title', title);
          updateOrCreateMetaTag('og:description', description);
          updateOrCreateMetaTag('og:url', window.location.href);
          updateOrCreateMetaTag('og:image', `${window.location.origin}/Website-screenshot.png`);
          updateOrCreateMetaTag('twitter:title', title);
          updateOrCreateMetaTag('twitter:description', description);
          updateOrCreateMetaTag('twitter:image', `${window.location.origin}/Website-screenshot.png`);
        }
      } catch (err) {
        console.error('❌ [Report Page] Error fetching report:', err);
        setError('Failed to load report');
      } finally {
        setLoading(false);
      }
    };

    if (isSignedIn && reportId) {
      fetchReport();
    }
  }, [isSignedIn, isLoaded, reportId, router]);

  const getRiskLevel = (score: number) => {
    if (score <= 33) return { label: "Low Risk", color: "text-green-600", bgColor: "bg-green-100" };
    if (score <= 66) return { label: "Moderate Risk", color: "text-amber-600", bgColor: "bg-amber-100" };
    return { label: "High Risk", color: "text-red-600", bgColor: "bg-red-100" };
  };

  const handleDownload = () => {
    if (!reportData) return;
    
    const element = document.createElement('a');
    const file = new Blob([reportData.full_report], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `AI-Career-Risk-Assessment-${reportData.id}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    if (!reportData) return;
    
    const shareUrl = window.location.href;
    const riskLevel = getRiskLevel(reportData.score);
    
    // Check if native sharing is available
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: 'My AI Career Risk Assessment',
          text: generateShareText(reportData.score, riskLevel.label),
          url: shareUrl,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.log('Native sharing failed, falling back to copy:', err);
          // Fallback to copy
          const shareText = `${generateShareText(reportData.score, riskLevel.label)}\n\n${shareUrl}`;
          const copied = await copyToClipboard(shareText);
          if (copied) {
            alert('✅ Share text copied to clipboard!');
          }
        }
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${generateShareText(reportData.score, riskLevel.label)}\n\n${shareUrl}`;
      const copied = await copyToClipboard(shareText);
      if (copied) {
        alert('✅ Share text copied to clipboard!');
      }
    }
  };

  const handleShareDropdown = async (platform: string) => {
    if (!reportData) return;
    
    const shareUrl = window.location.href;
    const riskLevel = getRiskLevel(reportData.score);
    const shareText = generateShareText(reportData.score, riskLevel.label);
    
    switch (platform) {
      case 'twitter':
        shareToTwitter(shareText, shareUrl);
        break;
      case 'linkedin':
        shareToLinkedIn('My AI Career Risk Assessment', shareText, shareUrl);
        break;
      case 'facebook':
        shareToFacebook(shareUrl);
        break;
      case 'copy':
        const fullText = `${shareText}\n\n${shareUrl}`;
        const copied = await copyToClipboard(fullText);
        if (copied) {
          alert('✅ Share text copied to clipboard!');
        }
        break;
      default:
        handleShare();
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to extract specific sections from the full report
  const extractSection = (content: string, sectionTitle: string): string => {
    if (!content) return '';
    
    // Try multiple variations of section headers
    const sectionVariations = [
      `## ${sectionTitle}`,
      `### ${sectionTitle}`,
      `## ${sectionTitle} `,
      `### ${sectionTitle} `,
      `## Your ${sectionTitle}`,
      `### Your ${sectionTitle}`,
      `## Personalized ${sectionTitle}`,
      `### Personalized ${sectionTitle}`
    ];
    
    for (const variation of sectionVariations) {
      const sectionRegex = new RegExp(
        `${variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([\\s\\S]*?)(?=## |### |$)`,
        'i'
      );
      
      const match = content.match(sectionRegex);
      if (match && match[1].trim().length > 50) { // Ensure substantial content
        return match[1].trim();
      }
    }
    
    return '';
  };

  // Extract 90-Day Action Plan content with enhanced fallbacks
  const getActionPlanContent = (fullReport: string): string => {
    // Try multiple section titles
    const actionPlanTitles = [
      '90-Day Action Plan',
      'Action Plan',
      'Your 90-Day Action Plan',
      'Personalized Action Plan',
      'Strategic Action Plan',
      'Implementation Plan'
    ];
    
    for (const title of actionPlanTitles) {
      const content = extractSection(fullReport, title);
      if (content) return content;
    }
    
    // Fallback: extract any section that contains "Action" and has substantial content
    const actionRegex = /## [^#]*Action[^#]*Plan[^#]*([\\s\\S]*?)(?=## |$)/i;
    const actionMatch = fullReport.match(actionRegex);
    if (actionMatch && actionMatch[1].trim().length > 100) {
      return actionMatch[1].trim();
    }
    
    return `## Phase 1: Immediate Actions (Days 1-30)

**Skill Assessment & Foundation Building:**
1. **Audit Current Skills**: Complete a comprehensive inventory of your technical and soft skills
2. **AI Tool Familiarization**: Begin daily use of AI tools relevant to your role
3. **Network Activation**: Connect with professionals in AI-adjacent roles

## Phase 2: Skill Development (Days 31-60)

**Strategic Capability Building:**
1. **Core Competency Enhancement**: Enroll in relevant certification programs
2. **AI Collaboration Skills**: Learn effective human-AI workflow optimization
3. **Industry Intelligence**: Stay informed about AI developments in your field

## Phase 3: Strategic Positioning (Days 61-90)

**Career Future-Proofing:**
1. **Specialized Expertise Development**: Focus on areas with lower automation risk
2. **Strategic Networking**: Build relationships with industry leaders
3. **Personal Brand Enhancement**: Establish thought leadership in your domain

*Detailed action plan will be generated based on your specific assessment results.*`;
  };

  // Extract Skill Development content with enhanced fallbacks
  const getSkillDevelopmentContent = (fullReport: string): string => {
    // Try multiple section titles
    const skillTitles = [
      'Skill Development Roadmap',
      'Skill Development',
      'Your Skill Development',
      'Professional Development',
      'Learning Roadmap',
      'Career Development'
    ];
    
    for (const title of skillTitles) {
      const content = extractSection(fullReport, title);
      if (content) return content;
    }
    
    // Fallback: extract any section that contains "Skill" and has substantial content
    const skillRegex = /## [^#]*Skill[^#]*([\\s\\S]*?)(?=## |$)/i;
    const skillMatch = fullReport.match(skillRegex);
    if (skillMatch && skillMatch[1].trim().length > 100) {
      return skillMatch[1].trim();
    }
    
    return `## Core Skills to Develop (Priority Order)

### 1. AI Collaboration & Prompt Engineering
- **What**: Learn to effectively work with AI tools in your daily workflow
- **Why**: Essential for staying relevant in AI-augmented work environments
- **Timeline**: 2-4 weeks
- **Resources**: Online courses, hands-on practice with AI tools

### 2. Strategic Thinking & Complex Problem Solving
- **What**: Develop skills that complement AI capabilities rather than compete
- **Why**: Human judgment and creativity remain critical differentiators
- **Timeline**: Ongoing development
- **Resources**: Strategic thinking frameworks, case study analysis

### 3. Data Analysis & Interpretation
- **What**: Understanding and interpreting AI-generated insights
- **Why**: Critical for making informed decisions with AI assistance
- **Timeline**: 4-6 weeks
- **Resources**: Data analytics courses, visualization tools

### 4. Industry-Specific Technical Skills
- **What**: Deepen expertise in areas where human knowledge adds value
- **Why**: Specialized knowledge becomes more valuable as AI handles routine tasks
- **Timeline**: 3-6 months
- **Resources**: Professional certifications, industry training programs

*Detailed skill recommendations will be based on your specific role and assessment results.*`;
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Report Unavailable</h2>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button onClick={() => router.push(getBackDestination())}>
              {getBackButtonText()}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="p-8">
            <Clock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Processing Your Report</h2>
            <p className="text-slate-600 mb-4">Your AI analysis is still in progress. Please check back in a few minutes.</p>
            <Button onClick={() => window.location.reload()}>
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const riskLevel = getRiskLevel(reportData.score);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.push(getBackDestination())} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {getBackButtonText()}
              </Button>
              <h1 className="text-xl font-bold text-slate-900">Your AI Risk Assessment</h1>
            </div>
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleShareDropdown('copy')}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleShareDropdown('twitter')}>
                    <Twitter className="mr-2 h-4 w-4" />
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShareDropdown('linkedin')}>
                    <Linkedin className="mr-2 h-4 w-4" />
                    Share on LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShareDropdown('facebook')}>
                    <Facebook className="mr-2 h-4 w-4" />
                    Share on Facebook
                  </DropdownMenuItem>
                  {typeof navigator !== 'undefined' && 'share' in navigator && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleShare}>
                        <Share2 className="mr-2 h-4 w-4" />
                        More Options
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Sidebar - Risk Score & Quick Stats */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Risk Score Card */}
              <Card>
                <CardHeader className="text-center pb-4">
                  <RiskScoreCircle score={reportData.score} size={120} />
                  <CardTitle className="text-lg mt-4">Risk Assessment</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`${riskLevel.bgColor} ${riskLevel.color}`}
                  >
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {riskLevel.label}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Risk Score</span>
                      <span className="font-semibold">{reportData.score}/100</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-slate-500" />
                      <span className="text-slate-600">Generated {new Date(reportData.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => scrollToSection('key-insights')}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    View Executive Summary
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => scrollToSection('action-plan')}>
                    <Target className="w-4 h-4 mr-2" />
                    Action Plan
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => scrollToSection('skill-development')}>
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Skill Development
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6 sm:space-y-8">
              {/* Preview Section */}
              <Card id="key-insights">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Key Insights
                  </CardTitle>
                  <CardDescription>
                    Your personalized AI replacement risk analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MarkdownContent content={reportData.preview} />
                </CardContent>
              </Card>

              {/* Share Card */}
              <Card className="border-primary/20 bg-blue-50/50">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Share2 className="w-5 h-5 mr-2 text-primary" />
                    Share Your Results
                  </CardTitle>
                  <CardDescription>
                    Help others discover their AI career risk
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Share your assessment results with friends and colleagues to help them understand their own AI replacement risk.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      variant="default" 
                      onClick={() => handleShareDropdown('twitter')}
                      className="flex-1"
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Share on Twitter
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleShareDropdown('linkedin')}
                      className="flex-1"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      Share on LinkedIn
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleShareDropdown('copy')}
                      className="flex-1"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Full Report Content - Only for paid users */}
              {isPaid && reportData.full_report && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="w-5 h-5 mr-2" />
                      Complete Analysis
                    </CardTitle>
                    <CardDescription>
                      Your comprehensive AI replacement risk assessment
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MarkdownContent content={reportData.full_report} />
                  </CardContent>
                </Card>
              )}

              {/* Action Plan Section - Extract from full report if it contains action plan */}
              <Card id="action-plan">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Action Plan
                  </CardTitle>
                  <CardDescription>
                    Specific steps to future-proof your career
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MarkdownContent content={getActionPlanContent(reportData.full_report)} />
                </CardContent>
              </Card>

              {/* Skill Development Section */}
              <Card id="skill-development">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Skill Development
                  </CardTitle>
                  <CardDescription>
                    Recommended skills and learning paths
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MarkdownContent content={getSkillDevelopmentContent(reportData.full_report)} />
                </CardContent>
              </Card>

              {/* Upgrade CTA for non-paid users */}
              {!isPaid && (
                <Card className="border-2 border-primary">
                  <CardHeader className="text-center">
                    <CardTitle>Complete Your Analysis</CardTitle>
                    <CardDescription>
                      You&apos;re viewing the preview. Sign up to unlock the full detailed report with actionable recommendations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Detailed Analysis
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Action Plan
                      </div>
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        Career Strategies
                      </div>
                    </div>
                    <Button 
                      className="w-full sm:w-auto"
                      onClick={() => router.push(`/paywall?id=${reportId}`)}
                    >
                      Get Complete Report
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Footer Actions */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    <div className="text-center sm:text-left">
                      <h3 className="font-semibold text-slate-900">Want to reassess?</h3>
                      <p className="text-sm text-slate-600">Get updated analysis as AI capabilities evolve</p>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => router.push('/intake')}
                    >
                      Start New Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
} 