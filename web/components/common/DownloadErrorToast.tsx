"use client";

import Link from "next/link";
import { toast, type Toast } from "react-hot-toast";

import { TranslationKey } from "@/lib/i18n/context";
import { Language } from "@/lib/i18n/translations";
import { browserCanHelp, extensionPageHref } from "@/lib/extension-hint";

// Ошибка получения или скачивания ролика. Если площадка не отдала его нашему
// серверу, а расширение для браузера скачает под входом человека (см.
// lib/extension-hint.ts), вместо сырого текста yt-dlp — объяснение и ссылка
// на страницу расширения. Держится дольше обычного: ссылку надо успеть нажать.
export function showDownloadError(
  message: string,
  url: string,
  language: Language,
  t: (key: TranslationKey) => string
) {
  if (!browserCanHelp(url, message)) {
    toast.error(message);
    return;
  }
  toast.error(
    (current: Toast) => (
      <span>
        {t("toast.needsBrowser")}{" "}
        <Link
          href={extensionPageHref(language, url)}
          onClick={() => toast.dismiss(current.id)}
          className="font-semibold text-primary underline underline-offset-2"
        >
          {t("toast.needsBrowserLink")}
        </Link>
      </span>
    ),
    { duration: 20_000 }
  );
}
