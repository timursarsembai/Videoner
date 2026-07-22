import { Language } from "./translations";

const PREFIXED_LOCALES: Language[] = ["ru", "es"];

// en — дефолтная локаль без префикса (/vimeo), ru/es — с префиксом (/ru/vimeo).
export function localizedHref(language: Language, href: string): string {
  if (href === "#" || href.startsWith("http")) return href;
  if (!PREFIXED_LOCALES.includes(language)) return href;
  return href === "/" ? `/${language}` : `/${language}${href}`;
}

// Убирает текущий локальный префикс из пути, чтобы построить ссылку на ту же
// страницу под другой локалью.
export function stripLocalePrefix(pathname: string): string {
  const match = pathname.match(/^\/(ru|es)(\/.*)?$/);
  if (match) return match[2] || "/";
  return pathname;
}
