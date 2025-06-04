import Link from "next/link";
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
  PlayCircle
} from "lucide-react";

export default function Home() {
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
                <h1 className="text-xl font-bold text-slate-900">AICareerShield</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">How It Works</a>
                <a href="#careers" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">Career Categories</a>
                <a href="#pricing" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">Pricing</a>
                <Link href="/intake">
                  <Button>Start Assessment</Button>
                </Link>
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
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
                <Bot className="w-4 h-4 mr-2" />
                AI-Powered Career Analysis
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">
                Will AI Replace Your Career?
                <span className="text-primary block mt-2">Get Your Risk Assessment</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Discover your likelihood of being replaced by AI, understand the timeline, and get personalized strategies to future-proof your career with our advanced AI analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/intake">
                  <Button size="lg" className="shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                    <ChartLine className="w-5 h-5 mr-2" />
                    Start Free Assessment
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-slate-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-green-600" />
                  5-minute assessment
                </div>
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-green-600" />
                  100% confidential
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-green-600" />
                  10,000+ analyzed
                </div>
              </div>
            </div>
            <div className="lg:pl-12">
              {/* Sample Risk Assessment Card */}
              <Card className="bg-white rounded-2xl shadow-2xl border border-slate-200">
                <CardHeader className="text-center border-b border-slate-100">
                  <CardTitle className="text-xl font-bold">Product Manager Risk Assessment</CardTitle>
                  <CardDescription className="text-base">Risk Score: 65/100 (High-Moderate)</CardDescription>
                  <div className="flex justify-center mt-4">
                    <RiskScoreCircle score={65} size={100} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-0 p-0">
                  {/* Task Analysis Table */}
                  <div className="overflow-hidden">
                    <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
                      <h4 className="font-semibold text-slate-900 text-sm">Task-by-Task AI Impact Analysis</h4>
                    </div>
                    
                    {/* Task Rows */}
                    <div className="divide-y divide-slate-200">
                      {/* Spec Writing */}
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900 text-sm">Spec writing / PRDs</span>
                          <Badge className="bg-red-100 text-red-800 text-xs">High Risk</Badge>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Manus.ai and similar GPT-based writers can draft complete PRDs, user stories and acceptance criteria in seconds.
                          <span className="inline-block bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs ml-2">manus.im</span>
                        </p>
                      </div>

                      {/* Gap Analysis */}
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900 text-sm">Gap / requirements analysis</span>
                          <Badge className="bg-amber-100 text-amber-800 text-xs">Moderate</Badge>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Atlassian Intelligence surfaces unmet dependencies and recommends backlog items inside Jira.
                          <span className="inline-block bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs ml-2">atlassian.com</span>
                        </p>
                      </div>

                      {/* Project Scheduling */}
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900 text-sm">Project scheduling & ticketing</span>
                          <Badge className="bg-red-100 text-red-800 text-xs">High Risk</Badge>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Jira now autogenerates tickets, auto-prioritises them and even fills story points.
                          <span className="inline-block bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs ml-2">atlassian.com</span>
                        </p>
                      </div>

                      {/* Wireframes */}
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900 text-sm">Mock-ups & wireframes</span>
                          <Badge className="bg-amber-100 text-amber-800 text-xs">Moderate</Badge>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Figma's "AI designer" & Galileo AI create mid-fidelity wireframes from text prompts.
                          <span className="inline-block bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs ml-2">mckinsey.com</span>
                        </p>
                      </div>

                      {/* A/B Testing */}
                      <div className="px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-900 text-sm">A/B-test analysis</span>
                          <Badge className="bg-red-100 text-red-800 text-xs">High Risk</Badge>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          AI tools (Optimizely / VWO) now generate variations and run significance tests end-to-end.
                          <span className="inline-block bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-xs ml-2">looppanel.com</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline & CTA */}
                  <div className="px-6 py-4 bg-slate-50">
                    <div className="text-sm text-slate-600 mb-3 text-center">
                      <Clock className="w-4 h-4 inline mr-2" />
                      Estimated Timeline: <span className="font-semibold text-slate-900">2-4 years</span>
                    </div>
                    <Link href="/intake">
                      <Button className="w-full">
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
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI-powered analysis combines the latest developments in artificial intelligence with your specific career profile to provide accurate risk assessment and personalized recommendations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-primary rounded-full mb-6">
                <ChartLine className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">1. Share Your Profile</h3>
              <p className="text-slate-600 leading-relaxed">
                Upload your resume and provide details about your career, daily tasks, and professional focus areas. Our system securely processes your information.
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
      <section id="careers" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Career Categories</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We analyze risk across major career categories, each with specialized assessment criteria tailored to industry-specific AI developments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {careerCategories.map((category) => (
              <CareerCategoryCard key={category.id} category={category} />
            ))}
            
            {/* Coming Soon Card */}
            <Card className="border-2 border-dashed border-slate-300 hover:border-slate-400 transition-colors">
              <CardContent className="flex items-center justify-center p-8">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">What Professionals Say</h2>
            <p className="text-xl text-slate-600">Trusted by thousands of professionals worldwide</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
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
              <Card key={index} className="bg-slate-50">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-4">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600">Get the insights you need to future-proof your career</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                <div className="text-4xl font-bold text-slate-900 my-2">$49</div>
                <CardDescription>Comprehensive analysis & recommendations</CardDescription>
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

          <div className="text-center mt-8">
            <p className="text-slate-600">
              <Shield className="w-4 h-4 inline mr-2 text-green-600" />
              30-day money-back guarantee • Secure payment • Instant delivery
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Don't Wait for AI to Disrupt Your Career
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Take control of your professional future today. Get personalized insights and actionable strategies to stay ahead of AI automation in your industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/intake">
              <Button size="lg" variant="secondary" className="shadow-lg">
                <ChartLine className="w-5 h-5 mr-2" />
                Start Your Assessment Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              <PlayCircle className="w-5 h-5 mr-2" />
              Watch 2-Minute Demo
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              <span>10,000+ professionals analyzed</span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-2" />
              <span>4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-white mb-4">AICareerShield</h3>
              <p className="text-slate-400 mb-6 max-w-md leading-relaxed">
                Helping professionals navigate the AI revolution with data-driven insights and personalized career strategies.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">AI Trends Report</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Career Guides</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 AICareerShield. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 