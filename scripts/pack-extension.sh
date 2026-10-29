#!/usr/bin/env bash
# Собирает браузерное расширение в двух вариантах из одной папки extension/.
# Версия берётся из extension/manifest.json — перед новой раздачей поднимите
# её там.
#
# Chrome (и Яндекс Браузер, Edge, Opera):
#   dist/videoner-extension-<версия>.zip — для раздачи из рук в руки (в git не
#     кладём: dist/ в .gitignore).
#   web/public/extension/videoner-extension.zip и web/lib/extension-version.ts —
#     архив на странице videoner.download/extension (сайт собирается из web/,
#     достать архив из dist/ сборка не может, поэтому они в git). После
#     запуска закоммитьте их и задеплойте web.
#   Внутри архива — папка videoner-extension/: после распаковки её и выбирают
#   в «Загрузить распакованное расширение» (см. extension/README.md).
#
# Firefox:
#   dist/firefox/ — распакованное расширение: его ставят для проверки
#     (about:debugging → «Загрузить временное дополнение») и подписывают у
#     Mozilla. Подписанный .xpi кладётся на сайт отдельно.
#   dist/videoner-firefox-<версия>.zip — то же одним архивом.
#   dist/firefox-amo/ — вариант для каталога addons.mozilla.org: тот же, но
#     без update_url (обновления каталожной версии раздаёт сама Mozilla, а
#     каталог такой адрес не принимает). Отправка — extension/README.md.
#   Отличия от Chrome — только в manifest (FIREFOX_MANIFEST ниже) и в
#   наборе файлов: фоновая часть — страница background.html, а не service
#   worker, и скрытая страница gc-offscreen.* не нужна (см. background.js).
set -euo pipefail
cd "$(dirname "$0")/.."

python3 -I - <<'EOF'
import json, pathlib, shutil, zipfile

src = pathlib.Path("extension")
manifest = json.loads((src / "manifest.json").read_text(encoding="utf-8"))
version = manifest["version"]
dist = pathlib.Path("dist")
dist.mkdir(exist_ok=True)

files = sorted(p for p in src.rglob("*") if p.is_file() and not p.name.startswith("."))

# Файлы только одного из браузеров.
CHROME_ONLY = {"gc-offscreen.html", "gc-offscreen.js"}
FIREFOX_ONLY = {"background.html"}


def pack(out, members, root, manifest_text):
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
        for path in members:
            rel = path.relative_to(src)
            if rel.as_posix() == "manifest.json":
                zf.writestr(str(pathlib.Path(root) / rel) if root else "manifest.json", manifest_text)
            else:
                zf.write(path, pathlib.Path(root) / rel if root else rel)


# ---- Chrome ----
chrome_files = [p for p in files if p.relative_to(src).as_posix() not in FIREFOX_ONLY]
chrome_zip = dist / f"videoner-extension-{version}.zip"
pack(chrome_zip, chrome_files, "videoner-extension", (src / "manifest.json").read_text(encoding="utf-8"))

site = pathlib.Path("web/public/extension/videoner-extension.zip")
site.parent.mkdir(exist_ok=True)
shutil.copyfile(chrome_zip, site)
pathlib.Path("web/lib/extension-version.ts").write_text(
    "// Генерируется scripts/pack-extension.sh — руками не править.\n"
    f'export const EXTENSION_VERSION = "{version}";\n',
    encoding="utf-8",
)
print(f"{chrome_zip}: {len(chrome_files)} файлов, {chrome_zip.stat().st_size // 1024} КБ; копия для сайта — {site}")

# ---- Firefox ----
FIREFOX_ID = "videoner@videoner.download"
ff = dict(manifest)
ff["background"] = {"page": "background.html"}
ff["permissions"] = [p for p in manifest["permissions"] if p != "offscreen"]
ff["browser_specific_settings"] = {
    "gecko": {
        "id": FIREFOX_ID,
        # 128 — первая ESR, где есть всё нужное: storage.session, MV3 с
        # разрешениями на сайты при установке.
        "strict_min_version": "128.0",
        # Обновления подписанного .xpi — с нашего сайта (web/public/extension).
        "update_url": "https://videoner.download/extension/firefox-updates.json",
        # Требование Mozilla к новым дополнениям: какие данные уходят с
        # компьютера. Ссылка на видео уходит серверу Videoner — без неё он не
        # скачает видео, это и есть работа расширения.
        "data_collection_permissions": {"required": ["websiteActivity"]},
    }
}
ff_text = json.dumps(ff, ensure_ascii=False, indent=2) + "\n"
ff_files = [p for p in files if p.relative_to(src).as_posix() not in CHROME_ONLY]

ff_dir = dist / "firefox"
shutil.rmtree(ff_dir, ignore_errors=True)
for path in ff_files:
    target = ff_dir / path.relative_to(src)
    target.parent.mkdir(parents=True, exist_ok=True)
    if path.relative_to(src).as_posix() == "manifest.json":
        target.write_text(ff_text, encoding="utf-8")
    else:
        shutil.copyfile(path, target)
ff_zip = dist / f"videoner-firefox-{version}.zip"
pack(ff_zip, ff_files, "", ff_text)
print(f"{ff_zip}: {len(ff_files)} файлов, {ff_zip.stat().st_size // 1024} КБ; распакованное — {ff_dir}/")

# ---- Firefox, каталог Mozilla ----
amo = json.loads(ff_text)
del amo["browser_specific_settings"]["gecko"]["update_url"]
amo_dir = dist / "firefox-amo"
shutil.rmtree(amo_dir, ignore_errors=True)
shutil.copytree(ff_dir, amo_dir)
(amo_dir / "manifest.json").write_text(json.dumps(amo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"{amo_dir}/: вариант для каталога addons.mozilla.org")
EOF
