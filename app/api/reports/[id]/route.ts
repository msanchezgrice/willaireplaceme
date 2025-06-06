import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  console.log('📊 [Reports API] Fetching report for profile:', params.id);
  
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Fetch the report for this profile
    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('profile_id', params.id)
      .single();

    if (error) {
      console.log('⚠️ [Reports API] Report not found:', error.message);
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    console.log('✅ [Reports API] Report found:', {
      id: report.id,
      profile_id: report.profile_id,
      score: report.score,
      has_preview: !!report.preview,
      has_full_report: !!report.full_report
    });

    return NextResponse.json({
      id: report.id,
      profile_id: report.profile_id,
      score: report.score,
      preview: report.preview,
      full_report: report.full_report,
      evidence: report.evidence,
      created_at: report.created_at
    });

  } catch (error) {
    console.error('💥 [Reports API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 