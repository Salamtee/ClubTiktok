-- Run this once in your Supabase project's SQL Editor (Database > SQL Editor).
-- Creates one table per collection. Each row stores its data in a flexible
-- jsonb "payload" column, so it matches whatever fields the frontend sends.

create table if not exists public.users (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.items (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activity (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public."stockLog" (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public."stockAdjustments" (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id text primary key,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The backend currently connects with the anon key, so Row Level Security
-- must either be off, or have permissive policies. Simplest for an internal
-- staff tool (all real access control is done in the app, not the DB):
alter table public.users disable row level security;
alter table public.items disable row level security;
alter table public.reports disable row level security;
alter table public.activity disable row level security;
alter table public."stockLog" disable row level security;
alter table public."stockAdjustments" disable row level security;
alter table public.bookings disable row level security;
