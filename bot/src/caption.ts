// Описание поста в подписи к файлу (i18n.ts fileCaption).
//
// Для постов соцсетей — TikTok, Instagram, Threads, X, Facebook, Pinterest —
// под названием идёт текст поста: ради него такие ролики часто и пересылают.
// У видеохостингов (YouTube, VK, Rutube…) описание — простыня ссылок и
// тайм-кодов, его не берём.
const POST_HOSTS = /(^|\.)(tiktok\.com|instagram\.com|threads\.(net|com)|x\.com|twitter\.com|facebook\.com|fb\.watch|pinterest\.[a-z.]+|pin\.it)$/i;

export function postDescription(url: string, description: string | undefined): string | undefined {
  if (!description?.trim()) return undefined;
  try {
    return POST_HOSTS.test(new URL(url).hostname) ? description.trim() : undefined;
  } catch {
    return undefined;
  }
}

const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

// Что писать после 🎬 и что — отдельным абзацем. Площадки часто делают
// название из начала того же текста (TikTok — целиком, Threads — первую
// строку): повторять его дважды незачем.
export function splitTitle(title: string, description: string | undefined): { head: string; extra?: string } {
  if (!description) return { head: title };
  const t = norm(title).replace(/(\.{2,}|…)$/, "");
  const d = norm(description);
  if (!t) return { head: description };
  if (d === norm(title) || t.includes(d)) return { head: title };
  if (d.startsWith(t)) {
    // Название — начало описания: показываем остаток после него.
    const rest = description.trim().replace(/\s+/g, " ").slice(t.length).replace(/^[\s.…:,-]+/, "");
    return rest ? { head: title, extra: rest } : { head: title };
  }
  return { head: title, extra: description };
}

// Обрезает по границе слова и ставит «…». max < 20 — места нет вовсе.
export function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  if (max < 20) return "";
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(" ");
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).trimEnd()}…`;
}
