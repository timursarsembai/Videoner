/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL,
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/api/*", "/_next", "/_next/*"],
      },
    ],
  },
  exclude: ["/api/*", "/_next/*", "/404", "/500"],
  generateIndexSitemap: false,
  changefreq: "daily",
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: path === "/" ? "daily" : "weekly",
      priority: path === "/" ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};
