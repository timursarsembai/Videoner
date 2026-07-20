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
import { LANGUAGES, LANGUAGE_LABELS } from "@/lib/i18n/translations";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
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
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => setLanguage(lang)}
            className="gap-2"
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
