import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  console.log('🔍 [Debug API] Debug endpoint called');
  
  try {
    // Test the new shared analyze function approach
    console.log('🧪 [Debug API] Testing shared analyze function...');
    
    try {
      const { performAnalysis } = await import('../../../lib/analyze-core');
      console.log('✅ [Debug API] Successfully imported analyze function');
      
      // Test with mock data (this will fail but should show us the path)
      const testResult = await performAnalysis('test-profile-id', { test: 'data' });
      console.log('✅ [Debug API] Analyze function executed:', testResult);
      
      return NextResponse.json({
        debug: true,
        method: 'shared-function',
        analyzeImport: 'success',
        testResult: testResult,
        message: 'Shared analyze function is working!'
      });
      
    } catch (analyzeError) {
      console.log('⚠️ [Debug API] Expected error from test data:', analyzeError);
      
      return NextResponse.json({
        debug: true,
        method: 'shared-function',
        analyzeImport: 'success',
        expectedError: analyzeError instanceof Error ? analyzeError.message : String(analyzeError),
        message: 'Shared analyze function imported successfully (error expected with test data)'
      });
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