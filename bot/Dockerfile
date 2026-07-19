# Telegram-бот (grammY, запуск через tsx)
FROM node:22-bookworm-slim

RUN npm install -g pnpm@11
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install

COPY . .

ENV NODE_ENV=production
CMD ["pnpm", "start"]
