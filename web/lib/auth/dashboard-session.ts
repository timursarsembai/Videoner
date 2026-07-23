// Имя httpOnly-cookie, хранящей ключ дашборд-аналитики на сервере (см.
// app/api/dashboard/auth/route.ts и app/api/dashboard/[...path]/route.ts).
// Отдельная константа, а не значение внутри route.ts — Next.js допускает
// именованные экспорты помимо HTTP-методов в route.ts, но общие константы
// принято выносить в lib, как и SESSION_COOKIE_NAME рядом.
export const DASHBOARD_KEY_COOKIE = "videoner_dashboard_key";
