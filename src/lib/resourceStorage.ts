import type { SupabaseClient } from "@supabase/supabase-js";

/** Must match Storage bucket id in Supabase (see admin_auth.sql / migrate_resources.sql). */
export const RESOURCES_BUCKET = "Resources";

export function getResourcePublicUrl(sb: SupabaseClient, storagePath: string): string {
  const { data } = sb.storage.from(RESOURCES_BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export function safeStorageFileName(name: string): string {
  const base = name
    .replace(/^.*[/\\]/, "")
    .replace(/[^\w.\- ()[\]]+/g, "_")
    .slice(0, 180);
  return base.length > 0 ? base : "file";
}
