// Разметка статей блога (content/blog/<slug>/<язык>.md) — нарочно маленькое
// подмножество Markdown: его одинаково просто показать на сайте
// (components/blog/BlogBody.tsx) и отправить в канал Telegram (telegramHtml).
//   абзацы через пустую строку, «## Подзаголовок», списки «- » и «1. »,
//   **жирный**, `код`, [ссылка](https://…).

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] };

export type Inline =
  | { kind: "text"; text: string }
  | { kind: "bold"; text: string }
  | { kind: "code"; text: string }
  | { kind: "link"; text: string; href: string };

export function parseBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  for (const chunk of markdown.replace(/\r\n/g, "\n").split(/\n\s*\n/)) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    if (lines.length === 1 && lines[0].startsWith("## ")) {
      blocks.push({ type: "h", text: lines[0].slice(3).trim() });
    } else if (lines.every((l) => l.startsWith("- "))) {
      blocks.push({ type: "ul", items: lines.map((l) => l.slice(2).trim()) });
    } else if (lines.every((l) => /^\d+\.\s/.test(l))) {
      blocks.push({ type: "ol", items: lines.map((l) => l.replace(/^\d+\.\s+/, "")) });
    } else {
      blocks.push({ type: "p", text: lines.join(" ") });
    }
  }
  return blocks;
}

const INLINE = /\*\*([^*]+)\*\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|`([^`]+)`/g;

export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index! > last) out.push({ kind: "text", text: text.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ kind: "bold", text: m[1] });
    else if (m[4] !== undefined) out.push({ kind: "code", text: m[4] });
    else out.push({ kind: "link", text: m[2], href: m[3] });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ kind: "text", text: text.slice(last) });
  return out;
}

export function plainText(text: string): string {
  return parseInline(text)
    .map((p) => p.text)
    .join("");
}

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function inlineHtml(text: string): string {
  return parseInline(text)
    .map((p) =>
      p.kind === "bold"
        ? `<b>${escape(p.text)}</b>`
        : p.kind === "code"
          ? `<code>${escape(p.text)}</code>`
          : p.kind === "link"
          ? `<a href="${escape(p.href).replace(/"/g, "&quot;")}">${escape(p.text)}</a>`
          : escape(p.text),
    )
    .join("");
}

function blockHtml(b: Block): string {
  if (b.type === "h") return `<b>${escape(plainText(b.text))}</b>`;
  if (b.type === "ul") return b.items.map((i) => `• ${inlineHtml(i)}`).join("\n");
  if (b.type === "ol") return b.items.map((i, n) => `${n + 1}. ${inlineHtml(i)}`).join("\n");
  return inlineHtml(b.text);
}

// Лимит текста сообщения Telegram — 4096 символов без учёта тегов; считаем
// с тегами, с запасом.
const TELEGRAM_LIMIT = 4000;

// Пост для канала: заголовок, статья целиком и ссылка на неё в блоге. Не
// влезает — обрываем по целому блоку и зовём дочитать на сайте.
export function telegramHtml(
  post: { title: string; blocks: Block[] },
  url: string,
  labels: { readOnSite: string; readMore: string },
): string {
  const head = `<b>${escape(post.title)}</b>`;
  const parts = post.blocks.map(blockHtml);
  const full = [head, ...parts, `<a href="${url}">${escape(labels.readOnSite)}</a>`].join("\n\n");
  if (full.length <= TELEGRAM_LIMIT) return full;
  const tail = `…\n\n<a href="${url}">${escape(labels.readMore)}</a>`;
  const kept = [head];
  for (const part of parts) {
    if ([...kept, part].join("\n\n").length + tail.length + 2 > TELEGRAM_LIMIT) break;
    kept.push(part);
  }
  return `${kept.join("\n\n")}\n\n${tail}`;
}
