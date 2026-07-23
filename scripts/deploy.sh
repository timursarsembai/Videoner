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
      # Список переменных генерируется из самого кода, а не хардкодится (было
      # только 2 конкретных ключа) — любая НОВАЯ NEXT_PUBLIC_* переменная,
      # которую кто-то заведёт в будущем, защищена автоматически, без правки
      # этого скрипта.
      sleep 3
      used_vars=$(grep -ohr 'NEXT_PUBLIC_[A-Z0-9_]\+' web --include=*.tsx --include=*.ts --exclude-dir=node_modules --exclude-dir=.next 2>/dev/null | sort -u)
      missing=0
      checked=0
      for var in $used_vars; do
        # (1) переменная вообще должна быть проброшена как build-arg —
        # иначе она НИКОГДА не попадёт в бандл, вне зависимости от .env.
        if ! grep -q "${var}:" docker-compose.prod.yml; then
          echo "    ✗ ${var} используется в коде web/, но не передаётся как build-arg (docker-compose.prod.yml -> web.build.args)"
          missing=1
          continue
        fi
        # (2) само значение — из окружения текущего шелла (уже могло быть
        # экспортировано вызывающим) либо из .env. Для переменных вроде
        # NEXT_PUBLIC_APP_URL, которые в compose собираются интерполяцией
        # (${PUBLIC_DOMAIN}), а не лежат в .env под тем же именем, значение
        # тут не найдётся — молча пропускаем именно бандл-проверку для них
        # (сама by-arg проверка выше их уже покрывает), а не падаем вслепую.
        value="${!var:-$(grep -m1 "^${var}=" .env 2>/dev/null | cut -d= -f2)}"
        if [ -z "$value" ]; then
          continue
        fi
        checked=$((checked + 1))
        if ! docker exec "$container" sh -c "grep -rl -- '$value' .next/static/chunks/*.js" >/dev/null 2>&1; then
          echo "    ✗ ${var} не найден в собранном бандле — соответствующая фича будет молча отключена"
          missing=1
        fi
      done
      if [ "$missing" -eq 1 ]; then
        echo "    Собранный образ не содержит нужные build-args. См. docker-compose.prod.yml -> web.build.args и .env." >&2
        exit 1
      fi
      echo "    ✓ NEXT_PUBLIC_* в порядке (проверено значений в бандле: ${checked})"
      ;;
    server)
      # Retry вместо фиксированного sleep 5 — старт (миграции + seed + сам
      # Nest bootstrap) не всегда укладывается в 5с, и скрипт трижды за одну
      # сессию репортил ложный ✗ по контейнеру, который на самом деле через
      # секунду-другую стартовал нормально.
      started=0
      for _ in $(seq 1 15); do
        if docker logs "$container" --tail 30 2>&1 | grep -q "Nest application successfully started"; then
          started=1
          break
        fi
        sleep 1
      done
      if [ "$started" -eq 0 ]; then
        echo "    ✗ Не нашёл 'Nest application successfully started' в логах за 15с — проверь docker logs $container" >&2
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
