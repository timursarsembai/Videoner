#!/usr/bin/env bash
# Пересобирает и передеплоивает один или несколько сервисов прод-compose.
#
# Зачем этот скрипт: `web` берёт NEXT_PUBLIC_* значения (Turnstile site key,
# Telegram bot id/username) как build-args и Next.js вшивает их в клиентский
# бандл на этапе СБОРКИ — не в рантайме. Ручной `docker buildx build ./web`
# без этих --build-arg молча собирает рабочий на вид образ, где виджеты,
# зависящие от этих ключей, просто не рендерятся (без единой ошибки в логах
# или консоли). Инцидент 2026-07-23: так дважды подряд сломали Turnstile и
# кнопку входа через Telegram на мобильном.
#
# Всегда используем `docker-compose build`, а не голый `docker buildx build` —
# compose сам читает build.args из docker-compose.prod.yml + .env, и вручную
# забыть ключ уже нельзя.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ $# -eq 0 ]; then
  echo "Usage: $0 <service> [service...]   (e.g. $0 web  or  $0 server web bot)" >&2
  exit 1
fi

# Кэш docker buildx (драйвер docker-container) живёт в СВОЁМ отдельном volume,
# отдельно от обычного docker image store — docker image prune его не трогает
# вообще. Инцидент 2026-07-23: за один день частых пересборок он вырос до
# ~36 ГБ, диск ушёл с 30 до 68 ГБ занятых. Чистим здесь автоматически, но
# только когда кэш реально большой — а не на каждый деплой, иначе теряется
# смысл кэширования между сборками (следующая сборка станет намного медленнее).
BUILD_CACHE_PRUNE_THRESHOLD_GB="${BUILD_CACHE_PRUNE_THRESHOLD_GB:-20}"

maybe_prune_build_cache() {
  local size_str size_gb
  size_str=$(docker system df --format '{{.Type}}|{{.Size}}' 2>/dev/null | awk -F'|' '$1=="Build Cache"{print $2}')
  size_gb=$(python3 -c "
import re
m = re.match(r'([\d.]+)\s*([KMGT]?B)', '${size_str:-0B}')
val, unit = (float(m.group(1)), m.group(2)) if m else (0.0, 'B')
mult = {'B':1,'KB':1024,'MB':1024**2,'GB':1024**3,'TB':1024**4}[unit]
print(int(val * mult / 1024**3))
" 2>/dev/null || echo 0)

  if [ "${size_gb:-0}" -ge "$BUILD_CACHE_PRUNE_THRESHOLD_GB" ]; then
    echo "==> Кэш сборки (docker buildx) занимает ${size_gb} ГБ (порог ${BUILD_CACHE_PRUNE_THRESHOLD_GB} ГБ) — чищу..."
    docker buildx prune -af >/dev/null 2>&1 || true
    docker builder prune -af >/dev/null 2>&1 || true
    echo "    ✓ Кэш сборки очищен"
  fi
}

maybe_prune_build_cache

COMPOSE="docker-compose -f docker-compose.prod.yml --env-file .env"

echo "==> Собираю: $*"
$COMPOSE build "$@"

echo "==> Передеплоиваю: $*"
$COMPOSE rm -sf "$@"
$COMPOSE up -d "$@"

for service in "$@"; do
  container="videoner-$service"
  echo "==> Проверяю $container..."

  case "$service" in
    web)
      # Смоук-проверка ровно того класса ошибок, из-за которого написан этот
      # скрипт: если build-arg потерялся, эти строки не найдутся ни в одном
      # чанке, и мы узнаём об этом сразу, а не от пользователя через час.
      sleep 3
      site_key="${NEXT_PUBLIC_TURNSTILE_SITE_KEY:-$(grep -m1 '^NEXT_PUBLIC_TURNSTILE_SITE_KEY=' .env | cut -d= -f2)}"
      bot_id="${NEXT_PUBLIC_TELEGRAM_BOT_ID:-$(grep -m1 '^NEXT_PUBLIC_TELEGRAM_BOT_ID=' .env | cut -d= -f2)}"
      missing=0
      if ! docker exec "$container" sh -c "grep -rl -- '$site_key' .next/static/chunks/*.js" >/dev/null 2>&1; then
        echo "    ✗ NEXT_PUBLIC_TURNSTILE_SITE_KEY не найден в собранном бандле — Turnstile будет молча отключён"
        missing=1
      fi
      if ! docker exec "$container" sh -c "grep -rl -- '$bot_id' .next/static/chunks/*.js" >/dev/null 2>&1; then
        echo "    ✗ NEXT_PUBLIC_TELEGRAM_BOT_ID не найден в собранном бандле — кнопка входа будет молча отключена"
        missing=1
      fi
      if [ "$missing" -eq 1 ]; then
        echo "    Собранный образ не содержит нужные build-args. См. docker-compose.prod.yml -> web.build.args и .env." >&2
        exit 1
      fi
      echo "    ✓ NEXT_PUBLIC_* значения присутствуют в бандле"
      ;;
    server)
      sleep 5
      if ! docker logs "$container" --tail 30 2>&1 | grep -q "Nest application successfully started"; then
        echo "    ✗ Не нашёл 'Nest application successfully started' в логах — проверь docker logs $container" >&2
        exit 1
      fi
      echo "    ✓ Nest стартовал"
      ;;
    *)
      echo "    (нет специфичной проверки для $service)"
      ;;
  esac
done

echo "==> Готово: $* задеплоены и прошли базовую проверку"
