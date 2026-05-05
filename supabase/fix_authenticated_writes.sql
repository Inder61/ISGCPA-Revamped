-- Run in Supabase SQL Editor if saves from /admin fail with "permission denied"
-- (RLS can allow a row, but role "authenticated" still needs INSERT/UPDATE/DELETE on the table.)

grant insert, update, delete on table public.hero_section to authenticated;
grant insert, update, delete on table public.hero_stats to authenticated;
grant insert, update, delete on table public.services_section to authenticated;
grant insert, update, delete on table public.services to authenticated;
grant insert, update, delete on table public.about_section to authenticated;
grant insert, update, delete on table public.about_features to authenticated;
grant insert, update, delete on table public.about_accordion to authenticated;
grant insert, update, delete on table public.process_section to authenticated;
grant insert, update, delete on table public.process_steps to authenticated;
grant select on table public.site_contact to anon, authenticated;
grant insert on table public.contact_submissions to anon, authenticated;
grant select, delete on table public.contact_submissions to authenticated;
grant insert, update, delete on table public.site_contact to authenticated;
