"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { usePathname } from "next/navigation";
import { downloaders } from "@/config/downloaders";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const pathname = usePathname();
  React.useEffect(() => {
    // Точное совпадение СЕГМЕНТА пути, а не pathname.includes(...) — substring-
    // матч ложно сработал бы на любой будущий маршрут/слаг, случайно содержащий
    // имя платформы как часть строки (например "vk" внутри слага без границ).
    const segments = pathname.split("/").filter(Boolean);
    const downloader = downloaders.find((downloader) =>
      segments.includes(downloader.value)
    );
    downloaders.forEach((downloader) => {
      document.body.classList.remove(downloader.value);
    });
    if (downloader) {
      document.body.classList.add(downloader.value);
    }
  }, [pathname]);

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
