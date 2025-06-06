import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  console.log('🔍 [Debug API] Debug endpoint called');
  
  try {
    // Get current user from Clerk
    const { userId, sessionId } = await auth();
    console.log('👤 [Debug API] Current user:', { userId, sessionId });
    
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Check if we should backfill the current user
    const url = new URL(req.url);
    const shouldBackfill = url.searchParams.get('backfill') === 'true';
    
    if (shouldBackfill && userId) {
      console.log('🔄 [Debug API] Backfilling current user to database...');
      
      // Check if user already has a profile
      const { data: existingProfile, error: existingError } = await supabase
        .from('profiles')
        .select('id, user_id')
        .eq('user_id', userId)
        .single();
        
      if (!existingProfile && existingError?.message?.includes('No rows')) {
        // Create a placeholder profile for this user
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            user_id: userId,
            email: null, // Will be populated if/when we get user data from Clerk
            role: null, // Will be filled when they create their first assessment
            resume: null,
            task_hours: {},
            profile_data: {
              created_with_auth: true,
              created_via_backfill: true,
              backfill_date: new Date().toISOString()
            },
            linkedin_data: null
          }])
          .select()
          .single();
          
        if (createError) {
          console.error('❌ [Debug API] Error creating backfill profile:', createError);
        } else {
          console.log('✅ [Debug API] Created backfill profile:', newProfile.id);
        }
      } else if (existingProfile) {
        console.log('ℹ️ [Debug API] User already has profile:', existingProfile.id);
      }
    }
    
    // Get all profiles with their user_ids
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id, role, created_at, profile_data')
      .order('created_at', { ascending: false });
      
    if (profileError) {
      console.error('❌ [Debug API] Error fetching profiles:', profileError);
      return NextResponse.json({
        debug: true,
        error: 'Could not fetch profiles: ' + profileError.message
      }, { status: 500 });
    }
    
    // Get all reports with their user associations
    const { data: reports, error: reportError } = await supabase
      .from('reports')
      .select(`
        id,
        score,
        preview,
        created_at,
        profiles!inner(user_id, role)
      `)
      .order('created_at', { ascending: false });
      
    if (reportError) {
      console.error('❌ [Debug API] Error fetching reports:', reportError);
    }
    
    return NextResponse.json({
      debug: true,
      currentUser: {
        userId,
        sessionId,
        isAuthenticated: !!userId
      },
      database: {
        profiles: profiles?.map(p => ({
          id: p.id,
          user_id: p.user_id,
          role: p.role,
          created_at: p.created_at,
          has_auth: p.profile_data?.created_with_auth,
          created_via: p.profile_data?.created_via_webhook ? 'webhook' : 
                      p.profile_data?.created_via_backfill ? 'backfill' : 'assessment'
        })),
        reports: reports?.map(r => ({
          id: r.id,
          score: r.score,
          created_at: r.created_at,
          profile_user_id: (r.profiles as any)?.user_id,
          profile_role: (r.profiles as any)?.role
        })),
        userMatches: {
          profilesForCurrentUser: profiles?.filter(p => p.user_id === userId).length || 0,
          reportsForCurrentUser: reports?.filter(r => (r.profiles as any)?.user_id === userId).length || 0
        }
      },
      analysis: {
        uniqueUserIds: [...new Set(profiles?.map(p => p.user_id).filter(Boolean))],
        profilesWithoutUserId: profiles?.filter(p => !p.user_id).length || 0,
        profilesWithUserId: profiles?.filter(p => p.user_id).length || 0
      },
      actions: {
        backfillCurrentUser: shouldBackfill ? 'executed' : 'available',
        backfillUrl: `${url.origin}${url.pathname}?backfill=true`
      }
    });
    
  } catch (error) {
    console.error('💥 [Debug API] Error:', error);
    return NextResponse.json({
      debug: true,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 });
  }
} 