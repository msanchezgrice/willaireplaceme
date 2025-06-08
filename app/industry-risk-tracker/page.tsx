'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@supabase/supabase-js';
import { ExternalLink, Filter, Search, ArrowUpDown, Bot, Menu, LogIn, User, ChartLine, TrendingUp, Users, Building } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo";

interface IndustryRisk {
  id: number;
  industry: string;
  roles: string;
  timeline: string;
  risk_level: string;
  impact_type: string;
  tools: string;
  workforce_millions: number;
  source_name: string;
  source_url: string;
  created_at?: string;
  updated_at?: string;
}

interface Filters {
  industry: string;
  riskLevel: string;
  timeline: string;
  search: string;
}

interface SortConfig {
  key: keyof IndustryRisk | null;
  direction: 'asc' | 'desc';
}

export default function IndustryRiskTrackerPage() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const [industries, setIndustries] = useState<IndustryRisk[]>([]);
  const [filteredIndustries, setFilteredIndustries] = useState<IndustryRisk[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    industry: '',
    riskLevel: '',
    timeline: '',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  // Initialize Supabase client safely
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const supabase = supabaseUrl && supabaseKey 
    ? createClient(supabaseUrl, supabaseKey)
    : null;

  // Get unique values for filter dropdowns
  const uniqueIndustries = [...new Set(industries.map(i => i.industry))].sort();
  const uniqueRiskLevels = [...new Set(industries.map(i => i.risk_level))].sort();
  const uniqueTimelines = [...new Set(industries.map(i => i.timeline))].sort();

  useEffect(() => {
    fetchIndustries();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [industries, filters, sortConfig]);

  const fetchIndustries = async () => {
    try {
      if (!supabase) {
        setError('Database connection not configured. Please check environment variables.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('industry_risk_dashboard')
        .select('*')
        .order('workforce_millions', { ascending: false });

      if (error) throw error;
      setIndustries(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching industries:', error);
      setError('Failed to load industry risk data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = industries;

    // Apply filters
    if (filters.industry) {
      filtered = filtered.filter(i => i.industry === filters.industry);
    }
    if (filters.riskLevel) {
      filtered = filtered.filter(i => i.risk_level === filters.riskLevel);
    }
    if (filters.timeline) {
      filtered = filtered.filter(i => i.timeline === filters.timeline);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(i => 
        i.industry.toLowerCase().includes(searchLower) ||
        i.roles.toLowerCase().includes(searchLower) ||
        i.impact_type.toLowerCase().includes(searchLower) ||
        i.tools.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key!];
        const bVal = b[sortConfig.key!];
        
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredIndustries(filtered);
  };

  const handleSort = (key: keyof IndustryRisk) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const resetFilters = () => {
    setFilters({
      industry: '',
      riskLevel: '',
      timeline: '',
      search: ''
    });
  };

  const getRiskBadgeColor = (risk: string) => {
    if (risk.includes('High')) return 'bg-red-100 text-red-800 border-red-200';
    if (risk.includes('Moderate')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (risk.includes('Low')) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTimelineBadgeColor = (timeline: string) => {
    if (timeline.includes('1-3')) return 'bg-red-50 text-red-700 border-red-200';
    if (timeline.includes('3-5') || timeline.includes('2-5')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (timeline.includes('5-10')) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const formatRoles = (rolesString: string) => {
    return rolesString.split(';').map(role => role.trim());
  };

  const formatTools = (toolsString: string) => {
    return toolsString.split(';').map(tool => tool.trim());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading industry risk data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="text-red-500 mb-4">
              <ExternalLink className="h-12 w-12 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Unable to Load Industry Risk Tracker</h2>
            <p className="text-slate-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link href="/" className="hover:opacity-75 transition-opacity">
                  <Logo size="md" variant="light" showText={true} />
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">Home</Link>
                <Link href="/ai-tracker" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">
                  AI Capability Tracker
                </Link>
                <Link href="/industry-risk-tracker" className="text-slate-900 bg-slate-100 px-3 py-2 text-sm font-medium rounded-md">
                  Industry Risk Tracker
                </Link>
                
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
                          <Button size="sm">
                            <ChartLine className="w-4 h-4 mr-2" />
                            Start Assessment
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
                
                {!isLoaded && (
                  <Link href="/intake">
                    <Button size="sm">
                      <ChartLine className="w-4 h-4 mr-2" />
                      Start Assessment
                    </Button>
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

      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center bg-purple-600/20 text-purple-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Building className="w-4 h-4 mr-2" />
              Industry-Wide Risk Analysis
            </div>
            <h1 className="text-5xl font-bold mb-6">
              🏭 Industry Risk Tracker
            </h1>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Comprehensive analysis of AI automation risk across major industries. 
              Understand workforce impact, timeline predictions, and automation trends affecting millions of workers.
            </p>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-red-400">
                  {industries.filter(i => i.risk_level.includes('High')).length}
                </div>
                <div className="text-sm text-slate-300 mt-1">High Risk Industries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400">
                  {industries.reduce((sum, i) => sum + i.workforce_millions, 0).toFixed(1)}M
                </div>
                <div className="text-sm text-slate-300 mt-1">Workers Analyzed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-yellow-400">
                  {industries.filter(i => i.timeline.includes('1-3')).length}
                </div>
                <div className="text-sm text-slate-300 mt-1">Near-term Impact</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-green-400">
                  {industries.length}
                </div>
                <div className="text-sm text-slate-300 mt-1">Industries Covered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-600" />
                <CardTitle className="text-lg">Filters & Search</CardTitle>
                <span className="text-sm text-slate-500">
                  ({filteredIndustries.length} of {industries.length} industries)
                </span>
              </div>
              <Button variant="outline" onClick={resetFilters} className="text-sm hover:bg-red-50 hover:text-red-600">
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Quick Filter Chips */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-slate-700 mb-3">Quick Filters</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilters({...filters, riskLevel: 'High'})}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    filters.riskLevel === 'High' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  🚨 High Risk ({industries.filter(i => i.risk_level.includes('High')).length})
                </button>
                <button
                  onClick={() => setFilters({...filters, timeline: '1-3 yr'})}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    filters.timeline === '1-3 yr' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ⚡ Near-term (1-3 yr) ({industries.filter(i => i.timeline.includes('1-3')).length})
                </button>
                <button
                  onClick={() => setFilters({...filters, timeline: '5-10 yr'})}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    filters.timeline === '5-10 yr' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  🔮 Long-term (5-10 yr) ({industries.filter(i => i.timeline.includes('5-10')).length})
                </button>
              </div>
            </div>

            {/* Detailed Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Industry</label>
                <select
                  value={filters.industry}
                  onChange={(e) => setFilters({...filters, industry: e.target.value})}
                  className="w-full p-3 border-0 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                >
                  <option value="">All Industries</option>
                  {uniqueIndustries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Risk Level</label>
                <select
                  value={filters.riskLevel}
                  onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
                  className="w-full p-3 border-0 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                >
                  <option value="">All Risk Levels</option>
                  {uniqueRiskLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Timeline</label>
                <select
                  value={filters.timeline}
                  onChange={(e) => setFilters({...filters, timeline: e.target.value})}
                  className="w-full p-3 border-0 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                >
                  <option value="">All Timelines</option>
                  {uniqueTimelines.map(timeline => (
                    <option key={timeline} value={timeline}>{timeline}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search industries, roles..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="w-full pl-10 pr-3 py-3 border-0 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Cards View */}
        <div className="grid gap-6">
          {filteredIndustries.map((industry, index) => (
            <Card key={industry.id} className="shadow-lg hover:shadow-xl transition-shadow border-0">
              <CardContent className="p-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Industry Info */}
                  <div className="lg:col-span-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{industry.industry}</h3>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge className={getRiskBadgeColor(industry.risk_level)}>
                            {industry.risk_level}
                          </Badge>
                          <Badge className={getTimelineBadgeColor(industry.timeline)}>
                            {industry.timeline}
                          </Badge>
                        </div>
                        <div className="flex items-center text-slate-600 mb-2">
                          <Users className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">{industry.workforce_millions}M workers affected</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">AI Impact</h4>
                        <p className="text-sm text-slate-600">{industry.impact_type}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Source</h4>
                        <a 
                          href={industry.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 underline inline-flex items-center"
                        >
                          {industry.source_name}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Roles */}
                  <div className="lg:col-span-1">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Affected Roles</h4>
                    <div className="flex flex-wrap gap-1">
                      {formatRoles(industry.roles).map((role, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs bg-slate-50">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* AI Tools */}
                  <div className="lg:col-span-1">
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Key AI Tools</h4>
                    <div className="space-y-1">
                      {formatTools(industry.tools).slice(0, 4).map((tool, idx) => (
                        <div key={idx} className="text-sm text-slate-600 flex items-center">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                          {tool}
                        </div>
                      ))}
                      {formatTools(industry.tools).length > 4 && (
                        <div className="text-xs text-slate-500">
                          +{formatTools(industry.tools).length - 4} more tools
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIndustries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No industries found</h3>
            <p className="text-slate-600">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

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