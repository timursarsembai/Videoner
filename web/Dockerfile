# Frontend: Next.js 15 (сборка + запуск)
FROM node:22-bookworm-slim AS build

RUN npm install -g pnpm@11
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

COPY . .

# NEXT_PUBLIC_* инлайнятся в клиентский бандл на этапе сборки, поэтому передаём их как build-args.
# NEXT_PUBLIC_API_URL должен быть ПУБЛИЧНЫМ адресом API (браузер напрямую слушает прогресс
# и качает файл по /download/*).
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_TELEGRAM_BOT_USERNAME
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=$NEXT_PUBLIC_TELEGRAM_BOT_USERNAME

RUN pnpm build

# --- runtime ---
FROM node:22-bookworm-slim
RUN npm install -g pnpm@11
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
EXPOSE 3000
CMD ["pnpm", "start"]
