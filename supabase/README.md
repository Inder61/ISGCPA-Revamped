# Supabase content for ISG site

Editable copy for the hero, stat tiles, services section heading, and service cards. The app reads these tables with the **anon** key; you edit rows in the Supabase **Table Editor** (or SQL). Only `SELECT` is allowed for anonymous users, so the public site cannot modify data.

## One-time setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run `schema.sql` (creates tables + RLS policies + API grants).
3. Run **`populate_once.sql`** (fills all rows **and** ensures `anon` can `SELECT` — fixes “empty site” when tables were created only via SQL).  
   Alternatively you can run `seed.sql` after schema; if the browser still shows built-in defaults, run **`populate_once.sql`** once.

**If you already ran `schema.sql` earlier:** run **`populate_once.sql`** only — it upserts hero/services headings, replaces stats & services lists, and applies `GRANT SELECT` for the anon API key.
4. In **Project Settings → API**, copy **Project URL** and **anon public** key.
5. In the repo root, copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Restart `npm run dev`.

If `.env` is missing or wrong, the site still runs using built-in defaults.

## Website editor (`/admin`)

1. In **SQL Editor**, run **`admin_auth.sql`** (allowlist table + `is_site_editor()` + write policies for authenticated users).
2. Create a **user** under **Authentication → Users → Add user** (email + password). Turn off **public sign-ups** under **Authentication → Providers → Email** so random visitors cannot register.
3. Allowlist that exact email:

   ```sql
   insert into public.allowed_editors (email) values ('your-name@your-domain.com');
   ```

   Use the same spelling Supabase shows on the user (case-insensitive match is applied).

4. Visit **`http://localhost:5173/admin/login`** (or your deployed URL + `/admin/login`), sign in, then edit content at **`/admin`**.

Non-allowlisted accounts can sign in but only see “Access denied”; they cannot change tables.

## Tables

| Table | Purpose |
|--------|---------|
| `hero_section` | Single row (`id = 1`): eyebrow, headline (italic + plain), lead paragraph, both CTA labels and `href`s. |
| `hero_stats` | One row per stat tile; use `sort_order` (0, 1, 2…) for left-to-right / top-to-bottom order. |
| `services_section` | Single row (`id = 1`): small label + main heading above the service cards. |
| `services` | One row per service; `sort_order` controls display order. Add/delete rows here to change the grid, footer list, and contact dropdown. |
| `about_section` | Single row (`id = 1`): left-column label, story title & paragraph, accordion column heading. |
| `about_features` | Checklist bullets under the story (`bullet`, `sort_order`). |
| `about_accordion` | Right-column accordion (`title`, `body`, `sort_order`). |
| `process_section` | Single row (`id = 1`): Process section label + title. |
| `process_steps` | Steps (`step_number` e.g. `01`, `title`, `body`, `sort_order`). |
| `site_contact` | Single row (`id = 1`): office line, short address, phone display + `phone_href`, email, footer brand (`brand_primary` + `brand_accent`), tagline, copyright name, legal line. |
| `contact_submissions` | Rows created when visitors submit the contact form (`name`, `email`, `phone`, `service_interest`, `message`). Public **insert** only; editors read/delete in **`/admin`**. |
| `resources_section` | Homepage resources block heading (`section_label`, `section_title`). |
| `resource_categories` | Resource group names; shown as subheadings on the site. |
| `site_resources` | Download metadata; links resolve to public URLs in the **`Resources`** Storage bucket. |
| `allowed_editors` | Email addresses permitted to use **`/admin`** when signed in (maintain via SQL Editor). |

**Already have a database from before About/Process?** Create the new tables (see **`schema.sql`** from `about_section` onward), run the **About + Process** section of **`populate_once.sql`**, then run **`admin_auth.sql`** again for editor policies.

**Saves from `/admin` fail (especially About / Process)?** Run **`fix_authenticated_writes.sql`** once so role `authenticated` can perform `INSERT`/`UPDATE`/`DELETE` (RLS still restricts who can edit). New installs already include these grants in **`schema.sql`** / **`populate_once.sql`**.

## Public resources (downloads)

Visitors see a **Resources** section on the homepage (`#resources`). Files are stored in the Storage bucket **`Resources`**; metadata and categories live in Postgres.

| Table | Purpose |
|--------|---------|
| `resources_section` | Single row (`id = 1`): small label + main heading above the resource lists. |
| `resource_categories` | Category names and `sort_order` (group files on the public page). |
| `site_resources` | One row per file: `category_id`, `title`, `description`, `storage_path`, `file_name`, sizes, `is_published`, `sort_order`. |

**New project:** tables and grants are in **`schema.sql`**; bucket + RLS policies are in **`admin_auth.sql`** (after `is_site_editor()`). **`populate_once.sql`** seeds `resources_section`.

**Existing database** (already deployed before this feature): run **`migrate_resources.sql`** once in the SQL Editor (after **`admin_auth.sql`** has been applied at least once). Then open **`/admin`** → **Public resources** to add categories and uploads.

## Contact form email ([Web3Forms](https://web3forms.com))

Submissions are saved to **`contact_submissions`** (visible in **`/admin`**). Optional **email alerts** use Web3Forms from the browser (no server deploy).

1. Sign up at [web3forms.com](https://web3forms.com) and create a form to get an **Access Key**.
2. Restrict the key to your **production domain** (and `localhost` for dev) in their dashboard if offered.
3. In `.env`, set:

   ```bash
   VITE_WEB3FORMS_ACCESS_KEY=your_access_key_here
   ```

4. Restart `npm run dev` / rebuild for production.

If the key is missing, the form still saves to Supabase only. If Web3Forms fails after a successful save, the UI shows a short warning so visitors know they can call or email you directly.

---

## Re-running seed

`seed.sql` deletes all rows in `hero_stats` and `services`, then inserts the default set again. It does **not** remove custom edits to `hero_section` or `services_section` (those use `ON CONFLICT` upsert). Comment out the `delete` statements if you only want to refresh lists manually.
