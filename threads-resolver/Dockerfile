# Резервный резолвер Threads: Chromium + Playwright.
#
# Берём обычный node-образ и доставляем браузер через `playwright install`, а не
# готовый образ mcr.microsoft.com/playwright: тот весит около двух гигабайт и
# тянет ещё Firefox с WebKit, которые здесь не нужны. Версия браузера при таком
# способе всегда совпадает с версией playwright из package.json — рассинхрона,
# из-за которого Playwright отказывается стартовать, не будет.
FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json ./
# --with-deps ставит системные библиотеки Chromium (шрифты, nss, libdrm и прочее).
RUN npm install --omit=dev \
  && npx playwright install --with-deps chromium \
  && rm -rf /var/lib/apt/lists/*

COPY server.js ./

EXPOSE 4417

# Chromium поднимается лениво, поэтому проверяем сам HTTP-слой: контейнер здоров,
# когда отвечает, а не когда браузер запущен.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:4417/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
