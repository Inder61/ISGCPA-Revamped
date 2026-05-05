import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSupabase } from "../lib/supabase";
import "../admin/admin.css";

type HeroForm = {
  eyebrow: string;
  headline_italic: string;
  headline_plain: string;
  lead: string;
  cta_primary_text: string;
  cta_primary_href: string;
  cta_secondary_text: string;
  cta_secondary_href: string;
};

type StatRow = {
  id: string;
  sort_order: number;
  value: string;
  label: string;
};

type ServicesHeading = {
  section_label: string;
  section_title: string;
};

type ServiceRow = {
  id: string;
  sort_order: number;
  title: string;
  description: string;
};

type AboutStoryForm = {
  section_label: string;
  story_title: string;
  story_text: string;
  accordion_heading: string;
};

type FeatureRow = {
  id: string;
  sort_order: number;
  bullet: string;
};

type AccordionRow = {
  id: string;
  sort_order: number;
  title: string;
  body: string;
};

type ProcessHeadingForm = {
  section_label: string;
  section_title: string;
};

type ProcessStepRow = {
  id: string;
  sort_order: number;
  step_number: string;
  title: string;
  body: string;
};

type SiteContactForm = {
  office_line: string;
  address_short: string;
  phone_display: string;
  phone_href: string;
  email: string;
  footer_tagline: string;
  legal_footer_line: string;
  copyright_entity: string;
  brand_primary: string;
  brand_accent: string;
};

type InboxRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  service_interest: string | null;
  message: string;
};

const initialSiteContact: SiteContactForm = {
  office_line: "Toronto, Ontario — serving clients across Canada",
  address_short: "Toronto, ON",
  phone_display: "(416) 555-0199",
  phone_href: "tel:+14165550199",
  email: "hello@isgconsulting.ca",
  footer_tagline:
    "Chartered Professional Accountants delivering disciplined advisory for Canadian enterprises.",
  legal_footer_line: "CPA Ontario · Professional standards apply.",
  copyright_entity: "ISG Consulting",
  brand_primary: "ISG",
  brand_accent: " Consulting",
};

const emptyHero: HeroForm = {
  eyebrow: "",
  headline_italic: "",
  headline_plain: "",
  lead: "",
  cta_primary_text: "",
  cta_primary_href: "#contact",
  cta_secondary_text: "",
  cta_secondary_href: "#services",
};

function pendingId() {
  return `pending-${crypto.randomUUID()}`;
}

function formatSupabaseErr(err: {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}) {
  return [err.message, err.details, err.hint, err.code ? `code: ${err.code}` : ""]
    .filter((s) => s && String(s).trim().length > 0)
    .join(" · ");
}

