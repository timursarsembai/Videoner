#!/usr/bin/env bash
# Пересобирает и передеплоивает сервисы стейдж-контура. Стейдж-близнец
# scripts/deploy.sh — те же принципы, отличия только в трёх местах:
# project name, файл compose и файл секретов.
#
# Запуск:  ./scripts/deploy-staging.sh web        (или server, или оба)
# Имена можно писать и полностью: web-staging / server-staging.
#
# Кэш сборки чистится по тому же порогу, что и в проде (scripts/lib-buildcache.sh).
# Раньше здесь стояло «чистит deploy.sh, второму чистильщику незачем» — но это
# верно, только пока прод деплоят не реже стейджа. Обычный рабочий цикл обратный:
# десяток выкатов на staging и один в прод, — и общий кэш растёт без всякого
# ограничения. Ровно так он и дорос до 36 ГБ 23.07.2026.
set -euo pipefail

# Путь к каталогу скриптов запоминаем ДО cd — иначе `. $(dirname $0)/lib-...`
# ниже не найдёт файл при запуске изнутри самого scripts/ (там dirname
# даёт ".", а мы к тому моменту уже поднялись на уровень выше).
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."

if [ $# -eq 0 ]; then
  echo "Usage: $0 <service> [service...]   (e.g. $0 web  или  $0 server web)" >&2
  exit 1
fi

# Принимаем и короткие имена (web), и полные (web-staging) — в compose сервисы
# называются с суффиксом, но набирать его каждый раз незачем.
services=()
for s in "$@"; do
  case "$s" in
    *-staging) services+=("$s") ;;
    *)         services+=("${s}-staging") ;;
  esac
done

# Общие куски вынесены в scripts/lib-*.sh. Проверяем существование явно: под
# `set -euo pipefail` отсутствующий файл роняет деплой невнятным «No such file»
# ещё до первой сборки.
for lib in lib-buildcache lib-secrets; do
  if [ ! -f "$SCRIPT_DIR/$lib.sh" ]; then
    echo "!! Не найден $SCRIPT_DIR/$lib.sh — он нужен deploy-staging.sh; проверь, что файл не потерялся при git pull" >&2
    exit 1
  fi
  . "$SCRIPT_DIR/$lib.sh"
done

maybe_prune_build_cache

# Секреты подтягиваются из Infisical (проект videoner, окружение staging).
# Подробности и поведение при недоступности — в scripts/lib-secrets.sh.
fetch_secrets staging .env.staging

# -p videoner-staging обязателен: без явного имени проекта compose берёт имя
# папки ("videoner") — то же, что у прод-стека, который запускается отсюда же.
# Ровно так однажды остановили прод-БД, перепутав контуры (см. шапку
# docker-compose.staging.yml).
COMPOSE="docker compose -p videoner-staging -f docker-compose.staging.yml --env-file .env.staging"

echo "==> Собираю: ${services[*]}"
$COMPOSE build "${services[@]}"

echo "==> Передеплоиваю: ${services[*]}"
$COMPOSE rm -sf "${services[@]}"
$COMPOSE up -d "${services[@]}"

for service in "${services[@]}"; do
  container="videoner-$service"
  echo "==> Проверяю $container..."

  case "$service" in
    web-staging)
      # Тот же смоук, что в проде: NEXT_PUBLIC_* вшиваются в бандл на СБОРКЕ,
      # и потерянный build-arg даёт рабочий на вид образ с молча отключённой
      # фичей. Стейдж для того и существует, чтобы ловить это до прода —
      # значит и проверка тут нужна та же.
      sleep 3
      used_vars=$(grep -ohr 'NEXT_PUBLIC_[A-Z0-9_]\+' web --include=*.tsx --include=*.ts --exclude-dir=node_modules --exclude-dir=.next 2>/dev/null | sort -u)
      missing=0
      checked=0
      for var in $used_vars; do
        if ! grep -q "${var}:" docker-compose.staging.yml; then
          echo "    ✗ ${var} используется в коде web/, но не передаётся как build-arg (docker-compose.staging.yml -> web-staging.build.args)"
          missing=1
          continue
        fi
        # "|| true" обязателен: при set -euo pipefail неудачный grep иначе
        # роняет весь скрипт прямо на присваивании (инцидент 05.08.2026).
        value="${!var:-$(grep -m1 "^${var}=" .env.staging 2>/dev/null | cut -d= -f2 || true)}"
        if [ -z "$value" ]; then
          continue
        fi
        checked=$((checked + 1))
        if ! docker exec "$container" sh -c "grep -rlF -- '$value' .next/static" >/dev/null 2>&1; then
          echo "    ✗ ${var} не найден в собранном бандле — соответствующая фича будет молча отключена"
          missing=1
        fi
      done
      if [ "$missing" -eq 1 ]; then
        echo "    Собранный образ не содержит нужные build-args. См. docker-compose.staging.yml -> web-staging.build.args и .env.staging." >&2
        exit 1
      fi
      echo "    ✓ NEXT_PUBLIC_* в порядке (проверено значений в бандле: ${checked})"
      ;;
    server-staging)
      # 45с, как в проде: в короткий таймаут не укладывается старт с новой
      # миграцией Prisma, а ложное «деплой не прошёл» опаснее лишнего ожидания.
      started=0
      for _ in $(seq 1 45); do
        if docker logs "$container" --tail 30 2>&1 | grep -q "Nest application successfully started"; then
          started=1
          break
        fi
        sleep 1
      done
      if [ "$started" -eq 0 ]; then
        echo "    ✗ Не нашёл 'Nest application successfully started' в логах за 45с — проверь docker logs $container" >&2
        exit 1
      fi
      echo "    ✓ Nest стартовал"
      ;;
    *)
      echo "    (нет специфичной проверки для $service)"
      ;;
  esac
done

echo "==> Готово: ${services[*]} задеплоены и прошли базовую проверку"
