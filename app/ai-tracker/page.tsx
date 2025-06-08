'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@supabase/supabase-js';
import { ExternalLink, Filter, Search, ArrowUpDown } from 'lucide-react';

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
  search: string;
}

interface SortConfig {
  key: keyof AICapability | null;
  direction: 'asc' | 'desc';
}

export default function AITrackerPage() {
  const [capabilities, setCapabilities] = useState<AICapability[]>([]);
  const [filteredCapabilities, setFilteredCapabilities] = useState<AICapability[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    industry: '',
    role: '',
    riskLevel: '',
    impactType: '',
    mainWorkflow: '',
    search: ''
  });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  // Initialize Supabase client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

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
      const { data, error } = await supabase
        .from('ai_capability_tracker')
        .select('*')
        .order('industry', { ascending: true });

      if (error) throw error;
      setCapabilities(data || []);
    } catch (error) {
      console.error('Error fetching capabilities:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              🤖 AI Capability Tracker
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Explore how AI tools are transforming specific workflows across industries. 
              Track replacement risks and discover which tasks are being automated or enhanced.
            </p>
            <div className="mt-6 flex justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-600">{capabilities.filter(c => c.risk_level === 'Low').length} Low Risk Tasks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-slate-600">{capabilities.filter(c => c.risk_level === 'Moderate').length} Moderate Risk Tasks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-600">{capabilities.filter(c => c.risk_level === 'High').length} High Risk Tasks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-slate-600" />
                <CardTitle>Filters & Search</CardTitle>
              </div>
              <Button variant="outline" onClick={resetFilters} className="text-sm">
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
            
            <div className="text-sm text-slate-600">
              Showing {filteredCapabilities.length} of {capabilities.length} capabilities
            </div>
          </CardContent>
        </Card>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapabilities.map((capability) => (
            <Card key={capability.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{capability.subroutine}</CardTitle>
                    <CardDescription className="mt-1">
                      {capability.industry} • {capability.role}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getRiskBadgeColor(capability.risk_level)}
                  >
                    {capability.risk_level}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Workflow:</span>
                    <Badge variant="outline">{capability.main_workflow}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Impact:</span>
                    <Badge 
                      variant="outline" 
                      className={getImpactBadgeColor(capability.impact_type)}
                    >
                      {capability.impact_type}
                    </Badge>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-slate-700">AI Tool:</span>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-sm text-slate-600">{capability.tools}</span>
                      {capability.tool_urls && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => window.open(capability.tool_urls, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <span>Coverage: {capability.ai_coverage === 'PA' ? 'Partial' : 'Optimized'}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
    </div>
  );
} 