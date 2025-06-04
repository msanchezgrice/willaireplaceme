create table profiles (
  id uuid primary key default gen_random_uuid(),
  email text references auth.users(email),
  role text,
  resume text,
  task_hours jsonb,
  created_at timestamp default now()
);

create table reports (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id),
  score numeric,
  preview text,
  full_report text,
  evidence jsonb,
  created_at timestamp default now()
); 