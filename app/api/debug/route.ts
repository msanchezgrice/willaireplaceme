import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  console.log('🔍 [Debug API] Debug endpoint called');
  
  try {
    // Test the analyze API endpoint
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NODE_ENV === 'production'
      ? 'https://willaireplace.me'
      : 'http://localhost:3000';
    
    console.log('🌐 [Debug API] Testing base URL:', baseUrl);
    
    // Test a simple ping to the analyze endpoint
    const testResponse = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'CareerGuard-Debug/1.0'
      },
      body: JSON.stringify({
        profile_id: 'test-profile-id',
        evidence: { test: 'data' }
      })
    });
    
    console.log('📡 [Debug API] Test response status:', testResponse.status);
    console.log('📡 [Debug API] Test response headers:', Object.fromEntries(testResponse.headers.entries()));
    
    const responseText = await testResponse.text();
    console.log('📡 [Debug API] Test response body:', responseText.substring(0, 500));
    
    return NextResponse.json({
      debug: true,
      baseUrl,
      testEndpoint: `${baseUrl}/api/analyze`,
      testResponse: {
        status: testResponse.status,
        statusText: testResponse.statusText,
        headers: Object.fromEntries(testResponse.headers.entries()),
        body: responseText.substring(0, 500)
      },
      environment: {
        VERCEL_URL: process.env.VERCEL_URL,
        NODE_ENV: process.env.NODE_ENV
      }
    });
    
  } catch (error) {
    console.error('💥 [Debug API] Error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 });
  }
} 