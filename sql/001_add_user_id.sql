-- Add user_id column to existing profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_id text;

-- Add index for better performance on user_id queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- Add helpful comment
COMMENT ON COLUMN profiles.user_id IS 'Clerk user ID for linking profiles to authenticated users'; 