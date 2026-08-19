#!/usr/bin/env bash
# Общая выгрузка секретов из Infisical. Подключается из deploy.sh (прод) и
# deploy-staging.sh (стейдж) — держать две копии этого кода нельзя, они
# неизбежно разъедутся, и разъедутся молча.
#
# Источник правды для .env / .env.staging — Infisical (проект videoner).
# Файлы на диске это производные копии: правки руками перетрёт следующий
# деплой. Менять значения в UI — https://infisical.sarsembai.com, нужен VPN.
#
# fetch_secrets <окружение> <файл> [минимум_ключей]
#   fetch_secrets prod    .env
#   fetch_secrets staging .env.staging
#
# Не падает, если Infisical недоступен: печатает предупреждение и оставляет
# файл, который лежит на диске. Доступность деплоя важнее свежести секретов —
# на диске в этот момент лежит последняя удачная выгрузка, а не мусор.

fetch_secrets() {
  local env_slug="$1"
  local target="$2"
  # Порог нужен ТОЛЬКО когда файла на диске ещё нет: сравнивать не с чем, а
  # писать пустышку нельзя. Когда файл есть, полнота ответа проверяется куда
  # надёжнее — по именам ключей, см. ниже.
  local min_keys="${3:-15}"

  # Полный путь к бинарю, а не просто `infisical`: CLI поставлен без sudo в
  # ~/.local/bin, и при запуске не из интерактивного шелла (cron, systemd)
  # этого каталога в PATH не будет.
  local bin="${INFISICAL_BIN:-$HOME/.local/bin/infisical}"
  local conf="${INFISICAL_CONF:-$HOME/.config/infisical/machine.env}"

  if [ ! -x "$bin" ] || [ ! -f "$conf" ]; then
    echo "!! Infisical CLI или $conf не найдены — деплою на том $target, что лежит на диске" >&2
    return 0
  fi

  local tmp
  tmp=$(mktemp)

  # Учётные данные машинной идентичности читаются и экспортируются ТОЛЬКО
  # внутри этой подоболочки, и по двум причинам.
  #
  # Первая: их нельзя отдавать в argv. Флаги --client-id/--client-secret видны
  # в `ps aux` и /proc/<pid>/cmdline любому пользователю хоста на всё время
  # вызова, а этот секрет открывает вообще все прод-секреты проекта. CLI умеет
  # брать их из окружения (INFISICAL_UNIVERSAL_AUTH_CLIENT_ID/_SECRET) —
  # проверено, логин проходит вообще без флагов.
  #
  # Вторая: без подоболочки `set -a; . "$conf"` экспортировал бы эти же учётки
  # во ВЕСЬ оставшийся деплой — в docker compose build, в собираемые образы, в
  # каждый дочерний процесс, — и никогда их не снимал. Здесь они умирают вместе
  # с подоболочкой.
  #
  # Заодно сюда же уезжает и риск битого machine.env: раньше синтаксическая
  # ошибка в нём роняла весь деплой на строке с `.`, хотя в шапке обещан мягкий
  # фолбэк. Теперь падает только подоболочка, а мы уходим в ветку «не отдал
  # секреты» и деплоим на файле с диска.
  if (
    set -a
    # shellcheck disable=SC1090
    . "$conf" || exit 1
    set +a
    export INFISICAL_UNIVERSAL_AUTH_CLIENT_ID="${INFISICAL_CLIENT_ID:-}"
    export INFISICAL_UNIVERSAL_AUTH_CLIENT_SECRET="${INFISICAL_CLIENT_SECRET:-}"

    token=$("$bin" login --method=universal-auth \
      --domain="$INFISICAL_API_URL" --silent --plain 2>/dev/null) || exit 1
    INFISICAL_TOKEN="$token" "$bin" export --env="$env_slug" \
      --projectId="$INFISICAL_PROJECT_ID" --domain="$INFISICAL_API_URL" \
      --format=dotenv --silent > "$tmp" 2>/dev/null || exit 1
  ) && _secrets_response_is_complete "$tmp" "$target" "$min_keys"; then
    _secrets_install "$tmp" "$target" "$env_slug"
  else
    rm -f "$tmp"
    echo "!! Infisical не отдал секреты ($env_slug) — деплою на том $target, что лежит на диске" >&2
  fi
}

# Защита от полупустого ответа: оборванный запрос отдаёт синтаксически валидный,
# но неполный файл; compose подставляет пустые значения и передеплоивает всё
# сломанным, не выдав ни одной ошибки.
#
# Раньше здесь стоял порог «не меньше 15 ключей» — он не ловил ровно тот случай,
# ради которого написан: в .env 18 ключей, в .env.staging 16, так что ответ,
# потерявший 3 прод-ключа, порог проходил. Поэтому сверяем ИМЕНА: в ответе
# должен быть каждый ключ, который есть в текущем файле.
#
# Ключ, удалённый в Infisical намеренно, сюда тоже упрётся — это осознанно.
# Дешевле один раз запустить деплой с SECRETS_ALLOW_REMOVED=1 (или убрать
# строку из локального файла), чем однажды не заметить молча похудевший .env.
_secrets_response_is_complete() {
  local tmp="$1" target="$2" min_keys="$3"

  if [ ! -f "$target" ]; then
    # Файла нет — сверять не с чем, работает только абсолютный порог.
    [ "$(grep -cE '^[A-Z_0-9]+=' "$tmp")" -ge "$min_keys" ]
    return
  fi

  local missing="" key
  while IFS= read -r key; do
    [ -n "$key" ] || continue
    grep -qE "^${key}=" "$tmp" || missing="$missing $key"
  done <<< "$(grep -oE '^[A-Z_0-9]+' "$target" | sort -u)"

  if [ -n "$missing" ]; then
    if [ "${SECRETS_ALLOW_REMOVED:-}" = "1" ]; then
      echo "!! В ответе Infisical нет ключей:${missing} — принимаю, потому что задан SECRETS_ALLOW_REMOVED=1" >&2
      return 0
    fi
    echo "!! В ответе Infisical нет ключей, которые есть в $target:${missing}" >&2
    echo "   Если они удалены намеренно — повтори деплой с SECRETS_ALLOW_REMOVED=1." >&2
    return 1
  fi

  return 0
}

# Установка нового файла. Каждый шаг проверяется отдельно: `cmd && chmod` под
# `set -e` НЕ прерывает скрипт при неудаче первой команды, и прежняя версия
# успевала напечатать «секреты обновлены, прежний файл сохранён» даже когда
# ничего не переместилось, а временный файл утекал в /tmp.
_secrets_install() {
  local tmp="$1" target="$2" env_slug="$3"
  local backed_up=""

  if [ -f "$target" ]; then
    if cp "$target" "$target.bak"; then
      chmod 600 "$target.bak"
      backed_up=", прежний $target сохранён как $target.bak"
    else
      echo "!! Не смог сохранить $target.bak — не трогаю $target, деплою на том, что лежит на диске" >&2
      rm -f "$tmp"
      return 0
    fi
  fi

  if ! mv "$tmp" "$target"; then
    echo "!! Не смог записать $target — деплою на том, что лежит на диске" >&2
    rm -f "$tmp"
    return 0
  fi
  chmod 600 "$target"

  echo "==> Секреты ($env_slug) обновлены из Infisical ($(grep -cE '^[A-Z_0-9]+=' "$target") шт.)${backed_up}"
}
