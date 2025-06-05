import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  console.log('📊 [User Reports API] Starting request...');
  
  try {
    // Get the current user from Clerk
    const { userId } = await auth();
    
    if (!userId) {
      console.log('❌ [User Reports API] No authenticated user');
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    console.log('👤 [User Reports API] Fetching reports for user:', userId);
    
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Fetch profiles and their associated reports for this user
    const { data: profilesWithReports, error: dbError } = await supabase
      .from('profiles')
      .select(`
        id,
        role,
        created_at,
        profile_data,
        linkedin_data,
        reports (
          id,
          score,
          preview,
          created_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (dbError) {
      console.error('❌ [User Reports API] Database error:', dbError);
      return NextResponse.json({ error: 'Database error: ' + dbError.message }, { status: 500 });
    }

    // Transform the data to match the expected format
    const reports = profilesWithReports
      ?.filter(profile => profile.reports && profile.reports.length > 0)
      .map(profile => ({
        id: profile.id,
        score: profile.reports[0]?.score || 0,
        created_at: profile.reports[0]?.created_at || profile.created_at,
        profile: {
          role: profile.role,
          careerCategory: profile.profile_data?.careerCategory,
          yearsExperience: profile.profile_data?.yearsExperience,
          companySize: profile.profile_data?.companySize,
          dailyWorkSummary: profile.profile_data?.dailyWorkSummary,
          keySkills: profile.profile_data?.keySkills,
          linkedinUrl: profile.profile_data?.linkedinUrl,
          hasLinkedinData: !!profile.linkedin_data
        }
      })) || [];

    console.log(`✅ [User Reports API] Found ${reports.length} reports for user`);
    
    return NextResponse.json({ reports });
    
  } catch (error) {
    console.error('💥 [User Reports API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error instanceof Error ? error.message : String(error)) }, 
      { status: 500 }
    );
  }
} 