export function AdminEditor() {
  const sb = getSupabase();

  const [banner, setBanner] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [hero, setHero] = useState<HeroForm>(emptyHero);
  const [stats, setStats] = useState<StatRow[]>([]);
  const [servicesHeading, setServicesHeading] = useState<ServicesHeading>({
    section_label: "Services",
    section_title: "",
  });
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [aboutStory, setAboutStory] = useState<AboutStoryForm>({
    section_label: "About ISG",
    story_title: "",
    story_text: "",
    accordion_heading: "Why clients choose us",
  });
  const [aboutFeatures, setAboutFeatures] = useState<FeatureRow[]>([]);
  const [aboutAccordion, setAboutAccordion] = useState<AccordionRow[]>([]);
  const [processHeading, setProcessHeading] = useState<ProcessHeadingForm>({
    section_label: "Process",
    section_title: "",
  });
  const [processSteps, setProcessSteps] = useState<ProcessStepRow[]>([]);
  const [siteContact, setSiteContact] = useState<SiteContactForm>(initialSiteContact);
  const [submissions, setSubmissions] = useState<InboxRow[]>([]);

  const showOk = (text: string) => setBanner({ type: "ok", text });
  const showErr = (text: string) => setBanner({ type: "err", text });

  const loadAll = useCallback(async () => {
    if (!sb) {
      showErr("Supabase client missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setBanner(null);

    const [
      heroRes,
      statsRes,
      secRes,
      svcRes,
      aboutSecRes,
      aboutFeatRes,
      aboutAccRes,
      procSecRes,
      procStepsRes,
      siteContactRes,
      inboxRes,
    ] = await Promise.all([
      sb.from("hero_section").select("*").eq("id", 1).maybeSingle(),
      sb.from("hero_stats").select("*").order("sort_order", { ascending: true }),
      sb.from("services_section").select("*").eq("id", 1).maybeSingle(),
      sb.from("services").select("*").order("sort_order", { ascending: true }),
      sb.from("about_section").select("*").eq("id", 1).maybeSingle(),
      sb.from("about_features").select("*").order("sort_order", { ascending: true }),
      sb.from("about_accordion").select("*").order("sort_order", { ascending: true }),
      sb.from("process_section").select("*").eq("id", 1).maybeSingle(),
      sb.from("process_steps").select("*").order("sort_order", { ascending: true }),
      sb.from("site_contact").select("*").eq("id", 1).maybeSingle(),
      sb.from("contact_submissions").select("*").order("created_at", { ascending: false }).limit(40),
    ]);

    if (heroRes.error) showErr(formatSupabaseErr(heroRes.error));
    else if (heroRes.data) {
      const h = heroRes.data as Record<string, string>;
      setHero({
        eyebrow: h.eyebrow ?? "",
        headline_italic: h.headline_italic ?? "",
        headline_plain: h.headline_plain ?? "",
        lead: h.lead ?? "",
        cta_primary_text: h.cta_primary_text ?? "",
        cta_primary_href: h.cta_primary_href ?? "#contact",
        cta_secondary_text: h.cta_secondary_text ?? "",
        cta_secondary_href: h.cta_secondary_href ?? "#services",
      });
    }

    if (statsRes.error) showErr(formatSupabaseErr(statsRes.error));
    else {
      setStats(
        ((statsRes.data ?? []) as { id: string; sort_order: number; value: string; label: string }[]).map(
          (r) => ({
            id: r.id,
            sort_order: r.sort_order,
            value: r.value,
            label: r.label,
          })
        )
      );
    }

    if (secRes.error) showErr(formatSupabaseErr(secRes.error));
    else if (secRes.data) {
      const s = secRes.data as { section_label: string; section_title: string };
      setServicesHeading({
        section_label: s.section_label ?? "Services",
        section_title: s.section_title ?? "",
      });
    }

    if (svcRes.error) showErr(formatSupabaseErr(svcRes.error));
    else {
      setServices(
        (
          (svcRes.data ?? []) as {
            id: string;
            sort_order: number;
            title: string;
            description: string;
          }[]
        ).map((r) => ({
          id: r.id,
          sort_order: r.sort_order,
          title: r.title,
          description: r.description,
        }))
      );
    }

    if (aboutSecRes.error) showErr(formatSupabaseErr(aboutSecRes.error));
    else if (aboutSecRes.data) {
      const a = aboutSecRes.data as Record<string, string>;
      setAboutStory({
        section_label: a.section_label ?? "About ISG",
        story_title: a.story_title ?? "",
        story_text: a.story_text ?? "",
        accordion_heading: a.accordion_heading ?? "Why clients choose us",
      });
    }

    if (aboutFeatRes.error) showErr(formatSupabaseErr(aboutFeatRes.error));
    else {
      setAboutFeatures(
        ((aboutFeatRes.data ?? []) as { id: string; sort_order: number; bullet: string }[]).map((r) => ({
          id: r.id,
          sort_order: r.sort_order,
          bullet: r.bullet,
        }))
      );
    }

    if (aboutAccRes.error) showErr(formatSupabaseErr(aboutAccRes.error));
    else {
      setAboutAccordion(
        ((aboutAccRes.data ?? []) as { id: string; sort_order: number; title: string; body: string }[]).map(
          (r) => ({
            id: r.id,
            sort_order: r.sort_order,
            title: r.title,
            body: r.body,
          })
        )
      );
    }

    if (procSecRes.error) showErr(formatSupabaseErr(procSecRes.error));
    else if (procSecRes.data) {
      const p = procSecRes.data as { section_label: string; section_title: string };
      setProcessHeading({
        section_label: p.section_label ?? "Process",
        section_title: p.section_title ?? "",
      });
    }

    if (procStepsRes.error) showErr(formatSupabaseErr(procStepsRes.error));
    else {
      setProcessSteps(
        (
          (procStepsRes.data ?? []) as {
            id: string;
            sort_order: number;
            step_number: string;
            title: string;
            body: string;
          }[]
        ).map((r) => ({
          id: r.id,
          sort_order: r.sort_order,
          step_number: r.step_number,
          title: r.title,
          body: r.body,
        }))
      );
    }

    if (siteContactRes.error) showErr(formatSupabaseErr(siteContactRes.error));
    else if (siteContactRes.data) {
      const c = siteContactRes.data as Record<string, string>;
      setSiteContact({
        office_line: c.office_line ?? "",
        address_short: c.address_short ?? "",
        phone_display: c.phone_display ?? "",
        phone_href: c.phone_href ?? "",
        email: c.email ?? "",
        footer_tagline: c.footer_tagline ?? "",
        legal_footer_line: c.legal_footer_line ?? "",
        copyright_entity: c.copyright_entity ?? "",
        brand_primary: c.brand_primary ?? "",
        brand_accent: c.brand_accent ?? "",
      });
    }

    if (inboxRes.error) showErr(formatSupabaseErr(inboxRes.error));
    else {
      setSubmissions((inboxRes.data ?? []) as InboxRow[]);
    }

    setLoading(false);
  }, [sb]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  async function saveHero(e: FormEvent) {
    e.preventDefault();
    if (!sb) return;
    const { error } = await sb.from("hero_section").upsert(
      {
        id: 1,
        ...hero,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) showErr(formatSupabaseErr(error));
    else showOk("Hero saved.");
  }

  async function saveServicesHeading(e: FormEvent) {
    e.preventDefault();
    if (!sb) return;
    const { error } = await sb.from("services_section").upsert(
      {
        id: 1,
        section_label: servicesHeading.section_label,
        section_title: servicesHeading.section_title,
      },
      { onConflict: "id" }
    );
    if (error) showErr(formatSupabaseErr(error));
    else showOk("Services heading saved.");
  }

  async function persistStats() {
    if (!sb) return;
    const { data: remote } = await sb.from("hero_stats").select("id");
    const remoteIds = new Set((remote ?? []).map((r: { id: string }) => r.id));
    const keepIds = new Set(stats.filter((s) => !s.id.startsWith("pending-")).map((s) => s.id));
    for (const id of remoteIds) {
      if (!keepIds.has(id)) {
        const { error } = await sb.from("hero_stats").delete().eq("id", id);
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      }
    }
    for (const row of stats) {
      if (!row.value.trim() || !row.label.trim()) continue;
      if (row.id.startsWith("pending-")) {
        const { error } = await sb.from("hero_stats").insert({
          sort_order: row.sort_order,
          value: row.value.trim(),
          label: row.label.trim(),
        });
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      } else {
        const { error } = await sb
          .from("hero_stats")
          .update({
            sort_order: row.sort_order,
            value: row.value.trim(),
            label: row.label.trim(),
          })
          .eq("id", row.id);
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      }
    }
    showOk("Stat tiles saved.");
    await loadAll();
  }

  async function persistServices() {
    if (!sb) return;
    const { data: remote } = await sb.from("services").select("id");
    const remoteIds = new Set((remote ?? []).map((r: { id: string }) => r.id));
    const keepIds = new Set(services.filter((s) => !s.id.startsWith("pending-")).map((s) => s.id));
    for (const id of remoteIds) {
      if (!keepIds.has(id)) {
        const { error } = await sb.from("services").delete().eq("id", id);
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      }
    }
    for (const row of services) {
      if (!row.title.trim() || !row.description.trim()) continue;
      if (row.id.startsWith("pending-")) {
        const { error } = await sb.from("services").insert({
          sort_order: row.sort_order,
          title: row.title.trim(),
          description: row.description.trim(),
        });
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      } else {
        const { error } = await sb
          .from("services")
          .update({
            sort_order: row.sort_order,
            title: row.title.trim(),
            description: row.description.trim(),
          })
          .eq("id", row.id);
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      }
    }
    showOk("Services saved.");
    await loadAll();
  }

  function addStat() {
    setStats((rows) => [
      ...rows,
      { id: pendingId(), sort_order: rows.length, value: "", label: "" },
    ]);
  }

  function removeStat(id: string) {
    setStats((rows) => rows.filter((r) => r.id !== id));
  }

  function addService() {
    setServices((rows) => [
      ...rows,
      { id: pendingId(), sort_order: rows.length, title: "", description: "" },
    ]);
  }

  function removeService(id: string) {
    setServices((rows) => rows.filter((r) => r.id !== id));
  }

  async function saveAboutStory(e: FormEvent) {
    e.preventDefault();
    if (!sb) return;
    const { error } = await sb.from("about_section").upsert(
      {
        id: 1,
        section_label: aboutStory.section_label,
        story_title: aboutStory.story_title,
        story_text: aboutStory.story_text,
        accordion_heading: aboutStory.accordion_heading,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) showErr(formatSupabaseErr(error));
    else showOk("About (story + headings) saved.");
  }

  async function persistAboutFeatures() {
    if (!sb) return;
    const { data: remote } = await sb.from("about_features").select("id");
    const remoteIds = new Set((remote ?? []).map((r: { id: string }) => r.id));
    const keepIds = new Set(
      aboutFeatures.filter((s) => !s.id.startsWith("pending-")).map((s) => s.id)
    );
    for (const id of remoteIds) {
      if (!keepIds.has(id)) {
        const { error } = await sb.from("about_features").delete().eq("id", id);
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      }
    }
    for (const row of aboutFeatures) {
      if (!row.bullet.trim()) continue;
      if (row.id.startsWith("pending-")) {
        const { error } = await sb.from("about_features").insert({
          sort_order: row.sort_order,
          bullet: row.bullet.trim(),
        });
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      } else {
        const { error } = await sb
          .from("about_features")
          .update({ sort_order: row.sort_order, bullet: row.bullet.trim() })
          .eq("id", row.id);
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      }
    }
    showOk("About checklist saved.");
    await loadAll();
  }

  async function persistAboutAccordion() {
    if (!sb) return;
    const { data: remote } = await sb.from("about_accordion").select("id");
    const remoteIds = new Set((remote ?? []).map((r: { id: string }) => r.id));
    const keepIds = new Set(
      aboutAccordion.filter((s) => !s.id.startsWith("pending-")).map((s) => s.id)
    );
    for (const id of remoteIds) {
      if (!keepIds.has(id)) {
        const { error } = await sb.from("about_accordion").delete().eq("id", id);
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      }
    }
    for (const row of aboutAccordion) {
      if (!row.title.trim() || !row.body.trim()) continue;
      if (row.id.startsWith("pending-")) {
        const { error } = await sb.from("about_accordion").insert({
          sort_order: row.sort_order,
          title: row.title.trim(),
          body: row.body.trim(),
        });
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      } else {
        const { error } = await sb
          .from("about_accordion")
          .update({
            sort_order: row.sort_order,
            title: row.title.trim(),
            body: row.body.trim(),
          })
          .eq("id", row.id);
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      }
    }
    showOk("About accordion saved.");
    await loadAll();
  }

  async function saveProcessHeading(e: FormEvent) {
    e.preventDefault();
    if (!sb) return;
    const { error } = await sb.from("process_section").upsert(
      {
        id: 1,
        section_label: processHeading.section_label,
        section_title: processHeading.section_title,
      },
      { onConflict: "id" }
    );
    if (error) showErr(formatSupabaseErr(error));
    else showOk("Process heading saved.");
  }

  async function persistProcessSteps() {
    if (!sb) return;
    const { data: remote } = await sb.from("process_steps").select("id");
    const remoteIds = new Set((remote ?? []).map((r: { id: string }) => r.id));
    const keepIds = new Set(
      processSteps.filter((s) => !s.id.startsWith("pending-")).map((s) => s.id)
    );
    for (const id of remoteIds) {
      if (!keepIds.has(id)) {
        const { error } = await sb.from("process_steps").delete().eq("id", id);
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      }
    }
    for (const row of processSteps) {
      if (!row.step_number.trim() || !row.title.trim() || !row.body.trim()) continue;
      if (row.id.startsWith("pending-")) {
        const { error } = await sb.from("process_steps").insert({
          sort_order: row.sort_order,
          step_number: row.step_number.trim(),
          title: row.title.trim(),
          body: row.body.trim(),
        });
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      } else {
        const { error } = await sb
          .from("process_steps")
          .update({
            sort_order: row.sort_order,
            step_number: row.step_number.trim(),
            title: row.title.trim(),
            body: row.body.trim(),
          })
          .eq("id", row.id);
        if (error) {
          showErr(formatSupabaseErr(error));
          return;
        }
      }
    }
    showOk("Process steps saved.");
    await loadAll();
  }

  async function saveSiteContact(e: FormEvent) {
    e.preventDefault();
    if (!sb) return;
    const { error } = await sb.from("site_contact").upsert(
      {
        id: 1,
        ...siteContact,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) showErr(formatSupabaseErr(error));
    else showOk("Contact details & footer saved.");
  }

  async function deleteInboxRow(id: string) {
    if (!sb) return;
    if (!window.confirm("Delete this submission permanently?")) return;
    const { error } = await sb.from("contact_submissions").delete().eq("id", id);
    if (error) showErr(formatSupabaseErr(error));
    else {
      showOk("Submission deleted.");
      await loadAll();
    }
  }

  function addFeature() {
    setAboutFeatures((rows) => [
      ...rows,
      { id: pendingId(), sort_order: rows.length, bullet: "" },
    ]);
  }

  function removeFeature(id: string) {
    setAboutFeatures((rows) => rows.filter((r) => r.id !== id));
  }

  function addAccordionRow() {
    setAboutAccordion((rows) => [
      ...rows,
      { id: pendingId(), sort_order: rows.length, title: "", body: "" },
    ]);
  }

  function removeAccordionRow(id: string) {
    setAboutAccordion((rows) => rows.filter((r) => r.id !== id));
  }

  function addProcessStep() {
    setProcessSteps((rows) => [
      ...rows,
      { id: pendingId(), sort_order: rows.length, step_number: "", title: "", body: "" },
    ]);
  }

  function removeProcessStep(id: string) {
    setProcessSteps((rows) => rows.filter((r) => r.id !== id));
  }

  async function signOut() {
    await sb?.auth.signOut();
  }

  if (!sb) {
    return (
      <div className="admin-shell admin-shell--center">
        <p className="admin-muted">Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.</p>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin-bar">
        <h1>Edit website content</h1>
        <div className="admin-actions">
          <Link to="/" className="btn btn--outline-dark btn--small">
            View site
          </Link>
          <button type="button" className="btn btn--outline-dark btn--small" onClick={() => void loadAll()}>
            Reload
          </button>
          <button type="button" className="btn btn--outline-dark btn--small" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </div>

      {banner ? (
        <div
          className={`admin-banner ${banner.type === "err" ? "admin-banner--error" : ""}`}
          role="status"
        >
          {banner.text}
        </div>
      ) : null}

      {loading ? (
        <p className="admin-muted" style={{ textAlign: "center" }}>
          Loading…
        </p>
      ) : (
        <div className="admin-layout">
          <section className="admin-card">
            <h2>Hero</h2>
            <form className="admin-grid" onSubmit={(e) => void saveHero(e)}>
              <div className="admin-field">
                <label htmlFor="eyebrow">Eyebrow</label>
                <input
                  id="eyebrow"
                  value={hero.eyebrow}
                  onChange={(e) => setHero((h) => ({ ...h, eyebrow: e.target.value }))}
                />
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label htmlFor="hi">Headline (italic part)</label>
                  <input
                    id="hi"
                    value={hero.headline_italic}
                    onChange={(e) => setHero((h) => ({ ...h, headline_italic: e.target.value }))}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="hp">Headline (rest)</label>
                  <input
                    id="hp"
                    value={hero.headline_plain}
                    onChange={(e) => setHero((h) => ({ ...h, headline_plain: e.target.value }))}
                  />
                </div>
              </div>
              <div className="admin-field">
                <label htmlFor="lead">Lead paragraph</label>
                <textarea
                  id="lead"
                  value={hero.lead}
                  onChange={(e) => setHero((h) => ({ ...h, lead: e.target.value }))}
                />
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label htmlFor="cta1t">Primary CTA label</label>
                  <input
                    id="cta1t"
                    value={hero.cta_primary_text}
                    onChange={(e) => setHero((h) => ({ ...h, cta_primary_text: e.target.value }))}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="cta1h">Primary CTA link</label>
                  <input
                    id="cta1h"
                    value={hero.cta_primary_href}
                    onChange={(e) => setHero((h) => ({ ...h, cta_primary_href: e.target.value }))}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="cta2t">Secondary CTA label</label>
                  <input
                    id="cta2t"
                    value={hero.cta_secondary_text}
                    onChange={(e) => setHero((h) => ({ ...h, cta_secondary_text: e.target.value }))}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="cta2h">Secondary CTA link</label>
                  <input
                    id="cta2h"
                    value={hero.cta_secondary_href}
                    onChange={(e) => setHero((h) => ({ ...h, cta_secondary_href: e.target.value }))}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn--primary-solid btn--small">
                Save hero
              </button>
            </form>
          </section>

          <section className="admin-card">
            <h2>Hero stat tiles</h2>
            <p className="admin-muted" style={{ marginBottom: "1rem" }}>
              Order uses <code>sort_order</code> (lower first). Empty value/label rows are skipped on save.
            </p>
            {stats.map((row, idx) => (
              <div key={row.id} className="admin-service-block">
                <div className="admin-row-actions" style={{ marginBottom: "0.75rem" }}>
                  <label className="admin-muted">
                    Order{" "}
                    <input
                      type="number"
                      value={row.sort_order}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setStats((rows) =>
                          rows.map((r) => (r.id === row.id ? { ...r, sort_order: v } : r))
                        );
                      }}
                    />
                  </label>
                  <button type="button" className="btn btn--danger-outline btn--small" onClick={() => removeStat(row.id)}>
                    Remove
                  </button>
                </div>
                <div className="admin-grid-2">
                  <div className="admin-field">
                    <label>Value ({idx + 1})</label>
                    <input
                      value={row.value}
                      onChange={(e) =>
                        setStats((rows) =>
                          rows.map((r) => (r.id === row.id ? { ...r, value: e.target.value } : r))
                        )
                      }
                    />
                  </div>
                  <div className="admin-field">
                    <label>Label</label>
                    <input
                      value={row.label}
                      onChange={(e) =>
                        setStats((rows) =>
                          rows.map((r) => (r.id === row.id ? { ...r, label: e.target.value } : r))
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="admin-row-actions">
              <button type="button" className="btn btn--outline-dark btn--small" onClick={addStat}>
                Add stat tile
              </button>
              <button type="button" className="btn btn--gold btn--small" onClick={() => void persistStats()}>
                Save stat tiles
              </button>
            </div>
          </section>

          <section className="admin-card">
            <h2>Services section heading</h2>
            <form className="admin-grid" onSubmit={(e) => void saveServicesHeading(e)}>
              <div className="admin-field">
                <label htmlFor="sl">Small label</label>
                <input
                  id="sl"
                  value={servicesHeading.section_label}
                  onChange={(e) =>
                    setServicesHeading((s) => ({ ...s, section_label: e.target.value }))
                  }
                />
              </div>
              <div className="admin-field">
                <label htmlFor="st">Section title</label>
                <textarea
                  id="st"
                  value={servicesHeading.section_title}
                  onChange={(e) =>
                    setServicesHeading((s) => ({ ...s, section_title: e.target.value }))
                  }
                />
              </div>
              <button type="submit" className="btn btn--primary-solid btn--small">
                Save heading
              </button>
            </form>
          </section>

          <section className="admin-card">
            <h2>Service cards</h2>
            <p className="admin-muted" style={{ marginBottom: "1rem" }}>
              Footer and contact form options stay in sync with this list.
            </p>
            {services.map((row, idx) => (
              <div key={row.id} className="admin-service-block">
                <div className="admin-row-actions" style={{ marginBottom: "0.75rem" }}>
                  <label className="admin-muted">
                    Order{" "}
                    <input
                      type="number"
                      value={row.sort_order}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setServices((rows) =>
                          rows.map((r) => (r.id === row.id ? { ...r, sort_order: v } : r))
                        );
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn--danger-outline btn--small"
                    onClick={() => removeService(row.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="admin-field" style={{ marginBottom: "0.75rem" }}>
                  <label>Title ({idx + 1})</label>
                  <input
                    value={row.title}
                    onChange={(e) =>
                      setServices((rows) =>
                        rows.map((r) => (r.id === row.id ? { ...r, title: e.target.value } : r))
                      )
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <textarea
                    value={row.description}
                    onChange={(e) =>
                      setServices((rows) =>
                        rows.map((r) => (r.id === row.id ? { ...r, description: e.target.value } : r))
                      )
                    }
                  />
                </div>
              </div>
            ))}
            <div className="admin-row-actions">
              <button type="button" className="btn btn--outline-dark btn--small" onClick={addService}>
                Add service
              </button>
              <button type="button" className="btn btn--gold btn--small" onClick={() => void persistServices()}>
                Save services
              </button>
            </div>
          </section>

          <section className="admin-card">
            <h2>About — story &amp; headings</h2>
            <form className="admin-grid" onSubmit={(e) => void saveAboutStory(e)}>
              <div className="admin-field">
                <label htmlFor="about-sl">Small label (left column)</label>
                <input
                  id="about-sl"
                  value={aboutStory.section_label}
                  onChange={(e) => setAboutStory((s) => ({ ...s, section_label: e.target.value }))}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="about-st">Story title</label>
                <input
                  id="about-st"
                  value={aboutStory.story_title}
                  onChange={(e) => setAboutStory((s) => ({ ...s, story_title: e.target.value }))}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="about-sx">Story paragraph</label>
                <textarea
                  id="about-sx"
                  value={aboutStory.story_text}
                  onChange={(e) => setAboutStory((s) => ({ ...s, story_text: e.target.value }))}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="about-ah">Accordion column heading</label>
                <input
                  id="about-ah"
                  value={aboutStory.accordion_heading}
                  onChange={(e) => setAboutStory((s) => ({ ...s, accordion_heading: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn btn--primary-solid btn--small">
                Save about story
              </button>
            </form>
          </section>

          <section className="admin-card">
            <h2>About — checklist (left column)</h2>
            {aboutFeatures.map((row, idx) => (
              <div key={row.id} className="admin-service-block">
                <div className="admin-row-actions" style={{ marginBottom: "0.75rem" }}>
                  <label className="admin-muted">
                    Order{" "}
                    <input
                      type="number"
                      value={row.sort_order}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setAboutFeatures((rows) =>
                          rows.map((r) => (r.id === row.id ? { ...r, sort_order: v } : r))
                        );
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn--danger-outline btn--small"
                    onClick={() => removeFeature(row.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="admin-field">
                  <label>Bullet {idx + 1}</label>
                  <input
                    value={row.bullet}
                    onChange={(e) =>
                      setAboutFeatures((rows) =>
                        rows.map((r) => (r.id === row.id ? { ...r, bullet: e.target.value } : r))
                      )
                    }
                  />
                </div>
              </div>
            ))}
            <div className="admin-row-actions">
              <button type="button" className="btn btn--outline-dark btn--small" onClick={addFeature}>
                Add bullet
              </button>
              <button type="button" className="btn btn--gold btn--small" onClick={() => void persistAboutFeatures()}>
                Save checklist
              </button>
            </div>
          </section>

          <section className="admin-card">
            <h2>About — accordion items</h2>
            {aboutAccordion.map((row, idx) => (
              <div key={row.id} className="admin-service-block">
                <div className="admin-row-actions" style={{ marginBottom: "0.75rem" }}>
                  <label className="admin-muted">
                    Order{" "}
                    <input
                      type="number"
                      value={row.sort_order}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setAboutAccordion((rows) =>
                          rows.map((r) => (r.id === row.id ? { ...r, sort_order: v } : r))
                        );
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn--danger-outline btn--small"
                    onClick={() => removeAccordionRow(row.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="admin-field" style={{ marginBottom: "0.75rem" }}>
                  <label>Title ({idx + 1})</label>
                  <input
                    value={row.title}
                    onChange={(e) =>
                      setAboutAccordion((rows) =>
                        rows.map((r) => (r.id === row.id ? { ...r, title: e.target.value } : r))
                      )
                    }
                  />
                </div>
                <div className="admin-field">
                  <label>Body</label>
                  <textarea
                    value={row.body}
                    onChange={(e) =>
                      setAboutAccordion((rows) =>
                        rows.map((r) => (r.id === row.id ? { ...r, body: e.target.value } : r))
                      )
                    }
                  />
                </div>
              </div>
            ))}
            <div className="admin-row-actions">
              <button type="button" className="btn btn--outline-dark btn--small" onClick={addAccordionRow}>
                Add accordion item
              </button>
              <button type="button" className="btn btn--gold btn--small" onClick={() => void persistAboutAccordion()}>
                Save accordion
              </button>
            </div>
          </section>

          <section className="admin-card">
            <h2>Process — section heading</h2>
            <form className="admin-grid" onSubmit={(e) => void saveProcessHeading(e)}>
              <div className="admin-field">
                <label htmlFor="proc-sl">Small label</label>
                <input
                  id="proc-sl"
                  value={processHeading.section_label}
                  onChange={(e) =>
                    setProcessHeading((s) => ({ ...s, section_label: e.target.value }))
                  }
                />
              </div>
              <div className="admin-field">
                <label htmlFor="proc-st">Section title</label>
                <textarea
                  id="proc-st"
                  value={processHeading.section_title}
                  onChange={(e) =>
                    setProcessHeading((s) => ({ ...s, section_title: e.target.value }))
                  }
                />
              </div>
              <button type="submit" className="btn btn--primary-solid btn--small">
                Save process heading
              </button>
            </form>
          </section>

          <section className="admin-card">
            <h2>Process — steps</h2>
            <p className="admin-muted" style={{ marginBottom: "1rem" }}>
              <strong>Step number</strong> is the large label (e.g. <code>01</code>, <code>02</code>).
            </p>
            {processSteps.map((row, idx) => (
              <div key={row.id} className="admin-service-block">
                <div className="admin-row-actions" style={{ marginBottom: "0.75rem" }}>
                  <label className="admin-muted">
                    Order{" "}
                    <input
                      type="number"
                      value={row.sort_order}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setProcessSteps((rows) =>
                          rows.map((r) => (r.id === row.id ? { ...r, sort_order: v } : r))
                        );
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn btn--danger-outline btn--small"
                    onClick={() => removeProcessStep(row.id)}
                  >
                    Remove
                  </button>
                </div>
                <div className="admin-grid-2" style={{ marginBottom: "0.75rem" }}>
                  <div className="admin-field">
                    <label>Step number</label>
                    <input
                      value={row.step_number}
                      onChange={(e) =>
                        setProcessSteps((rows) =>
                          rows.map((r) =>
                            r.id === row.id ? { ...r, step_number: e.target.value } : r
                          )
                        )
                      }
                    />
                  </div>
                  <div className="admin-field">
                    <label>Step title ({idx + 1})</label>
                    <input
                      value={row.title}
                      onChange={(e) =>
                        setProcessSteps((rows) =>
                          rows.map((r) => (r.id === row.id ? { ...r, title: e.target.value } : r))
                        )
                      }
                    />
                  </div>
                </div>
                <div className="admin-field">
                  <label>Description</label>
                  <textarea
                    value={row.body}
                    onChange={(e) =>
                      setProcessSteps((rows) =>
                        rows.map((r) => (r.id === row.id ? { ...r, body: e.target.value } : r))
                      )
                    }
                  />
                </div>
              </div>
            ))}
            <div className="admin-row-actions">
              <button type="button" className="btn btn--outline-dark btn--small" onClick={addProcessStep}>
                Add step
              </button>
              <button type="button" className="btn btn--gold btn--small" onClick={() => void persistProcessSteps()}>
                Save process steps
              </button>
            </div>
          </section>

          <section className="admin-card">
            <h2>Contact &amp; footer (site-wide)</h2>
            <p className="admin-muted" style={{ marginBottom: "1rem" }}>
              Phone, email, and addresses appear on the <strong>Contact</strong> page and in the <strong>Footer</strong>.
              <code>phone_href</code> should be like <code>tel:+14165550199</code>. Footer wordmark uses{" "}
              <strong>Cormorant Garamond</strong> (see site CSS <code>--font-display</code>).
            </p>
            <form className="admin-grid" onSubmit={(e) => void saveSiteContact(e)}>
              <div className="admin-field">
                <label htmlFor="sc-office">Office line (contact page)</label>
                <input
                  id="sc-office"
                  value={siteContact.office_line}
                  onChange={(e) => setSiteContact((s) => ({ ...s, office_line: e.target.value }))}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="sc-addr">Address short (footer)</label>
                <input
                  id="sc-addr"
                  value={siteContact.address_short}
                  onChange={(e) => setSiteContact((s) => ({ ...s, address_short: e.target.value }))}
                />
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label htmlFor="sc-phone-d">Phone (display)</label>
                  <input
                    id="sc-phone-d"
                    value={siteContact.phone_display}
                    onChange={(e) => setSiteContact((s) => ({ ...s, phone_display: e.target.value }))}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="sc-phone-h">Phone (link href)</label>
                  <input
                    id="sc-phone-h"
                    value={siteContact.phone_href}
                    onChange={(e) => setSiteContact((s) => ({ ...s, phone_href: e.target.value }))}
                  />
                </div>
              </div>
              <div className="admin-field">
                <label htmlFor="sc-email">Email</label>
                <input
                  id="sc-email"
                  type="email"
                  value={siteContact.email}
                  onChange={(e) => setSiteContact((s) => ({ ...s, email: e.target.value }))}
                />
              </div>
              <div className="admin-grid-2">
                <div className="admin-field">
                  <label htmlFor="sc-brand-p">Footer brand (before gold span)</label>
                  <input
                    id="sc-brand-p"
                    value={siteContact.brand_primary}
                    onChange={(e) => setSiteContact((s) => ({ ...s, brand_primary: e.target.value }))}
                  />
                </div>
                <div className="admin-field">
                  <label htmlFor="sc-brand-a">Footer brand (gold span, often starts with space)</label>
                  <input
                    id="sc-brand-a"
                    value={siteContact.brand_accent}
                    onChange={(e) => setSiteContact((s) => ({ ...s, brand_accent: e.target.value }))}
                  />
                </div>
              </div>
              <div className="admin-field">
                <label htmlFor="sc-ftag">Footer tagline (under brand)</label>
                <textarea
                  id="sc-ftag"
                  value={siteContact.footer_tagline}
                  onChange={(e) => setSiteContact((s) => ({ ...s, footer_tagline: e.target.value }))}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="sc-copy">Copyright name (© line)</label>
                <input
                  id="sc-copy"
                  value={siteContact.copyright_entity}
                  onChange={(e) => setSiteContact((s) => ({ ...s, copyright_entity: e.target.value }))}
                />
              </div>
              <div className="admin-field">
                <label htmlFor="sc-legal">Legal line (footer bottom, second span)</label>
                <input
                  id="sc-legal"
                  value={siteContact.legal_footer_line}
                  onChange={(e) => setSiteContact((s) => ({ ...s, legal_footer_line: e.target.value }))}
                />
              </div>
              <button type="submit" className="btn btn--primary-solid btn--small">
                Save contact &amp; footer
              </button>
            </form>
          </section>

          <section className="admin-card">
            <h2>Contact form inbox</h2>
            <p className="admin-muted" style={{ marginBottom: "1rem" }}>
              Latest submissions (newest first). Deletes are permanent.
            </p>
            {submissions.length === 0 ? (
              <p className="admin-muted">No messages yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Service</th>
                      <th>Message</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((row) => (
                      <tr key={row.id}>
                        <td>{new Date(row.created_at).toLocaleString()}</td>
                        <td>{row.name}</td>
                        <td>
                          <a href={`mailto:${row.email}`}>{row.email}</a>
                        </td>
                        <td>{row.phone ?? "—"}</td>
                        <td>{row.service_interest ?? "—"}</td>
                        <td className="admin-table__msg">{row.message}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn--danger-outline btn--small"
                            onClick={() => void deleteInboxRow(row.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
