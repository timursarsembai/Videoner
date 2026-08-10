# Backend API: NestJS + yt-dlp + ffmpeg (Linux)
FROM node:22-bookworm-slim

# ffmpeg ставим системно (yt-dlp подхватит его как `ffmpeg` из PATH),
# curl/ca-certificates нужны для загрузки yt-dlp.
RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm@11

WORKDIR /app

# yt-dlp: используем ассет yt-dlp_linux — это self-contained сборка (PyInstaller,
# Python внутри), поэтому системный python3 в образе не нужен. Обычный ассет `yt-dlp` —
# это Python-zipapp с shebang `#!/usr/bin/env python3` и без Python он не запускается.
# Кладём в /app/bin — приложение ищет его именно там и не пытается качать сам.
# Рядом yt-dlp.conf включает JS-рантайм node (свежему yt-dlp он нужен для YouTube; node уже в образе).
RUN mkdir -p /app/bin \
  && curl -fsSL -o /app/bin/yt-dlp https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux \
  && chmod +x /app/bin/yt-dlp \
  && printf '%s\n' '--js-runtimes node' > /app/bin/yt-dlp.conf

# PO-token провайдер (обход "Sign in to confirm you're not a bot" на IP дата-центров):
# плагин bgutil ходит за токенами в соседний контейнер bgutil-provider (см. docker-compose).
# Версию плагина фиксируем в синхроне с образом провайдера.
ARG BGUTIL_VERSION=1.3.1
RUN mkdir -p /etc/yt-dlp/plugins \
  && curl -fsSL -o /etc/yt-dlp/plugins/bgutil-ytdlp-pot-provider.zip \
     https://github.com/Brainicism/bgutil-ytdlp-pot-provider/releases/download/${BGUTIL_VERSION}/bgutil-ytdlp-pot-provider.zip \
  && printf '%s\n' '--extractor-args "youtubepot-bgutilhttp:base_url=http://bgutil-provider:4416"' >> /app/bin/yt-dlp.conf

# Клиенты плеера YouTube. Дефолтная связка (tv/web_safari) с начала 08.2026 на
# нашей связке "ISP-прокси + куки" получает пустой player response, и yt-dlp
# отдаёт "The page needs to be reloaded" — падало БОЛЬШИНСТВО роликов, не только
# отдельные (проверено 05.08.2026 на четырёх видео: три из четырёх не качались).
# web_embedded добавлен запасным: default остаётся первым, поэтому там, где он
# работает, поведение не меняется. mweb сюда НЕ годится, хотя метаданные отдаёт:
# сами потоки при нём отвечают 403 Forbidden — то есть /info чинился бы, а
# скачивание нет. Аргумент скоупится префиксом youtube: и на другие площадки не
# влияет; с соседней строкой bgutil не конфликтует — оба применяются (проверено).
RUN printf '%s\n' '--extractor-args "youtube:player_client=default,web_embedded"' >> /app/bin/yt-dlp.conf

# Зависимости. --ignore-scripts, чтобы на этапе сборки не запускался prepare
# (он делает prisma migrate deploy, а БД тут ещё недоступна).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --ignore-scripts

# Генерируем Prisma Client (нужен и для сборки, и для рантайма)
COPY prisma ./prisma
RUN npx prisma generate

# Исходники и сборка. bin/, node_modules, dist и т.п. исключены через .dockerignore,
# поэтому наш /app/bin с linux-бинарником yt-dlp не перезатрётся Windows-версией из репозитория.
COPY . .
RUN pnpm run build

# Свой экстрактор Threads: в yt-dlp его нет и не предвидится (заявки с 2023
# года), а generic получает пустой JS-шелл. Плагином, а не правкой сервиса
# скачивания — тогда Threads едет по общему конвейеру наравне с остальными
# площадками, включая прогресс, ретраи и выбор формата.
# Кладём рядом с bgutil: каталог /etc/yt-dlp/plugins уже в списке поиска
# (ключ --plugin-dirs в PyInstaller-сборке НЕ работает — проверено).
COPY ytdlp-plugins/threads /etc/yt-dlp/plugins/threads

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Рантайм — не от root. Базовый образ node:*-bookworm-slim уже содержит
# юзера `node` (uid/gid 1000), который совпадает с хостовым aksak (тоже 1000) —
# поэтому смонтированный cookies.txt (владелец aksak) читается/пишется без
# доп. chown. Именованный volume downloads/ перевладён на 1000:1000 отдельно
# при переходе на этот Dockerfile (см. память security-audit). /app остаётся
# root:root (chown -R по node_modules добавлял ~6 мин к сборке) — yt-dlp/ffmpeg
# запускаются с явным cwd=/tmp (см. ytdlp.service.ts), там писать можно без chown.
USER node

EXPOSE 3001
ENTRYPOINT ["docker-entrypoint.sh"]
