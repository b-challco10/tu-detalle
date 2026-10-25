import type { Template, TemplateField } from "./types";
import { createPublicClient } from "@/lib/supabase/public";
import { createClient } from "@/lib/supabase/server";

export interface DbTemplateRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string | null;
  preview_url: string | null;
  schema: TemplateField[] | null;
  html: string | null;
  css: string | null;
  js: string | null;
  active: boolean;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
}

type PublicRow = Pick<
  DbTemplateRow,
  | "id"
  | "slug"
  | "name"
  | "description"
  | "category"
  | "preview_url"
  | "schema"
  | "active"
>;

const PUBLIC_COLUMNS =
  "id, slug, name, description, category, preview_url, schema, active";

function toTemplate(row: PublicRow): Template {
  return {
    id: row.slug,
    slug: row.slug,
    name: row.name,
    description: row.description ?? "",
    category: row.category ?? "Romántica",
    preview: row.preview_url ?? undefined,
    active: row.active,
    schema: Array.isArray(row.schema) ? row.schema : [],
  };
}

/* ------------------------------------------------------------------ */
/* Lectura PÚBLICA (solo plantillas activas)                           */
/* Si la base de datos falla, devuelve vacío: las de la carpeta        */
/* siguen funcionando.                                                 */
/* ------------------------------------------------------------------ */

export async function getDbTemplates(): Promise<Template[]> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("templates")
      .select(PUBLIC_COLUMNS)
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error leyendo plantillas de la BD:", error.message);
      return [];
    }

    return ((data ?? []) as PublicRow[]).map(toTemplate);
  } catch (error) {
    console.error("Error leyendo plantillas de la BD:", error);
    return [];
  }
}

export async function getDbTemplateBySlug(
  slug: string
): Promise<Template | null> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("templates")
      .select(PUBLIC_COLUMNS)
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (error || !data) return null;

    return toTemplate(data as PublicRow);
  } catch {
    return null;
  }
}

export async function getDbTemplateSource(slug: string): Promise<{
  template: Template;
  html: string;
  css: string;
  js: string;
} | null> {
  try {
    const supabase = createPublicClient();

    const { data, error } = await supabase
      .from("templates")
      .select(`${PUBLIC_COLUMNS}, html, css, js`)
      .eq("slug", slug)
      .eq("active", true)
      .maybeSingle();

    if (error || !data) return null;

    const row = data as unknown as PublicRow &
      Pick<DbTemplateRow, "html" | "css" | "js">;

    return {
      template: toTemplate(row),
      html: row.html ?? "",
      css: row.css ?? "",
      js: row.js ?? "",
    };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Lectura de ADMINISTRADOR (usa tu sesión; incluye ocultas)           */
/* ------------------------------------------------------------------ */

export async function adminListTemplates(): Promise<{
  rows: DbTemplateRow[];
  error: string | null;
}> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("templates")
    .select(
      "id, slug, name, description, category, preview_url, active, sort_order, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  if (error) {
    return { rows: [], error: error.message };
  }

  return { rows: (data ?? []) as DbTemplateRow[], error: null };
}

export async function adminGetTemplate(
  id: string
): Promise<DbTemplateRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  return data as DbTemplateRow;
}
