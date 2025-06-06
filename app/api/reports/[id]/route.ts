import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

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

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const reportId = params.id;
  console.log('🗑️ [Reports API] Deleting report:', reportId);
  
  try {
    // Get the current user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      console.log('❌ [Reports API] No authenticated user for delete');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // First, verify the report belongs to the authenticated user
    const { data: report, error: fetchError } = await supabase
      .from('reports')
      .select(`
        id,
        profiles!inner(user_id)
      `)
      .eq('id', reportId)
      .single();

    if (fetchError) {
      console.log('⚠️ [Reports API] Report not found for delete:', fetchError.message);
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Check if the report belongs to the authenticated user
    if ((report.profiles as any)?.user_id !== userId) {
      console.log('❌ [Reports API] Unauthorized delete attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the report (this will also delete the associated profile due to cascade)
    const { error: deleteError } = await supabase
      .from('reports')
      .delete()
      .eq('id', reportId);

    if (deleteError) {
      console.error('❌ [Reports API] Error deleting report:', deleteError);
      return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
    }

    console.log('✅ [Reports API] Report deleted successfully:', reportId);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('💥 [Reports API] Delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 