// Имя httpOnly-cookie с сессией дашборда (см. app/api/dashboard/auth/route.ts
// и lib/auth/dashboard-auth.ts). В ней подписанный токен после входа по
// логину, паролю и коду из Google Authenticator. Раньше здесь лежал сам
// API-ключ администратора (cookie videoner_dashboard_key); прежние cookie
// с этим именем больше ничего не открывают.
export const DASHBOARD_SESSION_COOKIE = "videoner_dashboard_session";
