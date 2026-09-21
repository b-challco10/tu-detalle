import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Template } from "./types";

const TEMPLATES_DIR = path.join(process.cwd(), "templates");

export async function loadTemplate(template: Template) {
  const templateDir = path.join(
    TEMPLATES_DIR,
    template.slug
  );

  const [html, css, js] = await Promise.all([
    readFile(path.join(templateDir, "index.html"), "utf8"),
    readFile(path.join(templateDir, "style.css"), "utf8"),
    readFile(path.join(templateDir, "script.js"), "utf8"),
  ]);

  return {
    html,
    css,
    js,
  };
}