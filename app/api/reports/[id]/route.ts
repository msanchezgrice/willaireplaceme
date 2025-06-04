import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  console.log('📊 [Reports API] Starting report fetch request...');
  
  try {
    const params = await context.params;
    console.log('🆔 [Reports API] Profile ID:', params.id);
    
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    console.log('✅ [Reports API] Supabase client created');

    console.log('🔍 [Reports API] Querying reports table...');
    const { data: report, error: dbError } = await supabase
      .from('reports')
      .select('*')
      .eq('profile_id', params.id)
      .single();

    if (dbError) {
      console.error('❌ [Reports API] Database error:', dbError);
      if (dbError.code === 'PGRST116') {
        console.log('📄 [Reports API] No report found yet (still processing)');
        return NextResponse.json({ error: 'Report not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Database error: ' + dbError.message }, { status: 500 });
    }

    if (!report) {
      console.log('📄 [Reports API] No report found for profile:', params.id);
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    console.log('✅ [Reports API] Report found:', {
      id: report.id,
      score: report.score,
      preview_length: report.preview?.length,
      full_report_length: report.full_report?.length,
      created_at: report.created_at
    });

    const response = {
      id: report.id,
      score: report.score,
      preview: report.preview,
      full_report: report.full_report,
      evidence: report.evidence,
      created_at: report.created_at
    };

    console.log('✅ [Reports API] Sending response');
    return NextResponse.json(response);

  } catch (error) {
    console.error('💥 [Reports API] Unexpected error:', error);
    console.error('📚 [Reports API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to fetch report: ' + (error instanceof Error ? error.message : String(error)) }, 
      { status: 500 }
    );
  }
} 