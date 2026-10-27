#!/usr/bin/env bash
# Собирает архив браузерного расширения для установки вручную:
# dist/videoner-extension-<версия>.zip. Версия берётся из
# extension/manifest.json — перед новой раздачей поднимите её там.
#
# Внутри архива — папка videoner-extension/: после распаковки её и выбирают в
# «Загрузить распакованное расширение» (см. extension/README.md).
# Архив в git не кладём (dist/ в .gitignore): он устаревал бы с каждой правкой.
set -euo pipefail
cd "$(dirname "$0")/.."

python3 -I - <<'EOF'
import json, pathlib, zipfile

src = pathlib.Path("extension")
version = json.loads((src / "manifest.json").read_text(encoding="utf-8"))["version"]
out = pathlib.Path("dist") / f"videoner-extension-{version}.zip"
out.parent.mkdir(exist_ok=True)

files = sorted(p for p in src.rglob("*") if p.is_file() and not p.name.startswith("."))
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
    for path in files:
        zf.write(path, pathlib.Path("videoner-extension") / path.relative_to(src))

print(f"{out}: {len(files)} файлов, {out.stat().st_size // 1024} КБ")
EOF
