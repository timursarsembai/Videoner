"use client";

import { downloaders } from "@/config/downloaders";
import { useLanguage } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/routing";
import type { TranslationKey } from "@/lib/i18n/context";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

// Плитки площадок под полем ввода на главной: каждая ведёт на свою страницу
// (/youtube, /reddit, …). Порядок и список — из config/downloaders.ts, как в
// меню, чтобы новая площадка появлялась здесь сама. Цвет подсветки — тот же
// фирменный, что у страницы площадки (app/globals.css).
const BRAND: Record<string, string> = {
  youtube: "#ff0000",
  tiktok: "#111827",
  instagram: "#e1306c",
  threads: "#374151",
  facebook: "#1877f2",
  twitter: "#1da1f2",
  reddit: "#ff4500",
  pinterest: "#e60023",
  vk: "#0077ff",
  vimeo: "#1eb8eb",
  rutube: "#ed143b",
  okru: "#f7931e",
};

// В меню площадка называется «Twitter», но сам сервис давно X.
const LABEL: Record<string, string> = { twitter: "X (Twitter)" };

export function PlatformLinks() {
  const { t, language } = useLanguage();
  const items = downloaders.filter((d) => !d.isComingSoon);

  return (
    <motion.nav
      aria-label={t("nav.downloaders")}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
    >
      {items.map((d) => (
        <Link
          key={d.value}
          href={localizedHref(language, d.href)}
          title={t(`platforms.${d.value}.description` as TranslationKey)}
          style={{ "--brand": BRAND[d.value] ?? "rgb(var(--primary))" } as CSSProperties}
          className="group flex items-center gap-3 rounded-xl border border-foreground/10 bg-background/60 px-3 py-2.5 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--brand)] hover:shadow-[0_6px_20px_-8px_var(--brand)] focus-visible:border-[color:var(--brand)] focus-visible:outline-none"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5">
            {d.logo && <Image src={d.logo} alt="" width={20} height={20} className="h-5 w-5 object-contain" />}
          </span>
          <span className="truncate text-sm font-medium text-foreground/80 transition-colors group-hover:text-[color:var(--brand)] dark:group-hover:text-foreground">
            {LABEL[d.value] ?? d.name}
          </span>
        </Link>
      ))}
    </motion.nav>
  );
}
