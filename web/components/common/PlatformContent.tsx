"use client";

import { downloaders } from "@/config/downloaders";
import { useLanguage } from "@/lib/i18n/context";
import { translations } from "@/lib/i18n/translations";
import { Platform } from "@/types";

interface PlatformContentProps {
  platform: Platform;
}

export function PlatformContent({ platform }: PlatformContentProps) {
  const { t, language } = useLanguage();
  const platformName =
    downloaders.find((d) => d.value === platform)?.name ?? platform;

  const { howTo, faq } = translations[language].platforms[platform];

  return (
    <section className="container mx-auto max-w-3xl px-4 py-16">
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold sm:text-3xl">
          {t("content.howToTitle", { platform: platformName })}
        </h2>
        <ol className="space-y-3">
          {howTo.map((step, i) => (
            <li key={i} className="flex gap-3 text-foreground/80">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="mb-6 text-2xl font-bold sm:text-3xl">
          {t("content.faqTitle")}
        </h2>
        <div className="divide-y divide-border">
          {faq.map((item, i) => (
            <div key={i} className="py-4">
              <h3 className="mb-2 font-semibold">{item.q}</h3>
              <p className="text-foreground/70">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
