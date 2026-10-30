import fs from "node:fs";
import path from "node:path";

import { Language } from "@/lib/i18n/translations";
import { Block, parseBlocks } from "./markdown";

// Статьи блога: content/blog/<slug>/<язык>.md с шапкой
//   ---
//   title: …
//   summary: …
//   date: YYYY-MM-DD
//   ---
// Читаются при сборке (страницы блога статические). Статьи с датой в
// будущем не показываются — так статью можно выложить заранее.

export type BlogPost = {
  slug: string;
  date: string;
  // Язык текста: если перевода на язык страницы нет — английский, потом русский.
  lang: Language;
  title: string;
  summary: string;
  blocks: Block[];
};

const DIR = path.join(process.cwd(), "content", "blog");
const FALLBACK: Language[] = ["en", "ru"];

function parseFile(file: string): { meta: Record<string, string>; body: string } | null {
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return null;
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
  }
  return { meta, body: m[2] };
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getPost(slug: string, lang: Language): BlogPost | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  for (const l of [lang, ...FALLBACK.filter((f) => f !== lang)]) {
    const parsed = parseFile(path.join(DIR, slug, `${l}.md`));
    if (!parsed) continue;
    const { meta, body } = parsed;
    if (!meta.title || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date ?? "") || meta.date > today()) return null;
    return { slug, date: meta.date, lang: l, title: meta.title, summary: meta.summary ?? "", blocks: parseBlocks(body) };
  }
  return null;
}

// Новые сверху.
export function listPosts(lang: Language): BlogPost[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .map((slug) => getPost(slug, lang))
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}
