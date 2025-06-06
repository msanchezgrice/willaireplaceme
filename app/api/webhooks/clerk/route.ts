import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'svix';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  console.log('🔗 [Clerk Webhook] Received webhook');
  
  try {
    // Get the headers from request
    const svixId = req.headers.get("svix-id");
    const svixTimestamp = req.headers.get("svix-timestamp");
    const svixSignature = req.headers.get("svix-signature");
    
    // If there are no headers, error out
    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('❌ [Clerk Webhook] Missing svix headers');
      return NextResponse.json({ error: 'Error occurred -- no svix headers' }, { status: 400 });
    }
    
    // Get the body
    const payload = await req.text();
    const body = JSON.parse(payload);
    
    // Get the Webhook secret
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!WEBHOOK_SECRET) {
      console.error('❌ [Clerk Webhook] Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
      return NextResponse.json({ error: 'Missing webhook secret' }, { status: 500 });
    }
    
    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);
    
    let evt: any;
    
    // Verify the payload with the headers
    try {
      evt = wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as any;
    } catch (err) {
      console.error('❌ [Clerk Webhook] Error verifying webhook:', err);
      return NextResponse.json({ error: 'Error occurred' }, { status: 400 });
    }
    
    console.log('✅ [Clerk Webhook] Verified webhook event:', evt.type);
    
    const { id } = evt.data;
    const eventType = evt.type;
    
    // Initialize Supabase client
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    if (eventType === 'user.created') {
      console.log('👤 [Clerk Webhook] Creating user in Supabase:', id);
      
      const { data: userData } = evt;
      const email = userData.email_addresses?.[0]?.email_address || null;
      const firstName = userData.first_name || '';
      const lastName = userData.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      
      // Create user record in a users table
      // First, let's check if we have a users table, if not we'll extend profiles
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', id)
        .single();
        
      if (!existingUser && !checkError?.message?.includes('No rows')) {
        console.error('❌ [Clerk Webhook] Error checking existing user:', checkError);
      }
      
      if (!existingUser) {
        // Create a base profile record for the user
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([{
            user_id: id,
            email: email,
            role: null, // Will be filled when they create their first assessment
            resume: null,
            task_hours: {},
            profile_data: {
              clerk_user_data: {
                firstName,
                lastName,
                fullName,
                email,
                created_at: userData.created_at,
                updated_at: userData.updated_at
              },
              created_with_auth: true,
              created_via_webhook: true
            },
            linkedin_data: null
          }])
          .select()
          .single();
          
        if (createError) {
          console.error('❌ [Clerk Webhook] Error creating user profile:', createError);
          return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 });
        }
        
        console.log('✅ [Clerk Webhook] Created user profile:', newProfile.id);
      } else {
        console.log('ℹ️ [Clerk Webhook] User already exists in database');
      }
    }
    
    if (eventType === 'user.updated') {
      console.log('👤 [Clerk Webhook] Updating user in Supabase:', id);
      
      const { data: userData } = evt;
      const email = userData.email_addresses?.[0]?.email_address || null;
      const firstName = userData.first_name || '';
      const lastName = userData.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      
      // Update user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          email: email,
          profile_data: {
            clerk_user_data: {
              firstName,
              lastName,
              fullName,
              email,
              created_at: userData.created_at,
              updated_at: userData.updated_at
            },
            created_with_auth: true,
            updated_via_webhook: true
          }
        })
        .eq('user_id', id);
        
      if (updateError) {
        console.error('❌ [Clerk Webhook] Error updating user profile:', updateError);
        return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 });
      }
      
      console.log('✅ [Clerk Webhook] Updated user profile for:', id);
    }
    
    if (eventType === 'user.deleted') {
      console.log('👤 [Clerk Webhook] Deleting user from Supabase:', id);
      
      // Delete user profile and cascade to reports
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', id);
        
      if (deleteError) {
        console.error('❌ [Clerk Webhook] Error deleting user profile:', deleteError);
        return NextResponse.json({ error: 'Failed to delete user profile' }, { status: 500 });
      }
      
      console.log('✅ [Clerk Webhook] Deleted user profile for:', id);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('💥 [Clerk Webhook] Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 