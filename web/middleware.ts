import { NextRequest, NextResponse } from "next/server";
import { detectPlatform } from "@/lib/validations/url";

// en — дефолтная локаль без префикса в URL (/vimeo), ru/es — с префиксом
// (/ru/vimeo, /es/vimeo). Здесь просто дописываем /en для дефолтных путей,
// чтобы они попали в те же файлы app/[locale]/... — адресная строка у
// пользователя не меняется (rewrite, не redirect).
const PREFIXED_LOCALES = ["ru", "es"];

// Ссылка-префикс: videoner.download/<ЦЕЛИКОМ ИСХОДНАЯ ССЫЛКА>. Пользователь
// дописывает наш домен перед своей ссылкой, попадает на страницу нужной
// площадки, там уже подставлена ссылка и подгружены качества (механика
// ?url= в Page.tsx, она же используется при возврате с логина).
//
// Почему именно так, а не «убрать домен площадки» (videoner.download/watch?v=X):
// без домена путь перестаёт быть однозначным. /watch?v= бывает и у YouTube, и у
// Facebook, /reel/ — у Facebook и Instagram, /video/ — у Rutube и OK.ru, а
// короткие ссылки (youtu.be, vm.tiktok.com, pin.it, fb.watch) вообще не
// содержат ничего, кроме кода. Полная ссылка снимает вопрос целиком и работает
// для всех площадок сразу, включая те, что появятся позже.
//
// Площадку определяем ТЕМ ЖЕ detectPlatform, что и сайт: заводить здесь
// собственный список доменов — верный способ получить расхождение (эта
// валидация уже дважды разъезжалась между веб- и серверной копией).
const LOCALE_PREFIX = /^\/(ru|es)(?=\/)/;

function prefixedLink(request: NextRequest): NextResponse | null {
  let path = request.nextUrl.pathname.slice(1);

  // Ссылка может приехать с локальным префиксом: /ru/https://...
  let locale = "";
  const localeMatch = `/${path}`.match(LOCALE_PREFIX);
  if (localeMatch) {
    locale = localeMatch[1];
    path = path.slice(locale.length + 1);
  }

  // Мессенджеры и почтовые клиенты нередко отдают ссылку закодированной
  // (%3A%2F%2F) — принимаем и такую форму.
  if (path.includes("%")) {
    try {
      path = decodeURIComponent(path);
    } catch {
      // Битая последовательность — работаем с тем, что есть.
    }
  }

  if (!/^https?:\/+/i.test(path)) return null;

  // Двойной слэш после схемы по дороге к нам могут схлопнуть (nginx, сам
  // Next.js) — тогда путь выглядит как "https:/www.youtube.com/watch".
  // Восстанавливаем, иначе new URL() внутри detectPlatform разберёт это как
  // ссылку с пустым хостом.
  const restored = path.replace(/^(https?:)\/+/i, "$1//");

  // Хвост запроса приезжает ОТДЕЛЬНО от пути: в
  // videoner.download/https://youtube.com/watch?v=abc часть ?v=abc попадает в
  // query нашего запроса. Без неё от ссылки осталось бы "/watch" без
  // идентификатора видео.
  const target = restored + request.nextUrl.search;

  const url = request.nextUrl.clone();
  url.search = "";

  const platform = detectPlatform(target);
  if (!platform) {
    // Ссылку разобрать не смогли (или площадка не наша) — отправляем на
    // главную, а не показываем 404: человек уже сделал осмысленное действие,
    // и там он хотя бы увидит список поддерживаемых площадок.
    url.pathname = locale ? `/${locale}` : "/";
    return NextResponse.redirect(url, 307);
  }

  url.pathname = locale ? `/${locale}/${platform}` : `/${platform}`;
  url.searchParams.set("url", target);
  // 307, а не 308: адрес одноразовый, и кешировать его в браузере навсегда
  // ни к чему.
  return NextResponse.redirect(url, 307);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Раньше локальной логики: /https://... — это не путь сайта, и подставлять
  // ему /en бессмысленно.
  const prefixed = prefixedLink(request);
  if (prefixed) return prefixed;

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
