/** @type {import('next-sitemap').IConfig} */
const DOMAIN = "https://videoner.download";

// en рендерится без префикса в URL (миддлварь делает internal rewrite /vimeo -> /en/vimeo),
// поэтому в статической выдаче билда все страницы физически лежат под /en, /ru, /es —
// здесь превращаем /en/* обратно в каноничный путь без префикса и добавляем hreflang-алтернативы.
function stripLocalePrefix(path) {
  const m = path.match(/^\/(en|ru|es)(\/.*)?$/);
  if (m) return m[2] || "/";
  return path;
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
          "/_next",
          "/_next/*",
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
  ],
  generateIndexSitemap: false,
  changefreq: "daily",
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, path) => {
    const base = stripLocalePrefix(path);
    const isEnglish = !path.startsWith("/ru") && !path.startsWith("/es");
    const loc = isEnglish ? base : path;

    return {
      loc,
      changefreq: base === "/" ? "daily" : "weekly",
      priority: base === "/" ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
      // next-sitemap сам дописывает относительный путь текущей записи (base) к
      // этому href — сюда передаём только корень домена/локали, без пути страницы.
      alternateRefs: [
        { href: DOMAIN, hreflang: "en" },
        { href: `${DOMAIN}/ru`, hreflang: "ru" },
        { href: `${DOMAIN}/es`, hreflang: "es" },
        { href: DOMAIN, hreflang: "x-default" },
      ],
    };
  },
};
