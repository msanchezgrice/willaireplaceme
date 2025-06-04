import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { assessmentId } = await req.json();
    
    // For MVP, we'll return a mock payment intent
    // In production, you'd integrate with Stripe here
    return NextResponse.json({
      clientSecret: 'pi_mock_client_secret',
      amount: 4900
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
} 