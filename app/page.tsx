"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CareerCategoryCard } from "@/components/career-category-card";
import { RiskScoreCircle } from "@/components/risk-score-circle";
import { 
  Bot, 
  ChartLine, 
  Clock, 
  Shield, 
  Users, 
  CheckCircle,
  Star,
  ArrowRight,
  Menu,
  Linkedin,
  LogIn,
  User
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();

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
                  className="text-xl font-bold text-slate-900 hover:text-primary transition-colors"
                >
                  AICareerShield
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
                <Link href="/intake">
                  <Button className="w-full shadow-lg" size="lg">
                    Get Full Report
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-6 sm:mt-8">
            <p className="text-slate-600">
              <Shield className="w-4 h-4 inline mr-2 text-green-600" />
              Secure signup • Instant delivery • No spam ever
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
            <h3 className="text-2xl font-bold mb-4">AICareerShield</h3>
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