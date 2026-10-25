import type { TemplateField } from "./types";
import { templates as codeTemplates } from "./registry";

const FIELD_TYPES = ["text", "textarea", "color", "image", "audio"] as const;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FIELD_ID_RE = /^[A-Za-z][A-Za-z0-9_]{0,39}$/;

const MAX_HTML = 300_000;
const MAX_CSS = 300_000;
const MAX_JS = 600_000;

export interface TemplateInput {
  slug: string;
  name: string;
  description: string;
  category: string;
  preview_url: string | null;
  schema: TemplateField[];
  html: string;
  css: string;
  js: string;
  active: boolean;
}

type Result =
  | { ok: true; value: TemplateInput }
  | { ok: false; error: string };

function fail(error: string): Result {
  return { ok: false, error };
}

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

export function parseTemplateInput(body: unknown): Result {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return fail("Datos inválidos.");
  }

  const b = body as Record<string, unknown>;

  const slug = text(b.slug).trim().toLowerCase();
  const name = text(b.name).trim();
  const description = text(b.description).trim();
  const category = text(b.category).trim();
  const html = text(b.html);
  const css = text(b.css);
  const js = text(b.js);

  if (!SLUG_RE.test(slug) || slug.length > 60) {
    return fail(
      "El slug solo puede tener minúsculas, números y guiones (ej: pino-navideno)."
    );
  }

  if (codeTemplates.some((item) => item.slug === slug)) {
    return fail(
      "Ese slug ya lo usa una plantilla de la carpeta. Elige otro."
    );
  }

  if (!name || name.length > 80) {
    return fail("El nombre es obligatorio (máximo 80 caracteres).");
  }

  if (description.length > 600) {
    return fail("La descripción es muy larga (máximo 600 caracteres).");
  }

  if (!category || category.length > 60) {
    return fail("Elige una categoría.");
  }

  if (!html.trim()) {
    return fail("El HTML no puede estar vacío.");
  }

  if (html.length > MAX_HTML || css.length > MAX_CSS || js.length > MAX_JS) {
    return fail("Algún archivo (HTML, CSS o JS) es demasiado grande.");
  }

  let preview_url: string | null = null;

  if (typeof b.preview_url === "string" && b.preview_url.trim()) {
    const url = b.preview_url.trim();

    if (url.length > 500 || !/^(https?:\/\/|\/)/.test(url)) {
      return fail("La imagen de la tarjeta debe ser una URL válida.");
    }

    preview_url = url;
  }

  if (!Array.isArray(b.schema) || b.schema.length > 30) {
    return fail("Los campos del formulario son inválidos (máximo 30).");
  }

  const schema: TemplateField[] = [];
  const seen = new Set<string>();

  for (const raw of b.schema) {
    if (!raw || typeof raw !== "object") {
      return fail("Hay un campo del formulario inválido.");
    }

    const f = raw as Record<string, unknown>;
    const id = text(f.id).trim();
    const label = text(f.label).trim();
    const type = text(f.type) as TemplateField["type"];

    if (!FIELD_ID_RE.test(id)) {
      return fail(
        `El id "${id}" no es válido. Usa letras, números o _ (debe empezar con letra).`
      );
    }

    if (seen.has(id)) {
      return fail(`El id "${id}" está repetido.`);
    }

    seen.add(id);

    if (!label || label.length > 80) {
      return fail(`El campo "${id}" necesita una etiqueta (máx. 80 caracteres).`);
    }

    if (!FIELD_TYPES.includes(type)) {
      return fail(`El tipo del campo "${id}" no es válido.`);
    }

    const field: TemplateField = { id, label, type };

    const placeholder = text(f.placeholder).trim();

    if (placeholder) field.placeholder = placeholder.slice(0, 200);
    if (f.required === true) field.required = true;

    schema.push(field);
  }

  return {
    ok: true,
    value: {
      slug,
      name,
      description,
      category,
      preview_url,
      schema,
      html,
      css,
      js,
      active: b.active !== false,
    },
  };
}
