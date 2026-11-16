FROM node:22-bookworm-slim
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright MODEL_CACHE_DIR=/models
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
  && npx playwright install --with-deps chromium \
  && apt-get update && apt-get install -y --no-install-recommends xvfb ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY vision.mjs tile-model.mjs selection.mjs ./
# Models are pinned and fetched at build time, without proxy credentials.
# Runtime never downloads models or browser executables.
RUN --mount=type=cache,target=/model-download-cache \
  MODEL_CACHE_DIR=/model-download-cache node vision.mjs \
  && mkdir -p /models && cp -a /model-download-cache/. /models/
COPY *.mjs ./
COPY README.md THIRD_PARTY.md ./
ENV MODEL_OFFLINE=1 NODE_ENV=production PORT=4418 DISPLAY=:99
USER node
EXPOSE 4418
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:4418/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"
CMD ["node", "server.mjs"]
