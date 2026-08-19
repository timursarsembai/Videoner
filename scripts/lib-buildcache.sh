#!/usr/bin/env bash
# Чистка кэша docker buildx. Отдельный файл, потому что нужен ОБОИМ деплоям —
# прод и стейдж собирают образы одним и тем же buildx, и кэш у них общий, один
# на всю машину.
#
# Кэш buildx (драйвер docker-container) живёт в СВОЁМ отдельном volume, отдельно
# от обычного image store: `docker image prune` его не трогает вообще. Инцидент
# 2026-07-23: за день частых пересборок он вырос до ~36 ГБ, диск ушёл с 30 до 68
# ГБ занятых. Чистим только когда кэш реально большой — иначе теряется смысл
# кэширования между сборками.

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
