-- ============================================================================
-- Site editor authentication (run once after schema.sql + populate_once.sql)
-- 1. Creates allowlist of emails that may edit content when signed in.
-- 2. Adds RLS policies so those users (JWT role: authenticated) can mutate rows.
-- ============================================================================

create table if not exists public.allowed_editors (
  email text primary key
);

comment on table public.allowed_editors is
  'Lowercase emails allowed to use /admin. Manage rows via SQL Editor or service role only.';

alter table public.allowed_editors enable row level security;

grant select on table public.allowed_editors to authenticated;

drop policy if exists "Editors read own allowlist row" on public.allowed_editors;
create policy "Editors read own allowlist row"
  on public.allowed_editors
  for select
  to authenticated
  using (
    lower(trim(email)) = lower(trim(coalesce(auth.jwt()->>'email', '')))
  );

-- Function runs with definer rights so it can read allowlist without exposing it via RLS
create or replace function public.is_site_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.allowed_editors e
    where lower(e.email) = lower(trim(coalesce(auth.jwt()->>'email', '')))
  );
$$;

revoke all on function public.is_site_editor() from public;
grant execute on function public.is_site_editor() to authenticated;

-- hero_section: insert/update only (singleton row)
drop policy if exists "Editors insert hero_section" on public.hero_section;
drop policy if exists "Editors update hero_section" on public.hero_section;

create policy "Editors insert hero_section"
  on public.hero_section
  for insert
  to authenticated
  with check (public.is_site_editor());

create policy "Editors update hero_section"
  on public.hero_section
  for update
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

-- hero_stats: full CRUD for editors
drop policy if exists "Editors manage hero_stats" on public.hero_stats;

create policy "Editors manage hero_stats"
  on public.hero_stats
  for all
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

-- services_section
drop policy if exists "Editors insert services_section" on public.services_section;
drop policy if exists "Editors update services_section" on public.services_section;

create policy "Editors insert services_section"
  on public.services_section
  for insert
  to authenticated
  with check (public.is_site_editor());

create policy "Editors update services_section"
  on public.services_section
  for update
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

-- services list
drop policy if exists "Editors manage services" on public.services;

create policy "Editors manage services"
  on public.services
  for all
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

-- about_section (singleton)
drop policy if exists "Editors insert about_section" on public.about_section;
drop policy if exists "Editors update about_section" on public.about_section;

create policy "Editors insert about_section"
  on public.about_section
  for insert
  to authenticated
  with check (public.is_site_editor());

create policy "Editors update about_section"
  on public.about_section
  for update
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

drop policy if exists "Editors manage about_features" on public.about_features;

create policy "Editors manage about_features"
  on public.about_features
  for all
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

drop policy if exists "Editors manage about_accordion" on public.about_accordion;

create policy "Editors manage about_accordion"
  on public.about_accordion
  for all
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

-- process_section (singleton)
drop policy if exists "Editors insert process_section" on public.process_section;
drop policy if exists "Editors update process_section" on public.process_section;

create policy "Editors insert process_section"
  on public.process_section
  for insert
  to authenticated
  with check (public.is_site_editor());

create policy "Editors update process_section"
  on public.process_section
  for update
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

drop policy if exists "Editors manage process_steps" on public.process_steps;

create policy "Editors manage process_steps"
  on public.process_steps
  for all
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

-- site_contact singleton
drop policy if exists "Editors insert site_contact" on public.site_contact;
drop policy if exists "Editors update site_contact" on public.site_contact;

create policy "Editors insert site_contact"
  on public.site_contact
  for insert
  to authenticated
  with check (public.is_site_editor());

create policy "Editors update site_contact"
  on public.site_contact
  for update
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

-- contact form inbox (read / delete for editors only)
drop policy if exists "Editors read contact submissions" on public.contact_submissions;
drop policy if exists "Editors delete contact submissions" on public.contact_submissions;

create policy "Editors read contact submissions"
  on public.contact_submissions
  for select
  to authenticated
  using (public.is_site_editor());

create policy "Editors delete contact submissions"
  on public.contact_submissions
  for delete
  to authenticated
  using (public.is_site_editor());

-- ---------------------------------------------------------------------------
-- Add at least one editor (use the same email as your Supabase Auth user):
--   insert into public.allowed_editors (email) values ('you@company.com');
-- Disable public sign-ups in Authentication → Providers → Email so only you
-- create accounts (Authentication → Users → Add user).
-- ---------------------------------------------------------------------------
