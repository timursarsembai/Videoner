import type { NextConfig } from "next";

// Защитные заголовки на все ответы сайта (проверка безопасности 09.11.2026
// нашла, что их нет вовсе).
//
// CSP намеренно узкий: он не ограничивает скрипты. Next.js вставляет свои
// скрипты прямо в страницу, плюс Google Tag Manager, Яндекс Метрика и виджет
// входа Telegram — строгий script-src без нонсов сломал бы сайт. Зато он
// закрывает то, что ничего не ломает: встраивание сайта в чужие фреймы
// (кликджекинг), подмену <base>, плагины <object>/<embed> и отправку форм на
// чужие адреса, а заодно поднимает случайные http-ссылки до https.
const CONTENT_SECURITY_POLICY = [
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  // Год только по https. Без includeSubDomains: поддомены (staging и
  // прочие) живут своей жизнью, и обещать за них https браузеру на год
  // вперёд нельзя.
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  // Для старых браузеров, которые не знают frame-ancestors.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Чужим сайтам — только домен, без пути и параметров страницы.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
