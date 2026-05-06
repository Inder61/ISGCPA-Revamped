-- ============================================================================
-- ONE-TIME: Fill ISG content + fix API read access for the anon key
-- Run in Supabase Dashboard → SQL → New query → Run (entire file)
-- Requires tables from schema.sql to exist first.
-- ============================================================================

begin;

-- PostgREST needs SELECT granted to anon/authenticated (easy to miss on SQL-created tables)
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

grant select on table public.resources_section to anon, authenticated;
grant select on table public.resource_categories to anon, authenticated;
grant select on table public.site_resources to anon, authenticated;
grant insert, update, delete on table public.resources_section to authenticated;
grant insert, update, delete on table public.resource_categories to authenticated;
grant insert, update, delete on table public.site_resources to authenticated;

-- Singleton hero copy (insert or replace row id = 1)
insert into public.hero_section (
  id,
  eyebrow,
  headline_italic,
  headline_plain,
  lead,
  cta_primary_text,
  cta_primary_href,
  cta_secondary_text,
  cta_secondary_href
) values (
  1,
  'Toronto · Chartered Professional Accountants',
  'Clarity',
  'for complex Canadian tax & finance.',
  'ISG Consulting partners with owners and leadership teams who expect discretion, precision, and counsel that stands up to scrutiny — from CRA correspondence to strategic planning.',
  'Schedule a consultation',
  '#contact',
  'Explore services',
  '#services'
)
on conflict (id) do update set
  eyebrow = excluded.eyebrow,
  headline_italic = excluded.headline_italic,
  headline_plain = excluded.headline_plain,
  lead = excluded.lead,
  cta_primary_text = excluded.cta_primary_text,
  cta_primary_href = excluded.cta_primary_href,
  cta_secondary_text = excluded.cta_secondary_text,
  cta_secondary_href = excluded.cta_secondary_href,
  updated_at = now();

-- Services section heading
insert into public.services_section (id, section_label, section_title) values (
  1,
  'Services',
  'Comprehensive assurance for Canadian enterprises.'
)
on conflict (id) do update set
  section_label = excluded.section_label,
  section_title = excluded.section_title;

-- Replace stat tiles (clean slate)
delete from public.hero_stats;

insert into public.hero_stats (sort_order, value, label) values
  (0, '180+', 'Clients served'),
  (1, '15+', 'Years combined experience'),
  (2, 'CPA', 'Ontario-regulated advisors'),
  (3, '24h', 'Typical response time');

-- Replace service cards
delete from public.services;

insert into public.services (sort_order, title, description) values
  (0, 'Tax Services', 'Corporate, trust, and personal filing with proactive planning aligned to federal and Ontario regulations.'),
  (1, 'Bookkeeping', 'Month-end close, reconciliations, and management reporting tailored to your governance needs.'),
  (2, 'Payroll', 'Remittances, year-end slips, and scalable payroll architecture as your team grows.'),
  (3, 'CRA Audit Support', 'Measured representation, documentation strategy, and correspondence handled with rigour.'),
  (4, 'Small Business Financing', 'Forecast models, lender-ready statements, and scenario planning for capital decisions.'),
  (5, 'Real Estate Taxation', 'Disposition planning, rental structures, and integration with broader wealth objectives.');

-- About + Process (singletons + lists)
insert into public.about_section (
  id, section_label, story_title, story_text, accordion_heading
) values (
  1,
  'About ISG',
  'A Toronto firm built for judgment, not volume.',
  'ISG Consulting was founded on a straightforward premise: Canadian businesses deserve CPA-grade rigour with the attentiveness of a dedicated advisory partner. We serve owner-managed companies, professional practices, and family-held enterprises that value stability, discretion, and precise execution.',
  'Why clients choose us'
)
on conflict (id) do update set
  section_label = excluded.section_label,
  story_title = excluded.story_title,
  story_text = excluded.story_text,
  accordion_heading = excluded.accordion_heading,
  updated_at = now();

delete from public.about_features;
insert into public.about_features (sort_order, bullet) values
  (0, 'Senior CPA oversight on every engagement'),
  (1, 'Documentation discipline built for audit readiness'),
  (2, 'Plain-language briefings for directors and stakeholders'),
  (3, 'Cross-border awareness where US exposure exists');

delete from public.about_accordion;
insert into public.about_accordion (sort_order, title, body) values
  (0, 'Institutional discipline', 'We apply the same structured methodology used by national firms — without the layers, noise, or hourly surprises.'),
  (1, 'Principal-led service', 'You work with professionals who own the file end-to-end. Expect continuity, accountability, and direct access.'),
  (2, 'Toronto context', 'From Queen’s Park policy shifts to municipal compliance, our counsel reflects operating realities in Canada’s largest market.'),
  (3, 'Long-range partnership', 'We optimize for relationships measured in years: proactive calendars, timely reminders, and strategic checkpoints.');

insert into public.process_section (id, section_label, section_title) values (
  1,
  'Process',
  'From first conversation to enduring counsel.'
)
on conflict (id) do update set
  section_label = excluded.section_label,
  section_title = excluded.section_title;

delete from public.process_steps;
insert into public.process_steps (sort_order, step_number, title, body) values
  (0, '01', 'Consultation', 'We align on objectives, risk appetite, and timelines — establishing scope with clarity.'),
  (1, '02', 'Assessment', 'Diagnostic review of records, filings, and exposures informs a prioritized roadmap.'),
  (2, '03', 'Execution', 'Deliverables are prepared to CPA standards, documented for continuity and review.'),
  (3, '04', 'Partnership', 'Ongoing rhythm of monitoring, planning windows, and responsive counsel as needs evolve.');

insert into public.site_contact (
  id,
  office_line,
  address_short,
  phone_display,
  phone_href,
  email,
  footer_tagline,
  legal_footer_line,
  copyright_entity,
  brand_primary,
  brand_accent
) values (
  1,
  'Toronto, Ontario — serving clients across Canada',
  'Toronto, ON',
  '(416) 555-0199',
  'tel:+14165550199',
  'hello@isgconsulting.ca',
  'Chartered Professional Accountants delivering disciplined advisory for Canadian enterprises.',
  'CPA Ontario · Professional standards apply.',
  'ISG Consulting',
  'ISG',
  ' Consulting'
)
on conflict (id) do update set
  office_line = excluded.office_line,
  address_short = excluded.address_short,
  phone_display = excluded.phone_display,
  phone_href = excluded.phone_href,
  email = excluded.email,
  footer_tagline = excluded.footer_tagline,
  legal_footer_line = excluded.legal_footer_line,
  copyright_entity = excluded.copyright_entity,
  brand_primary = excluded.brand_primary,
  brand_accent = excluded.brand_accent,
  updated_at = now();

-- Resources section heading (bucket + RLS live in admin_auth.sql)
insert into public.resources_section (id, section_label, section_title) values (
  1,
  'Resources',
  'Guides, templates, and reference materials.'
)
on conflict (id) do update set
  section_label = excluded.section_label,
  section_title = excluded.section_title;

commit;

-- Optional checks (run separately if you want to verify):
-- select * from public.hero_section;
-- select * from public.hero_stats order by sort_order;
-- select * from public.services_section;
-- select * from public.services order by sort_order;
-- select * from public.about_section;
-- select * from public.about_features order by sort_order;
-- select * from public.about_accordion order by sort_order;
-- select * from public.process_section;
-- select * from public.process_steps order by sort_order;
-- select * from public.site_contact;
-- select * from public.contact_submissions order by created_at desc;
-- select * from public.resources_section;
-- select * from public.resource_categories order by sort_order;
-- select * from public.site_resources order by sort_order;
