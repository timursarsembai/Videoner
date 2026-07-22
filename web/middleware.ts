import { NextRequest, NextResponse } from "next/server";

// en — дефолтная локаль без префикса в URL (/vimeo), ru/es — с префиксом
// (/ru/vimeo, /es/vimeo). Здесь просто дописываем /en для дефолтных путей,
// чтобы они попали в те же файлы app/[locale]/... — адресная строка у
// пользователя не меняется (rewrite, не redirect).
const PREFIXED_LOCALES = ["ru", "es"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /en — не публичный префикс (en живёт без префикса); если кто-то зашёл сюда
  // напрямую (старая ссылка, любопытный краулер), редиректим на канонический
  // путь без префикса, а не rewrite'им — иначе получили бы /en/en/... и 404.
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/en" ? "/" : pathname.slice(3);
    return NextResponse.redirect(url, 308);
  }

  const hasLocalePrefix = PREFIXED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocalePrefix) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|_next|dashboard|favicon.ico|icon.ico|robots.txt|sitemap.xml|images|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml)$).*)",
  ],
};
