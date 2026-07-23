import { type ClassValue, clsx } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const downloadFile = (downloadUrl: string) => {
  if (!downloadUrl) {
    toast.error("Download URL not found");
    return;
  }

  try {
    // Сегодня бэкенд всегда шлёт голое имя файла (см. SSE complete-событие,
    // VideoDownload.getDownloadUrl на сервере) — но если он когда-нибудь
    // начнёт отдавать полный URL (CDN/S3-ссылка), раньше этот код всё равно
    // отбрасывал всё, кроме последнего сегмента пути, и пересобирал его как
    // same-origin путь на своём бэкенде — рабочая CDN-ссылка превратилась бы
    // в несуществующий адрес. Теперь полный URL используется как есть.
    const fullUrl = /^https?:\/\//i.test(downloadUrl)
      ? downloadUrl
      : `${process.env.NEXT_PUBLIC_API_URL}/download/${downloadUrl}`;

    const fileName = fullUrl.split("/").pop() || "download";

    // Клик по скрытой <a download> запускает нативную загрузку без открытия
    // вкладки — в отличие от window.open(), это не триггерит блокировщик
    // всплывающих окон (тем более что вызов идёт асинхронно, уже после
    // завершения прогресса, а не прямо внутри обработчика клика).
    const link = document.createElement("a");
    link.href = fullUrl;
    link.download = fileName;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("Download error:", error);
    toast.error("Failed to start download");
  }
};

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  const axiosError = error as any;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    "An unexpected error occurred"
  );
};

export const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};
