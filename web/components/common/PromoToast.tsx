"use client";

import { toast } from "react-hot-toast";

// Подсказка о Videoner после скачивания (lib/promo.ts): отдельным сообщением
// вслед за «готово». В тексте — канал (@videonerdownload), бот
// (t.me/VideonerBot) и страница расширения: делаем их ссылками.
const LINK = /(@videonerdownload|t\.me\/VideonerBot|videoner\.download\/[\w/-]*)/g;

function href(part: string): string {
  if (part === "@videonerdownload") return "https://t.me/videonerdownload";
  return `https://${part}`;
}

export function showPromoToast(text: string) {
  const parts = text.split(LINK);
  toast(
    <span className="text-sm">
      {parts.map((part, i) =>
        i % 2 ? (
          <a key={i} href={href(part)} target="_blank" rel="noopener noreferrer" className="font-medium text-primary underline-offset-4 hover:underline">
            {part}
          </a>
        ) : (
          part
        ),
      )}
    </span>,
    { duration: 12000 },
  );
}
