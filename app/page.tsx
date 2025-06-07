"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CareerCategoryCard } from "@/components/career-category-card";
import { RiskScoreCircle } from "@/components/risk-score-circle";
import { Logo } from "@/components/logo";
import { 
  Bot, 
  ChartLine, 
  Clock, 
  Users, 
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  Linkedin,
  LogIn,
  User,
  FileText
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const [selectedExampleCareer, setSelectedExampleCareer] = useState('product-manager');

  const careerCategories = [
    {
      id: "designer",
      name: "Designer",
      description: "UI/UX, Graphic, Product Design",
      icon: "palette",
      averageRisk: 42,
      assessmentCount: 2847,
    },
    {
      id: "product-manager",
      name: "Product Manager",
      description: "Product Strategy, Roadmapping, Stakeholder Management",
      icon: "clipboard-list",
      averageRisk: 38,
      assessmentCount: 3254,
    },
    {
      id: "marketing",
      name: "Marketing",
      description: "Content, Digital Marketing, SEO, Campaign Management",
      icon: "bullhorn",
      averageRisk: 65,
      assessmentCount: 1932,
    },
    {
      id: "accounting",
      name: "Accounting",
      description: "Bookkeeping, Financial Analysis, Tax Preparation",
      icon: "calculator",
      averageRisk: 78,
      assessmentCount: 1567,
    },
    {
      id: "legal",
      name: "Legal",
      description: "Contract Review, Research, Document Preparation",
      icon: "balance-scale",
      averageRisk: 35,
      assessmentCount: 892,
    },
  ];

  const exampleReports = {
    'product-manager': {
      title: 'Product Manager Assessment',
      risk: 38,
      riskLevel: 'Moderate Risk',
      timeline: '2-4 years',
      description: 'Comprehensive analysis of AI impact on product management roles, including task automation, strategic requirements, and future-proofing strategies.',
      riskAreas: [
        { task: 'Requirements documentation', level: 'High Risk', color: 'red' },
        { task: 'Market research analysis', level: 'Moderate Risk', color: 'amber' },
        { task: 'Strategic decision making', level: 'Low Risk', color: 'green' }
      ],
      actions: [
        'Focus on strategic and creative problem solving',
        'Develop stakeholder management expertise',
        'Learn to work with AI tools as productivity enhancers'
      ],
      details: [
        { task: 'PRD Writing', level: 'High', description: 'AI tools can generate detailed PRDs and user stories automatically.' },
        { task: 'Market Analysis', level: 'Medium', description: 'AI can process market data but needs human insight for strategy.' }
      ]
    },
    'designer': {
      title: 'Designer Assessment',
      risk: 42,
      riskLevel: 'Moderate Risk',
      timeline: '3-5 years',
      description: 'Analysis of AI impact on design roles, focusing on creative automation, design tools, and strategic design thinking.',
      riskAreas: [
        { task: 'Logo and basic graphics', level: 'High Risk', color: 'red' },
        { task: 'UI/UX wireframing', level: 'Moderate Risk', color: 'amber' },
        { task: 'User research & strategy', level: 'Low Risk', color: 'green' }
      ],
      actions: [
        'Focus on user research and design strategy',
        'Develop complex problem-solving skills',
        'Learn to collaborate with AI design tools'
      ],
      details: [
        { task: 'Basic Graphics', level: 'High', description: 'AI can generate logos, icons, and simple graphics automatically.' },
        { task: 'UI Design', level: 'Medium', description: 'AI assists with layouts but needs human creativity for innovation.' }
      ]
    },
    'marketing': {
      title: 'Marketing Assessment',
      risk: 65,
      riskLevel: 'High Risk',
      timeline: '1-3 years',
      description: 'Evaluation of AI impact on marketing roles, including content creation, campaign management, and data analysis.',
      riskAreas: [
        { task: 'Content writing & copywriting', level: 'High Risk', color: 'red' },
        { task: 'Social media management', level: 'High Risk', color: 'red' },
        { task: 'Brand strategy & positioning', level: 'Low Risk', color: 'green' }
      ],
      actions: [
        'Develop strategic brand thinking',
        'Focus on creative campaign concepts',
        'Learn advanced data interpretation skills'
      ],
      details: [
        { task: 'Content Writing', level: 'High', description: 'AI can generate blog posts, social content, and ad copy effectively.' },
        { task: 'Campaign Analytics', level: 'Medium', description: 'AI processes data but needs human insight for strategy.' }
      ]
    },
    'accounting': {
      title: 'Accounting Assessment',
      risk: 78,
      riskLevel: 'High Risk',
      timeline: '1-2 years',
      description: 'Analysis of AI automation in accounting, focusing on bookkeeping, financial analysis, and advisory services.',
      riskAreas: [
        { task: 'Data entry & bookkeeping', level: 'High Risk', color: 'red' },
        { task: 'Basic financial reporting', level: 'High Risk', color: 'red' },
        { task: 'Strategic financial advisory', level: 'Low Risk', color: 'green' }
      ],
      actions: [
        'Transition to advisory and strategic roles',
        'Develop client relationship skills',
        'Focus on complex financial planning'
      ],
      details: [
        { task: 'Bookkeeping', level: 'High', description: 'AI automates most data entry and transaction categorization.' },
        { task: 'Tax Prep', level: 'High', description: 'AI can handle standard tax returns with minimal human input.' }
      ]
    }
  };

  const currentExample = exampleReports[selectedExampleCareer as keyof typeof exampleReports];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button 
                  onClick={() => router.push('/')}
                  className="hover:opacity-75 transition-opacity"
                >
                  <Logo size="md" variant="light" showText={true} />
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">How It Works</a>
                <a href="#careers" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">Career Categories</a>
                <a href="#pricing" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">Pricing</a>
                
                {/* Authentication Section */}
                {isLoaded && (
                  <>
                    {isSignedIn ? (
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push('/dashboard')}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </Button>
                        <UserButton 
                          appearance={{
                            elements: {
                              avatarBox: "w-8 h-8"
                            }
                          }}
                          userProfileMode="navigation"
                          userProfileUrl="/dashboard"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => router.push('/sign-in')}
                        >
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </Button>
                        <Link href="/intake">
                          <Button size="sm">Start Assessment</Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
                
                {!isLoaded && (
                  <Link href="/intake">
                    <Button size="sm">Start Assessment</Button>
                  </Link>
                )}
              </div>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4 sm:mb-6">
                <Bot className="w-4 h-4 mr-2" />
                AI-Powered Career Analysis
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4 sm:mb-6">
                Will AI Replace Your Career?
                <span className="text-primary block mt-2">Get Your Risk Assessment</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 mb-6 sm:mb-8 leading-relaxed">
                Discover your likelihood of being replaced by AI, understand the timeline, and get personalized strategies to future-proof your career with our advanced AI analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/intake">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                    <ChartLine className="w-5 h-5 mr-2" />
                    Start Free Assessment
                  </Button>
                </Link>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-8 text-slate-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">10,000+ professionals analyzed</span>
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  <span className="text-sm sm:text-base">4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="mt-8 lg:mt-0">
              <Card className="shadow-2xl max-w-md mx-auto lg:max-w-none">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <RiskScoreCircle score={65} size={120} />
                  </div>
                  <CardTitle className="text-xl">Product Manager Risk Assessment</CardTitle>
                  <CardDescription>Risk Score: 65/100 (High-Moderate)</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {/* Task Analysis Preview */}
                  <div className="space-y-0">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900 text-sm">Stakeholder calls / PRDs</span>
                        <Badge className="bg-red-100 text-red-800 text-xs">High Risk</Badge>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Manus.ai and similar GPT-based writers can draft complete PRDs, user stories and acceptance criteria in seconds.
                        <span className="inline-block bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs ml-2">manus.im</span>
                      </p>
                    </div>

                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900 text-sm">Gap / requirements analysis</span>
                        <Badge className="bg-amber-100 text-amber-800 text-xs">Moderate</Badge>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Atlassian Intelligence surfaces unmet dependencies and recommends backlog items inside Jira.
                        <span className="inline-block bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs ml-2">atlassian.com</span>
                      </p>
                    </div>

                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-slate-900 text-sm">Project scheduling & ticketing</span>
                        <Badge className="bg-red-100 text-red-800 text-xs">High Risk</Badge>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Jira now auto-generates tickets, auto-prioritizes them and even fills story points.
                        <span className="inline-block bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs ml-2">atlassian.com</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-50">
                    <div className="text-sm text-slate-600 mb-3 text-center">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Estimated Timeline: <span className="font-semibold text-slate-900">2-4 years</span>
                    </div>
                    <Link href="/intake">
                      <Button className="w-full" size="sm">
                        Get Your Personalized Analysis
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI-powered analysis combines the latest developments in artificial intelligence with your specific career profile to provide accurate risk assessment and personalized recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-primary rounded-full mb-6">
                <ChartLine className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">1. Share Your Profile</h3>
              <p className="text-slate-600 leading-relaxed">
                Upload your resume or LinkedIn profile and provide details about your career, daily tasks, and professional focus areas. Our system securely processes your information.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-primary rounded-full mb-6">
                <Bot className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">2. AI Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                GPT-4 researches current AI capabilities and trends in your field, while our advanced models analyze replacement likelihood across multiple criteria.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-primary rounded-full mb-6">
                <ChartLine className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">3. Get Your Report</h3>
              <p className="text-slate-600 leading-relaxed">
                Receive a comprehensive risk score, timeline estimates, and personalized strategies to protect and advance your career in the age of AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Career Categories */}
      <section id="careers" className="py-12 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Career Categories</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              We analyze risk across major career categories, each with specialized assessment criteria tailored to industry-specific AI developments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {careerCategories.map((category) => (
              <CareerCategoryCard key={category.id} category={category} />
            ))}
            
            {/* Coming Soon Card */}
            <Card className="border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
              <CardContent className="flex items-center justify-center p-6 sm:p-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 text-slate-400 rounded-lg mb-4">
                    <ChartLine className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">More Categories</h3>
                  <p className="text-slate-500">Engineering, Sales, HR, and more coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">What Professionals Say</h2>
            <p className="text-lg sm:text-xl text-slate-600">Trusted by thousands of professionals worldwide</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Marketing Manager",
                content: "The assessment was eye-opening. I never realized how vulnerable my role as a content marketer was to AI automation. The recommendations helped me pivot to strategy."
              },
              {
                name: "Michael Rodriguez", 
                role: "UX Designer",
                content: "As a designer, I was worried about AI design tools. This report gave me clear steps to focus on strategic design thinking and user research."
              },
              {
                name: "David Kim",
                role: "Financial Analyst", 
                content: "The timeline predictions were incredibly accurate. I used the 18-month window to transition from junior accounting to financial analysis and advisory."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-600 mb-4 leading-relaxed">&quot;{testimonial.content}&quot;</p>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Example Reports */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Example Reports</h2>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto">
              See what insights and recommendations our AI provides for different career paths
            </p>
          </div>

          {/* Report Preview Carousel */}
          <div className="max-w-5xl mx-auto mb-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { id: 'product-manager', name: 'Product Manager' },
                    { id: 'designer', name: 'Designer' },
                    { id: 'marketing', name: 'Marketing' },
                    { id: 'accounting', name: 'Accounting' }
                  ].map((career) => (
                    <button
                      key={career.id}
                      onClick={() => setSelectedExampleCareer(career.id)}
                      className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                        selectedExampleCareer === career.id
                          ? 'border-primary bg-primary text-white'
                          : 'border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {career.name}
                    </button>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{currentExample.title}</h3>
                  <div className="flex items-center space-x-4 mb-4">
                    <Badge className={`${
                      currentExample.risk <= 33 ? 'bg-green-100 text-green-800' :
                      currentExample.risk <= 66 ? 'bg-amber-100 text-amber-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentExample.riskLevel} ({currentExample.risk}/100)
                    </Badge>
                    <span className="text-sm text-slate-600">Timeline: {currentExample.timeline}</span>
                  </div>
                  <p className="text-slate-600 mb-6">
                    {currentExample.description}
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">Key Risk Areas</h4>
                      <ul className="space-y-2 text-sm text-slate-600">
                        {currentExample.riskAreas.map((area, index) => (
                          <li key={index} className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-3 ${
                              area.color === 'red' ? 'bg-red-500' :
                              area.color === 'amber' ? 'bg-amber-500' :
                              'bg-green-500'
                            }`}></div>
                            {area.task} ({area.level})
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-900 mb-2">Recommended Actions</h4>
                      <ul className="space-y-1 text-sm text-slate-600">
                        {currentExample.actions.map((action, index) => (
                          <li key={index}>• {action}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <Card className="shadow-xl max-w-sm">
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4">
                      <RiskScoreCircle score={currentExample.risk} size={100} />
                    </div>
                    <CardTitle className="text-lg">{currentExample.title.split(' ')[0]} {currentExample.title.split(' ')[1]}</CardTitle>
                    <CardDescription>Risk Assessment Report</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-0">
                      {currentExample.details.map((detail, index) => (
                        <div key={index} className="px-4 py-3 border-b border-slate-200">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm text-slate-900">{detail.task}</span>
                            <Badge className={`text-xs ${
                              detail.level === 'High' ? 'bg-red-100 text-red-800' :
                              detail.level === 'Medium' ? 'bg-amber-100 text-amber-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {detail.level}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600">
                            {detail.description}
                          </p>
                        </div>
                      ))}
                      <div className="px-4 py-3 bg-slate-50">
                        <div className="text-xs text-slate-600 text-center mb-2">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Timeline: {currentExample.timeline}
                        </div>
                        <Button size="sm" className="w-full" onClick={() => router.push('/intake')}>
                          Get Your Assessment
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Report Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-primary rounded-lg mb-4">
                <ChartLine className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Risk Score Breakdown</h4>
              <p className="text-sm text-slate-600">Detailed analysis across multiple risk factors with timeline predictions</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-primary rounded-lg mb-4">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">AI Tool Analysis</h4>
              <p className="text-sm text-slate-600">Current and emerging AI tools specific to your industry and role</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-primary rounded-lg mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Career Strategies</h4>
              <p className="text-sm text-slate-600">Personalized recommendations to future-proof your career path</p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-primary rounded-lg mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Action Plan</h4>
              <p className="text-sm text-slate-600">Step-by-step guide with skills to develop and strategic moves to make</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg sm:text-xl text-slate-600">Get the insights you need to future-proof your career</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Free Assessment */}
            <Card className="border border-slate-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Free Assessment</CardTitle>
                <div className="text-4xl font-bold text-slate-900 my-2">$0</div>
                <CardDescription>Basic risk evaluation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-4">
                  {[
                    "Basic AI replacement risk score",
                    "General timeline estimate", 
                    "Risk breakdown by category",
                    "Industry comparison"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/intake">
                  <Button variant="outline" className="w-full" size="lg">
                    Start Free Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Full Report */}
            <Card className="border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white px-4 py-1">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Full Report</CardTitle>
                <div className="text-4xl font-bold text-slate-900 my-2">Free</div>
                <CardDescription>Sign up with email to unlock</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-4">
                  {[
                    "Everything in Free Assessment",
                    "Detailed AI impact analysis",
                    "Personalized mitigation strategies", 
                    "Career pivot recommendations",
                    "Skill development roadmap",
                    "Industry trend insights",
                    "Email delivery & PDF export"
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/intake">
                    <Button className="w-full shadow-lg" size="lg">
                      Get Full Report
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <p className="text-slate-600">
              Instant delivery • No spam ever
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Don&apos;t Wait for AI to Disrupt Your Career
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed">
            Take control of your professional future today. Get personalized insights and actionable strategies to stay ahead of AI automation in your industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/intake">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-lg">
                <ChartLine className="w-5 h-5 mr-2" />
                Start Your Assessment Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" variant="dark" showText={true} />
            </div>
            <p className="text-slate-300 mb-4">
              Protecting careers in the age of artificial intelligence
            </p>
            <div className="flex justify-center space-x-6 text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 