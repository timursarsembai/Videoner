/** @type {import('next-sitemap').IConfig} */
const fs = require("node:fs");
const path = require("node:path");

const DOMAIN = "https://videoner.download";

// en рендерится без префикса в URL (миддлварь делает internal rewrite /vimeo -> /en/vimeo),
// поэтому в статической выдаче билда все страницы физически лежат под /en, /ru, /es, /uk, /kk, /ar, /zh, /hi, /id, /sw, /de, /fr, /it, /pt, /uz —
// здесь превращаем /en/* обратно в каноничный путь без префикса и добавляем hreflang-алтернативы.
const PREFIXED = ["ru", "es", "uk", "kk", "ar", "zh", "hi", "id", "sw", "de", "fr", "it", "pt", "uz", "tr", "fa", "vi", "bn", "ur", "pl", "ja", "ko", "th", "tl", "am", "om", "ha", "so", "az", "ky", "tg", "ms", "nl", "ro", "ps", "ckb", "ku", "ug", "tk", "tt", "sq", "bs", "ce", "inh", "av"];

function stripLocalePrefix(path) {
  const m = path.match(/^\/(en|ru|es|uk|kk|ar|zh|hi|id|sw|de|fr|it|pt|uz|tr|fa|vi|bn|ur|pl|ja|ko|th|tl|am|om|ha|so|az|ky|tg|ms|nl|ro|ps|ckb|ku|ug|tk|tt|sq|bs|ce|inh|av)(\/.*)?$/);
  if (m) return m[2] || "/";
  return path;
}

// lastmod статей блога — дата из шапки статьи (updated, иначе date), а не время
// сборки: иначе при каждом выкате все статьи выглядели бы только что
// изменёнными. Разбор шапки — как в lib/blog/posts.ts (конфиг — CommonJS и
// TypeScript оттуда не импортирует). Нет перевода — английский, потом русский.
const BLOG_DIR = path.join(__dirname, "content", "blog");
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function postDate(slug, lang) {
  for (const l of [lang, "en", "ru"]) {
    const file = path.join(BLOG_DIR, slug, `${l}.md`);
    if (!fs.existsSync(file)) continue;
    const head = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---/);
    if (!head) return null;
    const meta = {};
    for (const line of head[1].split("\n")) {
      const i = line.indexOf(":");
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"(.*)"$/, "$1");
    }
    if (!ISO_DATE.test(meta.date || "")) return null;
    return ISO_DATE.test(meta.updated || "") && meta.updated > meta.date ? meta.updated : meta.date;
  }
  return null;
}

function blogLastmod(base, lang) {
  const article = base.match(/^\/blog\/([a-z0-9-]+)$/);
  if (article) return postDate(article[1], lang);
  if (base !== "/blog" || !fs.existsSync(BLOG_DIR)) return null;
  // Список блога меняется с каждой новой статьёй — берём самую свежую. Статьи
  // «на будущее» в билд не попадают, их даты не считаем.
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Almaty" }).format(new Date());
  const dates = fs
    .readdirSync(BLOG_DIR)
    .map((slug) => postDate(slug, lang))
    .filter((d) => d && d <= today)
    .sort();
  return dates.at(-1) || null;
}

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api",
          "/api/*",
          // /_next не закрываем: Googlebot берёт оттуда JS и CSS, чтобы
          // отрисовать страницу, — без них он видит её недособранной.
          "/dashboard",
          "/dashboard/*",
          "/en",
          "/en/*",
        ],
      },
    ],
  },
  exclude: [
    "/api/*",
    "/_next/*",
    "/404",
    "/500",
    "/dashboard",
    "/dashboard/*",
    "/icon.ico",
    // Не страницы: RSS-ленты блога и справка для LLM-поиска.
    "/*/blog/rss.xml",
    "/blog/rss.xml",
    "/llms.txt",
    "/llms-full.txt",
  ],
  generateIndexSitemap: false,
  changefreq: "daily",
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, path) => {
    const base = stripLocalePrefix(path);
    const isEnglish = !PREFIXED.some((l) => path === `/${l}` || path.startsWith(`/${l}/`));
    const loc = isEnglish ? base : path;
    const lang = isEnglish ? "en" : path.split("/")[1];
    const blogDate = base.startsWith("/blog") ? blogLastmod(base, lang) : null;

    return {
      loc,
      changefreq: base === "/" ? "daily" : "weekly",
      priority: base === "/" ? 1.0 : 0.7,
      lastmod: blogDate ? new Date(`${blogDate}T00:00:00Z`).toISOString() : new Date().toISOString(),
      // next-sitemap сам дописывает относительный путь текущей записи (base) к
      // этому href — сюда передаём только корень домена/локали, без пути страницы.
      alternateRefs: [
        { href: DOMAIN, hreflang: "en" },
        ...PREFIXED.map((l) => ({ href: `${DOMAIN}/${l}`, hreflang: l })),
        { href: DOMAIN, hreflang: "x-default" },
      ],
    };
  },
};
