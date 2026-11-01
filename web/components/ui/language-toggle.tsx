"use client";

import { Check, Globe } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/i18n/context";
import { localizedHref, stripLocalePrefix } from "@/lib/i18n/routing";
import { LANGUAGES, LANGUAGE_LABELS } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useRef } from "react";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  // Меню открывается с текущим языком в поле зрения, а не с начала списка.
  // Ждём два кадра: Radix сначала монтирует и позиционирует содержимое.
  const scrollToCurrent = (open: boolean) => {
    if (!open) return;
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const box = contentRef.current;
        const item = box?.querySelector<HTMLElement>("[data-current]");
        if (box && item) box.scrollTop = item.offsetTop - (box.clientHeight - item.offsetHeight) / 2;
      }),
    );
  };

  const switchLanguage = (lang: (typeof LANGUAGES)[number]) => {
    setLanguage(lang);
    router.push(localizedHref(lang, stripLocalePrefix(pathname)));
  };

  return (
    <DropdownMenu onOpenChange={scrollToCurrent}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={t("nav.language")}
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t("nav.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      {/* Языков больше трёх десятков: список прокручивается внутри меню и
          не выходит за край экрана (Radix сообщает доступную высоту). */}
      <DropdownMenuContent
        ref={contentRef}
        align="end"
        className="scrollbar-thin max-h-[min(28rem,var(--radix-dropdown-menu-content-available-height))] overflow-y-auto overscroll-contain"
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => switchLanguage(lang)}
            className="gap-2"
            data-current={language === lang || undefined}
          >
            <Check
              className={cn(
                "h-4 w-4",
                language === lang ? "opacity-100" : "opacity-0"
              )}
            />
            <span>{LANGUAGE_LABELS[lang]}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
