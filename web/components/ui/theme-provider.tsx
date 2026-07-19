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
    const downloader = downloaders.find((downloader) =>
      pathname.includes(downloader.value)
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
