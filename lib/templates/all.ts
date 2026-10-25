import type { Template } from "./types";
import { templates as codeTemplates } from "./registry";
import { loadTemplate } from "./loader";
import {
  getDbTemplateBySlug,
  getDbTemplateSource,
  getDbTemplates,
} from "./db";

/**
 * Plantillas de la carpeta (registry.ts) + las creadas desde el panel.
 * Si un slug existe en las dos, GANA la de la carpeta.
 */
export async function getAllTemplates(): Promise<Template[]> {
  const fromCode = codeTemplates.filter((item) => item.active);
  const codeSlugs = new Set(fromCode.map((item) => item.slug));

  const fromDb = (await getDbTemplates()).filter(
    (item) => !codeSlugs.has(item.slug)
  );

  return [...fromCode, ...fromDb];
}

export async function getTemplateBySlug(
  slug: string
): Promise<Template | null> {
  const fromCode = codeTemplates.find(
    (item) => item.slug === slug || item.id === slug
  );

  if (fromCode) return fromCode;

  return getDbTemplateBySlug(slug);
}

/** HTML + CSS + JS de una plantilla, venga de la carpeta o de la BD. */
export async function getTemplateSource(slug: string): Promise<{
  template: Template;
  html: string;
  css: string;
  js: string;
} | null> {
  const fromCode = codeTemplates.find((item) => item.slug === slug);

  if (fromCode) {
    const source = await loadTemplate(fromCode);
    return { template: fromCode, ...source };
  }

  return getDbTemplateSource(slug);
}
