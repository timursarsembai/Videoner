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

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3001
ENTRYPOINT ["docker-entrypoint.sh"]
