# Video Downloader — веб + Telegram-бот

Скачивание видео с YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, Rutube, OK.ru.
Основано на [social-media-video-downloader-api](https://github.com/fabwaseem/social-media-video-downloader-api) (NestJS + yt-dlp).

## Состав

| Папка | Что это | Порт |
|---|---|---|
| `server/` | Backend API (NestJS + Prisma + yt-dlp) | 3001 |
| `web/` | Веб-интерфейс (Next.js, [клон официального фронтенда](https://github.com/fabwaseem/Social-Media-Video-Downloader)) | 3000 |
| `bot/` | Telegram-бот (grammY) | — |
| `docker-compose.yml` | PostgreSQL (порт 5434) + локальный Telegram Bot API сервер (порт 8081) | |

## Запуск

```powershell
# 1. База данных
docker compose up -d postgres

# 2. Backend API
cd server
pnpm install
npx ts-node prisma/seed.ts   # выведет API-ключ (создаётся один раз)
pnpm run dev                 # http://localhost:3001, Swagger: /api

# 3. Веб
cd ../web
pnpm install
pnpm dev                     # http://localhost:3000

# 4. Бот (сначала впишите BOT_TOKEN в bot/.env)
cd ../bot
pnpm install
pnpm dev
```

API-ключ уже прописан в `web/.env.local` и `bot/.env`.

## Telegram-бот: файлы до 2 ГБ

По умолчанию бот работает через облачный `api.telegram.org` — лимит **50 МБ** на отправку файла
(файлы больше бот отдаёт ссылкой). Чтобы поднять лимит до **2 ГБ**:

1. Получите `api_id` и `api_hash` на https://my.telegram.org → «API development tools».
2. Впишите их в корневой `.env` (`TELEGRAM_API_ID`, `TELEGRAM_API_HASH`).
3. `docker compose up -d telegram-bot-api`
4. В `bot/.env` раскомментируйте `BOT_API_ROOT=http://localhost:8081` и перезапустите бота.

Если бот раньше работал через облако, перед переключением вызовите один раз:
`https://api.telegram.org/bot<TOKEN>/logOut` (иначе локальный сервер не примет токен).

## Отличия от оригинального репозитория

- `server/bin/` — бинарники ставятся вручную: официальная ссылка автозагрузки ffmpeg в коде умерла (404).
  Здесь лежат `yt-dlp.exe`, `ffmpeg.exe`, `ffprobe.exe` (сборка BtbN) и `yt-dlp.conf`.
- `server/bin/yt-dlp.conf` — включает `--js-runtimes node`: свежий yt-dlp требует JS-рантайм
  для YouTube, deno не установлен, используется Node.
- `server/src/modules/ytdlp/ytdlp.service.ts` — предупреждения yt-dlp в stderr больше не прерывают
  загрузку (фатальны только строки с `ERROR`); флаг `--cookies` теперь добавляется к команде,
  если файл `server/cookies/cookies.txt` существует (в оригинале — только при `NODE_ENV=production`).
- `server/prisma/seed.ts` — создание первого админа и API-ключа (в оригинале первый ключ
  создать невозможно: админ-роуты сами требуют админ-ключ).

## Известные нюансы

### Cookies

Куки лежат в `server/cookies/`, **по одному файлу на площадку**, имя файла — слаг платформы
из `getPlatform()` (`src/validate/url.ts`):

```
server/cookies/
├── youtube.txt      ← сюда же кладутся куки google.com: они часть сессии YouTube
├── tiktok.txt
├── vimeo.txt
├── okru.txt, rutube.txt, vk.txt, twitter.txt, pinterest.txt, facebook.txt
└── cookies.txt      ← общий запасной: используется, только если нет файла площадки
```

Разбивка по файлам сделана намеренно: переэкспорт одной площадки не задевает остальные,
а отключить куки площадки можно просто удалив её файл. Пустой файл (0 байт) считается
отсутствующим — площадка работает анонимно.

Как обновить куки площадки:

1. Установите расширение для экспорта куки в формате Netscape, например
   [Get cookies.txt LOCALLY](https://chromewebstore.google.com/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc)
   (Chrome) — работает с вашим уже залогиненным браузером, ничего никуда не отправляет.
2. Зайдите в нужный сервис в обычном браузере (если ещё не залогинены).
3. Экспортируйте куки и сохраните как `server/cookies/<платформа>.txt`.
4. Перезапускать сервер не обязательно — файл читается при каждом вызове yt-dlp.

**Каким площадкам куки реально нужны.** YouTube — обязательно: он блокирует IP дата-центров
и без авторизации отвечает «Sign in to confirm you're not a bot» даже на публичные ролики.
Instagram публичные рилсы и посты отдаёт анонимно, куки нужны только для закрытых аккаунтов;
более того, куки заблокированного аккаунта ломают даже публичные загрузки (Instagram отвечает
`checkpoint_required`), поэтому по умолчанию файла `instagram.txt` нет.

**Чтобы экспорт YouTube прожил дольше:** после экспорта не пользуйтесь той же сессией в браузере —
Google ротирует токены, и выгруженная копия становится недействительной. Разумно завести под это
отдельный аккаунт: доступ с IP дата-центра Google считает подозрительным и рано или поздно
разлогинивает.

Каталог `server/cookies/` добавлен в `.gitignore` — не коммитьте его.

### Прочее

- Скачанные файлы живут в `server/dist/downloads/` и автоматически удаляются через 1 час.
- Лимит длительности видео на ключ — 2 часа (задан в seed), меняется в БД (`ApiKey.maxDuration`).
