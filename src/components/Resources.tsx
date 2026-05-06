import { useEffect, useMemo, useState } from "react";
import { getResourcePublicUrl } from "../lib/resourceStorage";
import { getSupabase } from "../lib/supabase";

type ResourcesHeading = { sectionLabel: string; sectionTitle: string };
type CategoryRow = { id: string; sort_order: number; name: string };
type ResourceRow = {
  id: string;
  category_id: string;
  sort_order: number;
  title: string;
  description: string;
  storage_path: string;
  file_name: string;
  file_size: number | null;
};

const headingFallback: ResourcesHeading = {
  sectionLabel: "Resources",
  sectionTitle: "Guides, templates, and reference materials.",
};

function formatBytes(n: number | null): string {
  if (n == null || n <= 0) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function Resources() {
  const sb = getSupabase();
  const [heading, setHeading] = useState<ResourcesHeading>(headingFallback);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!sb) {
      setLoadError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoadError(null);
      const [secRes, catRes, resRes] = await Promise.all([
        sb.from("resources_section").select("*").eq("id", 1).maybeSingle(),
        sb.from("resource_categories").select("*").order("sort_order", { ascending: true }),
        sb.from("site_resources").select("*").order("sort_order", { ascending: true }),
      ]);
      if (cancelled) return;
      const missing =
        secRes.error?.code === "PGRST205" ||
        catRes.error?.code === "PGRST205" ||
        resRes.error?.code === "PGRST205";
      if (missing) {
        setLoadError("Resources are not set up yet. Run the SQL in supabase/migrate_resources.sql (or schema + admin_auth).");
        return;
      }
      if (secRes.error) setLoadError(secRes.error.message);
      else if (secRes.data) {
        const r = secRes.data as Record<string, string>;
        setHeading({
          sectionLabel: r.section_label ?? headingFallback.sectionLabel,
          sectionTitle: r.section_title ?? headingFallback.sectionTitle,
        });
      }
      if (catRes.error && !missing) setLoadError(catRes.error.message);
      else {
        setCategories(
          ((catRes.data ?? []) as { id: string; sort_order: number; name: string }[]).map((c) => ({
            id: c.id,
            sort_order: c.sort_order,
            name: c.name,
          }))
        );
      }
      if (resRes.error && !missing) setLoadError(resRes.error.message);
      else {
        setResources((resRes.data ?? []) as ResourceRow[]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sb]);

  const byCategory = useMemo(() => {
    const map = new Map<string, ResourceRow[]>();
    for (const c of categories) map.set(c.id, []);
    for (const r of resources) {
      const list = map.get(r.category_id);
      if (list) list.push(r);
    }
    return map;
  }, [categories, resources]);

  if (!sb) return null;

  const visibleCategories = categories.filter((c) => (byCategory.get(c.id) ?? []).length > 0);

  return (
    <section className="section resources" id="resources" aria-labelledby="resources-heading">
      <header className="section__header">
        <p className="section__label">{heading.sectionLabel}</p>
        <h2 id="resources-heading" className="section__title">
          {heading.sectionTitle}
        </h2>
      </header>

      {loadError ? (
        <p className="resources__note" role="status">
          {loadError}
        </p>
      ) : visibleCategories.length === 0 ? (
        <p className="resources__empty">New materials will appear here soon.</p>
      ) : (
        <div className="resources__stack">
          {visibleCategories.map((cat) => (
            <div key={cat.id} className="resources__group">
              <h3 className="resources__category-title">{cat.name}</h3>
              <ul className="resources__list">
                {(byCategory.get(cat.id) ?? []).map((item) => {
                  const href = getResourcePublicUrl(sb, item.storage_path);
                  const size = formatBytes(item.file_size);
                  return (
                    <li key={item.id} className="resources__item">
                      <div className="resources__item-main">
                        <a className="resources__link" href={href} download={item.file_name} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </a>
                        {item.description ? <p className="resources__desc">{item.description}</p> : null}
                      </div>
                      <div className="resources__meta">
                        <span className="resources__fname">{item.file_name}</span>
                        {size ? <span className="resources__size">{size}</span> : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
