-- ISG site content — run once in Supabase SQL Editor (Dashboard → SQL → New query)
-- Then run seed.sql or paste the INSERT block from seed.sql.

-- Hero copy (single row, id must be 1)
create table if not exists public.hero_section (
  id smallint primary key default 1,
  eyebrow text not null,
  headline_italic text not null,
  headline_plain text not null,
  lead text not null,
  cta_primary_text text not null,
  cta_primary_href text not null default '#contact',
  cta_secondary_text text not null,
  cta_secondary_href text not null default '#services',
  updated_at timestamptz default now(),
  constraint hero_section_singleton check (id = 1)
);

-- Hero stat tiles (any number of rows; order with sort_order)
create table if not exists public.hero_stats (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  value text not null,
  label text not null
);

-- Services section heading (single row)
create table if not exists public.services_section (
  id smallint primary key default 1,
  section_label text not null,
  section_title text not null,
  constraint services_section_singleton check (id = 1)
);

-- Service cards (add / edit / delete rows in Table Editor)
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null,
  description text not null
);

-- About: story + checklist + accordion (right column)
create table if not exists public.about_section (
  id smallint primary key default 1,
  section_label text not null,
  story_title text not null,
  story_text text not null,
  accordion_heading text not null,
  updated_at timestamptz default now(),
  constraint about_section_singleton check (id = 1)
);

create table if not exists public.about_features (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  bullet text not null
);

create table if not exists public.about_accordion (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  title text not null,
  body text not null
);

-- Process: section heading + steps
create table if not exists public.process_section (
  id smallint primary key default 1,
  section_label text not null,
  section_title text not null,
  constraint process_section_singleton check (id = 1)
);

create table if not exists public.process_steps (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  step_number text not null,
  title text not null,
  body text not null
);

-- Public contact details (footer, contact page); single row
create table if not exists public.site_contact (
  id smallint primary key default 1,
  office_line text not null,
  address_short text not null,
  phone_display text not null,
  phone_href text not null,
  email text not null,
  footer_tagline text not null,
  legal_footer_line text not null,
  copyright_entity text not null,
  brand_primary text not null,
  brand_accent text not null,
  updated_at timestamptz default now(),
  constraint site_contact_singleton check (id = 1)
);

-- Contact form submissions (website visitors)
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  service_interest text,
  message text not null
);

-- Public resources (metadata; files live in Storage bucket "Resources")
create table if not exists public.resources_section (
  id smallint primary key default 1,
  section_label text not null default 'Resources',
  section_title text not null default 'Guides, templates, and reference materials.',
  constraint resources_section_singleton check (id = 1)
);

create table if not exists public.resource_categories (
  id uuid primary key default gen_random_uuid(),
  sort_order int not null default 0,
  name text not null
);

create table if not exists public.site_resources (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.resource_categories (id) on delete restrict,
  sort_order int not null default 0,
  title text not null,
  description text not null default '',
  storage_path text not null,
  file_name text not null,
  file_size bigint,
  mime_type text,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists site_resources_category_sort_idx
  on public.site_resources (category_id, sort_order);

-- Row Level Security: site only needs public read; you edit in Dashboard (bypasses RLS)
alter table public.hero_section enable row level security;
alter table public.hero_stats enable row level security;
alter table public.services_section enable row level security;
alter table public.services enable row level security;
alter table public.about_section enable row level security;
alter table public.about_features enable row level security;
alter table public.about_accordion enable row level security;
alter table public.process_section enable row level security;
alter table public.process_steps enable row level security;
alter table public.site_contact enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.resources_section enable row level security;
alter table public.resource_categories enable row level security;
alter table public.site_resources enable row level security;

-- RLS policies for resources_* and site_resources are in admin_auth.sql (needs is_site_editor).

create policy "Allow public read hero_section"
  on public.hero_section for select
  using (true);

create policy "Allow public read hero_stats"
  on public.hero_stats for select
  using (true);

create policy "Allow public read services_section"
  on public.services_section for select
  using (true);

create policy "Allow public read services"
  on public.services for select
  using (true);

create policy "Allow public read about_section"
  on public.about_section for select
  using (true);

create policy "Allow public read about_features"
  on public.about_features for select
  using (true);

create policy "Allow public read about_accordion"
  on public.about_accordion for select
  using (true);

create policy "Allow public read process_section"
  on public.process_section for select
  using (true);

create policy "Allow public read process_steps"
  on public.process_steps for select
  using (true);

create policy "Allow public read site_contact"
  on public.site_contact for select
  using (true);

-- Anyone may submit the contact form (no public read of submissions)
create policy "Allow public insert contact submissions"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

-- Allow PostgREST (anon key) to read these tables
grant usage on schema public to anon, authenticated;
grant select on table public.hero_section to anon, authenticated;
grant select on table public.hero_stats to anon, authenticated;
grant select on table public.services_section to anon, authenticated;
grant select on table public.services to anon, authenticated;
grant select on table public.about_section to anon, authenticated;
grant select on table public.about_features to anon, authenticated;
grant select on table public.about_accordion to anon, authenticated;
grant select on table public.process_section to anon, authenticated;
grant select on table public.process_steps to anon, authenticated;
grant select on table public.site_contact to anon, authenticated;

grant insert on table public.contact_submissions to anon, authenticated;
grant select, delete on table public.contact_submissions to authenticated;

-- Logged-in editors use role "authenticated"; RLS still applies — these privileges are required for PostgREST writes
grant insert, update, delete on table public.hero_section to authenticated;
grant insert, update, delete on table public.hero_stats to authenticated;
grant insert, update, delete on table public.services_section to authenticated;
grant insert, update, delete on table public.services to authenticated;
grant insert, update, delete on table public.about_section to authenticated;
grant insert, update, delete on table public.about_features to authenticated;
grant insert, update, delete on table public.about_accordion to authenticated;
grant insert, update, delete on table public.process_section to authenticated;
grant insert, update, delete on table public.process_steps to authenticated;
grant insert, update, delete on table public.site_contact to authenticated;

grant select on table public.resources_section to anon, authenticated;
grant select on table public.resource_categories to anon, authenticated;
grant select on table public.site_resources to anon, authenticated;
grant insert, update, delete on table public.resources_section to authenticated;
grant insert, update, delete on table public.resource_categories to authenticated;
grant insert, update, delete on table public.site_resources to authenticated;
