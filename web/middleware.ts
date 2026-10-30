import { NextRequest, NextResponse } from "next/server";
import { detectPlatform } from "@/lib/validations/url";

// en — дефолтная локаль без префикса в URL (/vimeo), ru/es/uk — с префиксом
// (/ru/vimeo, /es/vimeo, /uk/vimeo). Список совпадает с LANGUAGES
// (lib/i18n/translations.ts): сюда словари не тянем, они тяжёлые. Здесь просто дописываем /en для дефолтных путей,
// чтобы они попали в те же файлы app/[locale]/... — адресная строка у
// пользователя не меняется (rewrite, не redirect).
const PREFIXED_LOCALES = ["ru", "es", "uk"];

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
const LOCALE_PREFIX = /^\/(ru|es|uk)(?=\/)/;

// Исходная ссылка из пути запроса: общий разбор для префикс-ссылки и
// ссылки-приглашения в бота. null — в пути не ссылка.
function extractLink(rawPath: string, search: string): string | null {
  let path = rawPath;

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
  return restored + search;
}

function prefixedLink(request: NextRequest): NextResponse | null {
  let path = request.nextUrl.pathname.slice(1);

  // Ссылка может приехать с локальным префиксом: /ru/https://...
  let locale = "";
  const localeMatch = `/${path}`.match(LOCALE_PREFIX);
  if (localeMatch) {
    locale = localeMatch[1];
    path = path.slice(locale.length + 1);
  }

  const target = extractLink(path, request.nextUrl.search);
  if (!target) return null;

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

// Ссылки-приглашения в бота (см. bot/src/handlers/invite.ts):
//   /b/<код>       — короткая, её бот ставит в подпись под каждым файлом;
//   /bot/<ссылка>  — длинная, её можно собрать руками (принимаем и /bot&<ссылка>);
//   /bot           — просто бот.
// Код для длинной формы выдаёт сервер — за ним ходит /api/invite, middleware
// только переписывает туда запрос. Короткую форму проверяет сам бот: здесь
// идти на сервер незачем.
// ||, а не ??: build-arg без значения приезжает пустой строкой, а не undefined.
const BOT_URL = `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "VideonerBot"}`;
const INVITE_CODE = /^\/b\/([A-Za-z0-9]{4,32})\/?$/;
const INVITE_LINK = /^\/bot(?:\/|&|%26)(.+)$/i;
const BOT_ONLY = /^\/bot\/?$/i;

function botInvite(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;

  const code = pathname.match(INVITE_CODE);
  if (code) return NextResponse.redirect(`${BOT_URL}?start=${code[1]}`, 307);
  if (BOT_ONLY.test(pathname)) return NextResponse.redirect(BOT_URL, 307);

  const link = pathname.match(INVITE_LINK);
  if (!link) return null;
  const target = extractLink(link[1], request.nextUrl.search);
  // Ссылку не разобрали или площадка не наша — всё равно ведём в бота:
  // человек шёл именно туда, а там подскажут, какие ссылки подходят.
  if (!target || !detectPlatform(target)) return NextResponse.redirect(BOT_URL, 307);

  const url = request.nextUrl.clone();
  url.pathname = "/api/invite";
  url.search = "";
  // Ссылку передаём заголовком — почему не query, см. app/api/invite/route.ts.
  // Закодированной: после decodeURIComponent в ней бывают кириллица и
  // переводы строк, а Headers.set на них бросает исключение.
  const headers = new Headers(request.headers);
  headers.set("x-videoner-invite-url", encodeURIComponent(target));
  return NextResponse.rewrite(url, { request: { headers } });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Раньше локальной логики: /https://... — это не путь сайта, и подставлять
  // ему /en бессмысленно.
  const prefixed = prefixedLink(request);
  if (prefixed) return prefixed;

  const invite = botInvite(request);
  if (invite) return invite;

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
    "/((?!api|_next|dashboard|favicon.ico|icon.ico|robots.txt|sitemap.xml|images|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|xml|zip|xpi|json)$).*)",
  ],
};
