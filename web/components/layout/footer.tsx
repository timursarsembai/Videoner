"use client";

import { useLanguage } from "@/lib/i18n/context";
import Image from "next/image";
import { Send } from "lucide-react";

// Раньше был захардкожен буквально "VideonerBot" — рассинхрон с остальным
// сайтом (UserMenu.tsx, VideoInfo.tsx), которые читают из env: при смене
// бота (staging, ребрендинг) футер тихо продолжал бы указывать на старого.
const TELEGRAM_BOT = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "VideonerBot";
const DEVELOPER = "sarsembai.dev";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/40 bg-background/60">
      <div className="container flex flex-col items-center gap-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <Image
            src="/images/videoner-website-logo.webp"
            alt="Videoner"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <span className="text-sm text-foreground/60">
            © {year} Videoner. {t("footer.rights")}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 sm:items-end">
          <a
            href={`https://t.me/${TELEGRAM_BOT}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            <Send className="h-4 w-4" />
            {t("footer.botCta")} @{TELEGRAM_BOT}
          </a>
          <span className="text-sm text-foreground/60">
            {t("footer.developedBy")}{" "}
            <a
              href={`https://${DEVELOPER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {DEVELOPER}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
