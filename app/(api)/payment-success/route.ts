import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const { paymentIntentId } = await req.json();
    
    // For MVP, we'll just return success
    // In production, you'd verify the payment with Stripe and update database
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment success handling error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment success' },
      { status: 500 }
    );
  }
} 