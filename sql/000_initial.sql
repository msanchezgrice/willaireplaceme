-- Drop existing tables if they exist
drop table if exists reports;
drop table if exists profiles;

-- Create profiles table without auth constraint
create table profiles (
  id uuid primary key default gen_random_uuid(),
  email text,
  role text not null,
  resume text,
  task_hours jsonb,
  profile_data jsonb, -- Additional form data from user
  linkedin_data jsonb, -- LinkedIn profile analysis results
  created_at timestamp default now()
);

-- Create reports table
create table reports (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  score numeric,
  preview text,
  full_report text,
  evidence jsonb,
  created_at timestamp default now()
);

-- Add indexes for better performance
create index idx_profiles_created_at on profiles(created_at);
create index idx_reports_profile_id on reports(profile_id);
create index idx_reports_created_at on reports(created_at); 