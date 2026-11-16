import { Metadata } from "next";
import Link from "next/link";
import { Send } from "lucide-react";

import { downloaders } from "@/config/downloaders";
import { languageAlternates, localizedHref } from "@/lib/i18n/routing";
import { LANGUAGES } from "@/lib/i18n/translations";
import { resolveLocale } from "@/lib/legal/page";
import { blogUi } from "@/lib/blog/ui";
import { fetchPublicStats, formatRounded } from "@/lib/public-stats";
import { statsPage } from "@/lib/stats-page";

// «Videoner в цифрах»: масштаб проекта — сколько скачали всего, через что и
// откуда, сколько людей в боте. Цифры с сервера (lib/public-stats.ts),
// страница пересобирается раз в час. Числа округлены вниз («8 100+»).
export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

const TELEGRAM_BOT = "VideonerBot";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = resolveLocale((await params).locale);
  const text = statsPage[lang];
  return {
    title: `${text.metaTitle} | Videoner`,
    description: text.summary,
    alternates: {
      canonical: `https://videoner.download${localizedHref(lang, "/stats")}`,
      languages: languageAlternates("/stats"),
    },
  };
}

// Название площадки — как в меню сайта (config/downloaders.ts).
function platformName(platform: string): string {
  const id = platform.toLowerCase();
  if (id === "twitter") return "X (Twitter)";
  if (id === "getcourse") return "GetCourse";
  return downloaders.find((d) => d.href === `/${id}`)?.name ?? platform;
}

export default async function StatsPage({ params }: Props) {
  const lang = resolveLocale((await params).locale);
  const text = statsPage[lang];
  const locale = blogUi[lang].dateLocale;
  const stats = await fetchPublicStats();
  const n = (value: number) => formatRounded(value, locale);
  const date = (iso: string) =>
    new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
  const sourceLabel: Record<string, string> = {
    BOT: text.sourceBot,
    WEB: text.sourceWeb,
    EXTENSION: text.sourceExtension,
  };
  // «Другое» (API) — в одну строку в конце.
  const sources = stats
    ? [
        ...stats.bySource.filter((s) => s.source in sourceLabel).map((s) => ({ label: sourceLabel[s.source], count: s.count })),
        ...(() => {
          const other = stats.bySource.filter((s) => !(s.source in sourceLabel)).reduce((a, s) => a + s.count, 0);
          return other ? [{ label: text.sourceOther, count: other }] : [];
        })(),
      ]
    : [];

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{text.title}</h1>
      <p className="mt-3 leading-relaxed text-foreground/80">{text.summary}</p>

      {stats ? (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <Big value={n(stats.downloads)} label={text.downloads} highlight />
            <Big value={n(stats.botUsers)} label={text.botUsers} />
            <Big value={n(stats.activeBotUsers)} label={text.activeBotUsers} />
            <div className="grid grid-cols-2 gap-4">
              <Big value={n(stats.countries)} label={text.countries} small />
              <Big value={String(LANGUAGES.length)} label={text.languages} small />
            </div>
          </div>

          <section className="mt-10">
            <h2 className="text-xl font-semibold">{text.sourcesTitle}</h2>
            <Bars rows={sources} total={stats.downloads} format={n} />
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold">{text.platformsTitle}</h2>
            <Bars
              rows={stats.byPlatform.map((p) => ({ label: platformName(p.platform), count: p.count }))}
              total={stats.downloads}
              format={n}
            />
          </section>

          <p className="mt-10 text-sm leading-relaxed text-foreground/60">
            {text.note}
            {stats.since && <> {text.since.replace("{date}", date(stats.since))}.</>}{" "}
            {text.updated.replace("{date}", date(stats.updatedAt))}.
          </p>
        </>
      ) : (
        <p className="mt-8 rounded-lg border p-4 text-foreground/80">{text.unavailable}</p>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={`https://t.me/${TELEGRAM_BOT}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Send className="h-4 w-4" />
          {text.ctaBot}
        </a>
        <Link
          href={localizedHref(lang, "/")}
          className="inline-flex items-center rounded-lg border px-4 py-2 font-medium hover:bg-muted"
        >
          {text.ctaSite}
        </Link>
      </div>
    </article>
  );
}

function Big({ value, label, highlight = false, small = false }: { value: string; label: string; highlight?: boolean; small?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 ${highlight ? "border-primary/40 bg-primary/5" : ""}`}>
      <div className={`font-bold tabular-nums tracking-tight ${small ? "text-3xl" : "text-4xl sm:text-5xl"} ${highlight ? "text-primary" : ""}`}>
        <bdi>{value}</bdi>
      </div>
      <div className="mt-1 text-sm text-foreground/70">{label}</div>
    </div>
  );
}

// Доли без процентов в подписи: число рядом уже округлено, а полоска
// показывает соотношение.
function Bars({ rows, total, format }: { rows: { label: string; count: number }[]; total: number; format: (n: number) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <ul className="mt-4 space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-4 text-sm">
            <span className="font-medium">{r.label}</span>
            <span className="tabular-nums text-foreground/70">
              <bdi>{format(r.count)}</bdi>
            </span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-muted" aria-hidden>
            <div className="h-2 rounded-full bg-primary" style={{ width: `${Math.max(2, (r.count / max) * 100)}%` }} />
          </div>
        </li>
      ))}
      {!rows.length && total === 0 && <li className="text-sm text-foreground/60">—</li>}
    </ul>
  );
}
