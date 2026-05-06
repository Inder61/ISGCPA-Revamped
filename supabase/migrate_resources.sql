-- ============================================================================
-- ONE-TIME migration: downloadable resources + Storage bucket "Resources"
-- Run in SQL Editor AFTER admin_auth.sql (needs public.is_site_editor()).
-- Idempotent: safe to re-run (drops/recreates policies).
-- ============================================================================

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

alter table public.resources_section enable row level security;
alter table public.resource_categories enable row level security;
alter table public.site_resources enable row level security;

grant select on table public.resources_section to anon, authenticated;
grant select on table public.resource_categories to anon, authenticated;
grant select on table public.site_resources to anon, authenticated;
grant insert, update, delete on table public.resources_section to authenticated;
grant insert, update, delete on table public.resource_categories to authenticated;
grant insert, update, delete on table public.site_resources to authenticated;

insert into public.resources_section (id, section_label, section_title) values (
  1,
  'Resources',
  'Guides, templates, and reference materials.'
)
on conflict (id) do update set
  section_label = excluded.section_label,
  section_title = excluded.section_title;

insert into storage.buckets (id, name, public)
values ('Resources', 'Resources', true)
on conflict (id) do nothing;

drop policy if exists "Resources storage public read" on storage.objects;
create policy "Resources storage public read"
  on storage.objects
  for select
  to public
  using (bucket_id = 'Resources');

drop policy if exists "Resources storage editors insert" on storage.objects;
create policy "Resources storage editors insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'Resources' and public.is_site_editor());

drop policy if exists "Resources storage editors update" on storage.objects;
create policy "Resources storage editors update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'Resources' and public.is_site_editor())
  with check (bucket_id = 'Resources' and public.is_site_editor());

drop policy if exists "Resources storage editors delete" on storage.objects;
create policy "Resources storage editors delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'Resources' and public.is_site_editor());

drop policy if exists "Allow public read resources_section" on public.resources_section;
create policy "Allow public read resources_section"
  on public.resources_section
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow public read resource_categories" on public.resource_categories;
create policy "Allow public read resource_categories"
  on public.resource_categories
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Read published site_resources" on public.site_resources;
create policy "Read published site_resources"
  on public.site_resources
  for select
  to anon, authenticated
  using (is_published or public.is_site_editor());

drop policy if exists "Editors insert resources_section" on public.resources_section;
drop policy if exists "Editors update resources_section" on public.resources_section;

create policy "Editors insert resources_section"
  on public.resources_section
  for insert
  to authenticated
  with check (public.is_site_editor());

create policy "Editors update resources_section"
  on public.resources_section
  for update
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

drop policy if exists "Editors insert resource_categories" on public.resource_categories;
drop policy if exists "Editors update resource_categories" on public.resource_categories;
drop policy if exists "Editors delete resource_categories" on public.resource_categories;

create policy "Editors insert resource_categories"
  on public.resource_categories
  for insert
  to authenticated
  with check (public.is_site_editor());

create policy "Editors update resource_categories"
  on public.resource_categories
  for update
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

create policy "Editors delete resource_categories"
  on public.resource_categories
  for delete
  to authenticated
  using (public.is_site_editor());

drop policy if exists "Editors insert site_resources" on public.site_resources;
drop policy if exists "Editors update site_resources" on public.site_resources;
drop policy if exists "Editors delete site_resources" on public.site_resources;

create policy "Editors insert site_resources"
  on public.site_resources
  for insert
  to authenticated
  with check (public.is_site_editor());

create policy "Editors update site_resources"
  on public.site_resources
  for update
  to authenticated
  using (public.is_site_editor())
  with check (public.is_site_editor());

create policy "Editors delete site_resources"
  on public.site_resources
  for delete
  to authenticated
  using (public.is_site_editor());
