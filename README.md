# Videoner — бесплатное скачивание видео

Сайт [videoner.download](https://videoner.download), Telegram-бот [@VideonerBot](https://t.me/VideonerBot)
и расширение для браузера. Скачивает видео, фото и звук с YouTube, TikTok, Instagram, Facebook,
Twitter/X, Vimeo, VK, Rutube, OK.ru, Pinterest и Threads, а расширение — ещё и уроки GetCourse.
Платных функций нет.

Новости проекта — в [блоге](https://videoner.download/ru/blog) и в канале
[@videonerdownload](https://t.me/videonerdownload).

## Что умеет

- **Сайт:** вставить ссылку → выбрать качество (до 4K), только звук (mp3) или субтитры YouTube (.srt);
  посты из нескольких файлов — все файлы сразу. Быстрая ссылка: `videoner.download/<ссылка на видео>`.
- **Бот:** то же в Telegram, файлы до 2 ГБ, прогресс скачивания, очередь ссылок, альбомы,
  инлайн-режим (`@VideonerBot <ссылка>` в любом чате), ссылки «Поделиться».
- **Группы:** бот сам присылает видео по ссылкам в чате; админы настраивают его через `/settings`
  (удалять ссылки, подпись, качество, длинные видео, язык, кто подключает аккаунты).
- **Подключённые аккаунты:** человек может подключить боту свой вход на площадке (кнопкой в
  расширении и `/connect КОД`, или файлом cookies.txt) — тогда бот качает сторис Instagram и закрытые
  записи. Данные входа хранятся зашифрованными, управление — `/accounts`.
- **Расширение** (`extension/`): кнопка «Скачать» на странице видео; Instagram, Facebook, TikTok,
  Threads и сторис качаются прямо в браузере под входом человека; уроки GetCourse; Chrome и
  браузеры на Chromium (архив с сайта) и Firefox (подписанный .xpi). Подробно — `extension/README.md`.
- **Языки:** русский, украинский, казахский, английский (сайт — ещё испанский). Язык выбирается
  автоматически и вручную: `/language` в боте, переключатель на сайте и в окошке расширения.
- **Блог** (`web/content/blog/<статья>/<язык>.md`): статьи на сайте `/blog`; бот публикует новые
  статьи в канал новостей (`bot/src/blog-channel.ts`).

## Состав

| Папка / сервис | Что это |
|---|---|
| `server/` | API: NestJS + Prisma (PostgreSQL) + yt-dlp/ffmpeg, порт 3001 |
| `web/` | Сайт и дашборд: Next.js, порт 3000 |
| `bot/` | Telegram-бот: grammY |
| `extension/` | Расширение для браузера (Manifest V3; сборка — `scripts/pack-extension.sh`) |
| `threads-resolver/` | Сервис получения медиа из Threads |
| `bgutil-provider` | Контейнер для антибот-проверки YouTube (PO-токены) |
| `telegram-bot-api` | Локальный Telegram Bot API: файлы до 2 ГБ |

Изначально проект основан на
[social-media-video-downloader-api](https://github.com/fabwaseem/social-media-video-downloader-api)
и [Social-Media-Video-Downloader](https://github.com/fabwaseem/Social-Media-Video-Downloader).

## Локальный запуск

```bash
# 1. База и локальный Bot API
docker compose up -d postgres

# 2. API
cd server && pnpm install
npx ts-node prisma/seed.ts   # выведет API-ключ (создаётся один раз)
pnpm run dev                 # http://localhost:3001, Swagger: /api

# 3. Сайт
cd ../web && pnpm install && pnpm dev     # http://localhost:3000

# 4. Бот (BOT_TOKEN и API_KEY — в bot/.env)
cd ../bot && pnpm install && pnpm dev
```

Тесты: `bot` — `pnpm exec tsx --test src/*.test.ts`, `server` — `pnpm exec jest src/lib`.

## Выкат

Прод — Docker Compose (`docker-compose.prod.yml`) за Nginx Proxy Manager, секреты — вне репозитория.
Выкат: `./scripts/deploy.sh server bot web` (любой набор сервисов). Подробно — `DEPLOY.md`.

## Telegram-бот: файлы до 2 ГБ

По умолчанию бот работает через облачный `api.telegram.org` — лимит **50 МБ** на отправку файла
(файлы больше бот отдаёт ссылкой). Чтобы поднять лимит до **2 ГБ**:

1. Получите `api_id` и `api_hash` на https://my.telegram.org → «API development tools».
2. Впишите их в корневой `.env` (`TELEGRAM_API_ID`, `TELEGRAM_API_HASH`).
3. `docker compose up -d telegram-bot-api`
4. В `bot/.env` раскомментируйте `BOT_API_ROOT=http://localhost:8081` и перезапустите бота.

Если бот раньше работал через облако, перед переключением вызовите один раз:
`https://api.telegram.org/bot<TOKEN>/logOut` (иначе локальный сервер не примет токен).

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
