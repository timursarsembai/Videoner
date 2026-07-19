# Деплой на VPS (Docker + Nginx Proxy Manager)

Разворачивает бота **и** публичный сайт `https://videoner.sarsembai.dev`.
HTTPS и проксирование берёт на себя ваш уже работающий Nginx Proxy Manager (NPM)
на внешней docker-сети `proxy-network`.

## Что где крутится

| Контейнер | Роль | Сеть | Наружу |
|---|---|---|---|
| `videoner-web` | сайт (Next.js) | internal + proxy-network | через NPM (`/`) |
| `videoner-server` | API + yt-dlp + ffmpeg | internal + proxy-network | через NPM (`/download/*`) |
| `videoner-bot` | телеграм-бот | internal | нет (long polling) |
| `videoner-botapi` | локальный Telegram Bot API (файлы до 2 ГБ) | internal | нет |
| `videoner-postgres` | база | internal | нет |

Идея маршрутизации: на одном домене `/download/*` (публичные эндпоинты — прогресс и файлы)
NPM отправляет на API, всё остальное — на сайт.

---

## Шаг 1. Файлы на VPS

Скопируйте проект на сервер (git clone или `scp -r`). Дальше все команды — из корня проекта.

## Шаг 2. Переменные окружения

```bash
cp .env.prod.example .env
nano .env
```

Заполните:
- `PUBLIC_DOMAIN=videoner.sarsembai.dev`
- `NPM_NETWORK=proxy-network` (имя внешней сети вашего NPM; проверить: `docker network ls`)
- `BOT_TOKEN`, `TELEGRAM_API_ID`, `TELEGRAM_API_HASH` — те же, что использовали локально
- `API_KEY` — общий секрет для server/web/bot. Сгенерировать:
  ```bash
  echo "dk_$(openssl rand -hex 32)"
  ```

> ⚠️ Если копировали всю папку целиком, перезапишите `.env` из примера — в dev-`.env`
> нет нужных прод-переменных.

## Шаг 3. Заглушка для cookies

Файл монтируется как том, поэтому должен существовать (пустой = анонимный режим):

```bash
touch server/cookies.txt
```

Позже, для приватных/возрастных видео Instagram/Facebook, положите сюда настоящий
`cookies.txt` (см. README, раздел «Cookies») и перезапустите `server`.

## Шаг 4. Остановите локального бота

Один и тот же токен нельзя опрашивать из двух мест — будет ошибка `409 Conflict`.
Выключите бота на своём ПК (и dev-контейнер `telegram-bot-api`, если он там же), прежде чем
запускать прод.

## Шаг 5. Сборка и запуск

```bash
docker compose -f docker-compose.prod.yml --env-file .env up -d --build
```

Первая сборка займёт несколько минут (образ сервера тянет ffmpeg и yt-dlp).
Логи: `docker compose -f docker-compose.prod.yml logs -f server bot`.

Сервер на старте сам применит миграции и создаст админа + API-ключ (идемпотентно).

---

## Шаг 6. Настройка Nginx Proxy Manager

В UI вашего NPM создайте **Proxy Host**:

**Вкладка Details**
- Domain Names: `videoner.sarsembai.dev`
- Scheme: `http`
- Forward Hostname / IP: `videoner-web`
- Forward Port: `3000`
- ✅ Block Common Exploits, ✅ Websockets Support

**Вкладка SSL**
- Request a new SSL Certificate (Let's Encrypt), ✅ Force SSL, ✅ HTTP/2

**Вкладка Custom locations** → Add location:
- Location: `/download`
- Scheme: `http`
- Forward Hostname / IP: `videoner-server`
- Forward Port: `3001`
- Раскройте шестерёнку (Advanced) и вставьте — это нужно, чтобы прогресс-бар
  (Server-Sent Events) шёл в реальном времени, а не буферизовался nginx:
  ```nginx
  proxy_buffering off;
  proxy_cache off;
  proxy_read_timeout 3600s;
  chunked_transfer_encoding off;
  ```

Сохраните. Готово.

> Почему так: сайт и API живут на одном домене. Пути `/download/:id/progress` (прогресс)
> и `/download/:file` (скачивание файла) браузер дёргает напрямую — их и отправляем на API.
> Всё остальное (`/`, `/api/*`, страницы платформ) идёт на сайт, а он уже сам ходит к API
> по внутренней сети с секретным ключом.

---

## Проверка

1. Откройте `https://videoner.sarsembai.dev` — вставьте ссылку, выберите качество.
2. Напишите боту в Telegram — пришлите ссылку на видео.

## Обслуживание

```bash
# Обновить после изменений в коде
git pull
docker compose -f docker-compose.prod.yml --env-file .env up -d --build

# Логи / статус
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f server

# Обновить yt-dlp (когда платформы что-то меняют) — просто пересобрать server:
docker compose -f docker-compose.prod.yml build --no-cache server
docker compose -f docker-compose.prod.yml up -d server
```

- Скачанные файлы лежат в томе `downloads` и автоматически чистятся через 12 часов.
- База — в томе `pgdata`, сессии Bot API — в `botapi_data`; переживают перезапуски.
