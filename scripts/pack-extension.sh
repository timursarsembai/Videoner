#!/usr/bin/env bash
# Собирает архив браузерного расширения для установки вручную. Версия берётся
# из extension/manifest.json — перед новой раздачей поднимите её там.
#
#   dist/videoner-extension-<версия>.zip — для раздачи из рук в руки (в git не
#     кладём: dist/ в .gitignore).
#   web/public/extension/videoner-extension.zip и web/lib/extension-version.ts —
#     архив на странице videoner.download/extension (сайт собирается из web/,
#     достать архив из dist/ сборка не может, поэтому они в git). После
#     запуска закоммитьте их и задеплойте web.
#
# Внутри архива — папка videoner-extension/: после распаковки её и выбирают в
# «Загрузить распакованное расширение» (см. extension/README.md).
set -euo pipefail
cd "$(dirname "$0")/.."

python3 -I - <<'EOF'
import json, pathlib, shutil, zipfile

src = pathlib.Path("extension")
version = json.loads((src / "manifest.json").read_text(encoding="utf-8"))["version"]
out = pathlib.Path("dist") / f"videoner-extension-{version}.zip"
out.parent.mkdir(exist_ok=True)

files = sorted(p for p in src.rglob("*") if p.is_file() and not p.name.startswith("."))
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
    for path in files:
        zf.write(path, pathlib.Path("videoner-extension") / path.relative_to(src))

site = pathlib.Path("web/public/extension/videoner-extension.zip")
site.parent.mkdir(exist_ok=True)
shutil.copyfile(out, site)
pathlib.Path("web/lib/extension-version.ts").write_text(
    "// Генерируется scripts/pack-extension.sh — руками не править.\n"
    f'export const EXTENSION_VERSION = "{version}";\n',
    encoding="utf-8",
)

print(f"{out}: {len(files)} файлов, {out.stat().st_size // 1024} КБ; копия для сайта — {site}")
EOF
