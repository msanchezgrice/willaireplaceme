'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@supabase/supabase-js';
import { ExternalLink, Filter, Search, ArrowUpDown, Bot, Menu, LogIn, User, ChartLine } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Logo } from "@/components/logo";

interface AICapability {
  id: string;
  industry: string;
  role: string;
  sub_role: string;
  main_workflow: string;
  subroutine: string;
  risk_level: string;
  ai_coverage: string;
  impact_type: string;
  tools: string;
  tool_urls: string;
  created_at?: string;
  updated_at?: string;
}

interface Filters {
  industry: string;
  role: string;
  riskLevel: string;
  impactType: string;
  mainWorkflow: string;
  ai_coverage: string;
  search: string;
}

interface SortConfig {
  key: keyof AICapability | null;
  direction: 'asc' | 'desc';
}

export default function AITrackerPage() {
  const router = useRouter();
  const { isSignedIn, user, isLoaded } = useUser();
  const [capabilities, setCapabilities] = useState<AICapability[]>([]);
  const [filteredCapabilities, setFilteredCapabilities] = useState<AICapability[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    industry: '',
    role: '',
    riskLevel: '',
    impactType: '',
    mainWorkflow: '',
    ai_coverage: '',
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
  const uniqueIndustries = [...new Set(capabilities.map(c => c.industry))].sort();
  const uniqueRoles = [...new Set(capabilities.map(c => c.role))].sort();
  const uniqueRiskLevels = ['Low', 'Moderate', 'High'];
  const uniqueImpactTypes = ['Replaced', 'Complemented'];
  const uniqueWorkflows = [...new Set(capabilities.map(c => c.main_workflow))].sort();

  useEffect(() => {
    fetchCapabilities();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [capabilities, filters, sortConfig]);

  const fetchCapabilities = async () => {
    try {
      if (!supabase) {
        setError('Database connection not configured. Please check environment variables.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('ai_capability_tracker')
        .select('*')
        .order('industry', { ascending: true });

      if (error) throw error;
      setCapabilities(data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching capabilities:', error);
      setError('Failed to load AI capabilities. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = capabilities;

    // Apply filters
    if (filters.industry) {
      filtered = filtered.filter(c => c.industry === filters.industry);
    }
    if (filters.role) {
      filtered = filtered.filter(c => c.role === filters.role);
    }
    if (filters.riskLevel) {
      filtered = filtered.filter(c => c.risk_level === filters.riskLevel);
    }
    if (filters.impactType) {
      filtered = filtered.filter(c => c.impact_type === filters.impactType);
    }
    if (filters.mainWorkflow) {
      filtered = filtered.filter(c => c.main_workflow === filters.mainWorkflow);
    }
    if (filters.ai_coverage) {
      filtered = filtered.filter(c => c.ai_coverage === filters.ai_coverage);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.subroutine.toLowerCase().includes(searchLower) ||
        c.tools.toLowerCase().includes(searchLower) ||
        c.role.toLowerCase().includes(searchLower)
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

    setFilteredCapabilities(filtered);
  };

  const handleSort = (key: keyof AICapability) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const resetFilters = () => {
    setFilters({
      industry: '',
      role: '',
      riskLevel: '',
      impactType: '',
      mainWorkflow: '',
      ai_coverage: '',
      search: ''
    });
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getImpactBadgeColor = (impact: string) => {
    return impact === 'Replaced' 
      ? 'bg-red-50 text-red-700 border-red-200'
      : 'bg-blue-50 text-blue-700 border-blue-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading AI capabilities...</p>
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
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Unable to Load AI Tracker</h2>
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
                <Link href="/#how-it-works" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">How It Works</Link>
                <Link href="/#careers" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">Career Categories</Link>
                <Link href="/ai-tracker" className="text-slate-900 bg-slate-100 px-3 py-2 text-sm font-medium rounded-md">
                  AI Capability Tracker
                </Link>
                <Link href="/#pricing" className="text-slate-600 hover:text-slate-900 px-3 py-2 text-sm font-medium transition-colors">Pricing</Link>
                
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
            <div className="inline-flex items-center bg-blue-600/20 text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Bot className="w-4 h-4 mr-2" />
              Real-time AI Capability Database
            </div>
            <h1 className="text-5xl font-bold mb-6">
              🤖 AI Capability Tracker
            </h1>
            <p className="text-xl text-slate-300 max-w-4xl mx-auto mb-8 leading-relaxed">
              Explore how AI tools are transforming specific workflows across industries. 
              Track replacement risks and discover which tasks are being automated or enhanced.
            </p>
            
            {/* Enhanced Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-green-400">
                  {capabilities.filter(c => c.risk_level === 'Low').length}
                </div>
                <div className="text-sm text-slate-300 mt-1">Low Risk Tasks</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-yellow-400">
                  {capabilities.filter(c => c.risk_level === 'Moderate').length}
                </div>
                <div className="text-sm text-slate-300 mt-1">Moderate Risk</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-red-400">
                  {capabilities.filter(c => c.risk_level === 'High').length}
                </div>
                <div className="text-sm text-slate-300 mt-1">High Risk Tasks</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-400">
                  {[...new Set(capabilities.map(c => c.industry))].length}
                </div>
                <div className="text-sm text-slate-300 mt-1">Industries</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filters */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-600" />
                <CardTitle className="text-lg">Filters & Search</CardTitle>
                <span className="text-sm text-slate-500">
                  ({filteredCapabilities.length} of {capabilities.length} results)
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
                  🚨 High Risk ({capabilities.filter(c => c.risk_level === 'High').length})
                </button>
                <button
                  onClick={() => setFilters({...filters, impactType: 'Replaced'})}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    filters.impactType === 'Replaced' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  ⚡ Being Replaced ({capabilities.filter(c => c.impact_type === 'Replaced').length})
                </button>
                <button
                  onClick={() => setFilters({...filters, mainWorkflow: 'Creative'})}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    filters.mainWorkflow === 'Creative' 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  🎨 Creative Work ({capabilities.filter(c => c.main_workflow === 'Creative').length})
                </button>
                <button
                  onClick={() => setFilters({...filters, mainWorkflow: 'Analysis'})}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    filters.mainWorkflow === 'Analysis' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  📊 Analysis ({capabilities.filter(c => c.main_workflow === 'Analysis').length})
                </button>
                <button
                  onClick={() => setFilters({...filters, ai_coverage: 'FR'})}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                    filters.ai_coverage === 'FR' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  🚫 Fully Replaced ({capabilities.filter(c => c.ai_coverage === 'FR').length})
                </button>
              </div>
            </div>

            {/* Detailed Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Industry</label>
                <select
                  value={filters.industry}
                  onChange={(e) => setFilters({...filters, industry: e.target.value})}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">All Industries</option>
                  {uniqueIndustries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Role</label>
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({...filters, role: e.target.value})}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">All Roles</option>
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Risk Level</label>
                <select
                  value={filters.riskLevel}
                  onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">All Risk Levels</option>
                  {uniqueRiskLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Impact Type</label>
                <select
                  value={filters.impactType}
                  onChange={(e) => setFilters({...filters, impactType: e.target.value})}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">All Impact Types</option>
                  {uniqueImpactTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Workflow</label>
                <select
                  value={filters.mainWorkflow}
                  onChange={(e) => setFilters({...filters, mainWorkflow: e.target.value})}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">All Workflows</option>
                  {uniqueWorkflows.map(workflow => (
                    <option key={workflow} value={workflow}>{workflow}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">AI Coverage</label>
                <select
                  value={filters.ai_coverage}
                  onChange={(e) => setFilters({...filters, ai_coverage: e.target.value})}
                  className="w-full p-2 border rounded-md text-sm"
                >
                  <option value="">All AI Coverage</option>
                  <option value="PA">Partial Automation</option>
                  <option value="AO">Automated Optimized</option>
                  <option value="FR">Fully Replaced</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tasks, tools..."
                    value={filters.search}
                    onChange={(e) => setFilters({...filters, search: e.target.value})}
                    className="w-full pl-10 pr-3 py-2 border rounded-md text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Table View */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('subroutine')}>
                    <div className="flex items-center space-x-2">
                      <span>Task / Workflow</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('industry')}>
                    <div className="flex items-center space-x-2">
                      <span>Industry</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('role')}>
                    <div className="flex items-center space-x-2">
                      <span>Role</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('risk_level')}>
                    <div className="flex items-center space-x-2">
                      <span>Risk Level</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors"
                      onClick={() => handleSort('impact_type')}>
                    <div className="flex items-center space-x-2">
                      <span>Impact</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    AI Tool
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredCapabilities.map((capability, index) => (
                  <tr key={capability.id} className={`hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{capability.subroutine}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {capability.main_workflow}
                          </Badge>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{capability.industry}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{capability.role}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="outline" 
                        className={getRiskBadgeColor(capability.risk_level)}
                      >
                        {capability.risk_level}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="outline" 
                        className={getImpactBadgeColor(capability.impact_type)}
                      >
                        {capability.impact_type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-900">{capability.tools}</div>
                        {capability.tool_urls && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 ml-2"
                            onClick={() => window.open(capability.tool_urls, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCapabilities.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No capabilities found</h3>
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