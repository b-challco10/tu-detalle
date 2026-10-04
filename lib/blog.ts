import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  category: string;
  readingMinutes: number;
};

export type Post = PostMeta & { content: string };

function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getPostBySlug(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  if (data.draft) return null; // `draft: true` oculta el artículo

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: new Date(data.date ?? Date.now()).toISOString().slice(0, 10),
    category: String(data.category ?? "Ideas"),
    readingMinutes: readingTime(content),
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => getPostBySlug(f.replace(/\.md$/, "")))
    .filter((p): p is Post => p !== null)
    .map(({ content: _content, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}