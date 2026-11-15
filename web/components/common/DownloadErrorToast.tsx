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
  // Страница звука Instagram, а не видео: сервер отвечает по-английски
  // (server/src/validate/url.ts, INSTAGRAM_AUDIO_PAGE_ERROR) — показываем на языке сайта.
  // Контент для взрослых и твит без видео (server/src/lib/adult-content.ts) —
  // до проверки «поможет расширение»: тут оно не поможет и не должно.
  if (message.startsWith("Adult content (X age-restricted tweet)")) {
    toast.error(t("toast.tweetAdultHidden"));
    return;
  }
  if (message.startsWith("Adult content")) {
    toast.error(t("toast.adultContent"));
    return;
  }
  if (message.startsWith("Tweet without video")) {
    toast.error(t("toast.tweetNoVideo"));
    return;
  }
  if (message.startsWith("Instagram audio page")) {
    toast.error(t("toast.instagramAudioPage"));
    return;
  }
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
