import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  console.log('🔍 [Debug API] Debug endpoint called');
  
  try {
    // Test the new shared analyze function approach
    console.log('🧪 [Debug API] Testing shared analyze function...');
    
    try {
      const { performAnalysis } = await import('../../../lib/analyze-core');
      console.log('✅ [Debug API] Successfully imported analyze function');
      
      // Get a real profile ID from the database
      console.log('🔍 [Debug API] Fetching real profile for testing...');
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, created_at')
        .order('created_at', { ascending: false })
        .limit(3);
        
      if (profileError) {
        console.error('❌ [Debug API] Error fetching profiles:', profileError);
        return NextResponse.json({
          debug: true,
          error: 'Could not fetch profiles: ' + profileError.message
        }, { status: 500 });
      }
      
      console.log('📋 [Debug API] Found profiles:', profiles?.map(p => ({ id: p.id, role: p.role })));
      
      if (!profiles || profiles.length === 0) {
        return NextResponse.json({
          debug: true,
          message: 'No profiles found in database to test with'
        });
      }
      
      // Test with the most recent profile
      const testProfile = profiles[0];
      console.log('🧪 [Debug API] Testing with profile:', testProfile.id);
      
      // Create mock evidence for testing
      const mockEvidence = {
        taskFacts: [
          {
            task: "campaign management",
            riskLevel: "Moderate",
            evidence: "AI-powered ad optimization tools",
            impact: "30-40%",
            timeline: "2-3 years",
            sourceUrl: "Industry research",
            toolsExample: "Google Ads AI, Facebook Campaign Budget Optimization"
          }
        ],
        macroStats: [
          {
            statistic: "40% of marketing tasks could be automated by 2027",
            source: "McKinsey Global Institute",
            url: "Industry research reports",
            year: "2024",
            relevance: "Directly impacts campaign management roles"
          }
        ],
        industryContext: {
          overview: "Marketing automation is advancing rapidly with AI tools becoming more sophisticated.",
          keyTrends: ["Programmatic advertising", "AI-powered creative optimization", "Automated campaign management"],
          timeHorizon: "3-5 years for significant impact"
        }
      };
      
      console.log('🚀 [Debug API] Testing performAnalysis function...');
      const testResult = await performAnalysis(testProfile.id, mockEvidence);
      console.log('✅ [Debug API] Analyze function executed successfully:', testResult);
      
      return NextResponse.json({
        debug: true,
        method: 'shared-function',
        analyzeImport: 'success',
        testProfile: {
          id: testProfile.id,
          role: testProfile.role
        },
        testResult: testResult,
        message: 'Shared analyze function is working with real data!'
      });
      
    } catch (analyzeError) {
      console.error('❌ [Debug API] Analysis function failed:', analyzeError);
      
      return NextResponse.json({
        debug: true,
        method: 'shared-function',
        analyzeImport: 'success',
        error: analyzeError instanceof Error ? analyzeError.message : String(analyzeError),
        errorStack: analyzeError instanceof Error ? analyzeError.stack : 'No stack trace',
        message: 'Analyze function failed during execution'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('💥 [Debug API] Error:', error);
    return NextResponse.json({
      debug: true,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace',
      message: 'Failed to test shared analyze function'
    }, { status: 500 });
  }
} 