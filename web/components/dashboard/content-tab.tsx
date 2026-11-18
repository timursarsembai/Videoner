"use client";

import { Fragment, useState } from "react";
import type { ContentAuthors, ContentCategory, ContentHashtag, ContentTopics } from "@/lib/analytics-api";
import { ChartCard, usePeriodQuery } from "./chart-card";
import { formatShortDate } from "./tables";

// Вкладка «Контент»: что и у кого качают. Автор, категория и хэштеги
// записываются при скачивании с 18.11.2026 (server/src/lib/content-meta.ts);
// за прошлое есть только восстановленное: авторы Instagram из названий,
// ники TikTok из ссылок, сабреддиты и хэштеги из названий.

const PLATFORM_NAMES: Record<string, string> = {
  YOUTUBE: "YouTube", INSTAGRAM: "Instagram", TIKTOK: "TikTok", THREADS: "Threads", FACEBOOK: "Facebook",
  TWITTER: "X", REDDIT: "Reddit", VK: "VK", RUTUBE: "Rutube", PINTEREST: "Pinterest", OKRU: "OK", VIMEO: "Vimeo",
};
const PLATFORMS = ["", ...Object.keys(PLATFORM_NAMES)];
const selectClass =
  "h-8 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring";

function PlatformSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={selectClass} aria-label="Площадка">
      {PLATFORMS.map((p) => (
        <option key={p} value={p}>
          {p ? PLATFORM_NAMES[p] : "Все площадки"}
        </option>
      ))}
    </select>
  );
}

function AuthorsCard() {
  const [platform, setPlatform] = useState("");
  const [sort, setSort] = useState<"downloads" | "users">("users");
  const q = usePeriodQuery<ContentAuthors>("content/authors", { ...(platform ? { platform } : {}), sort, limit: 200 });
  const d = q.data;
  // Сортирует сервер: иначе топ-200 по скачиваниям, пересортированный здесь
  // по людям, терял бы авторов, которых качали многие, но понемногу.
  const rows = d?.authors ?? [];
  const share = d && d.total ? Math.round((d.withAuthor / d.total) * 100) : null;
  return (
    <ChartCard
      title={`Популярные авторы — ${q.label.toLowerCase()}`}
      hint="Блогеры, каналы и страницы, чьи видео качали. «Людей» — сколько разных пользователей качали этого автора: так видно настоящую популярность, а не одного человека, скачавшего сто роликов. Автор записывается с 18.11.2026; за прошлое — только Instagram (из названий) и TikTok (из ссылок)."
      period={q.period}
      onPeriod={q.setPeriod}
      controls={<PlatformSelect value={platform} onChange={setPlatform} />}
      loading={q.loading}
      error={q.error}
      wide
    >
      {share !== null && (
        <p className="mb-2 text-xs text-foreground/50">
          Автор известен у {d!.withAuthor} из {d!.total} скачиваний ({share}%).
        </p>
      )}
      <div className="max-h-[560px] overflow-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="sticky top-0 bg-background text-left text-foreground/60">
            <tr>
              <th className="pb-2 font-medium">Автор</th>
              <th className="pb-2 font-medium">Площадка</th>
              {(["users", "downloads"] as const).map((k) => (
                <th key={k} className="pb-2 text-right font-medium">
                  <button type="button" onClick={() => setSort(k)} className={`hover:text-foreground ${sort === k ? "text-foreground" : ""}`}>
                    {k === "users" ? "Людей" : "Скачиваний"}
                    {sort === k ? " ↓" : ""}
                  </button>
                </th>
              ))}
              <th className="pb-2 pl-4 font-medium">Последнее</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.key} className="border-t border-border/40">
                <td className="py-2">
                  {a.url ? (
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {a.name}
                    </a>
                  ) : (
                    a.name
                  )}
                </td>
                <td className="py-2 text-foreground/60">{PLATFORM_NAMES[a.platform] ?? a.platform}</td>
                <td className="py-2 text-right tabular-nums">{a.users}</td>
                <td className="py-2 text-right tabular-nums">{a.downloads}</td>
                <td className="py-2 pl-4 text-foreground/60">{formatShortDate(a.lastAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {d && !rows.length && <p className="py-6 text-center text-sm text-foreground/50">За этот период авторов пока нет.</p>}
      </div>
    </ChartCard>
  );
}

function BarList({ rows }: { rows: { label: string; sub?: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-1.5 text-sm">
      {rows.map((r) => (
        <li key={`${r.label}|${r.sub ?? ""}`} className="flex items-center gap-3">
          <span className="w-44 shrink-0 truncate" title={r.label}>
            {r.label}
            {r.sub && <span className="ml-1 text-xs text-foreground/40">{r.sub}</span>}
          </span>
          <span className="h-2 rounded bg-primary/60" style={{ width: `${(r.value / max) * 100}%`, minWidth: 2 }} />
          <span className="shrink-0 tabular-nums text-foreground/60">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}

function CategoriesCard() {
  const q = usePeriodQuery<ContentCategory[]>("content/categories");
  const rows = q.data ?? [];
  return (
    <ChartCard
      title={`Категории — ${q.label.toLowerCase()}`}
      hint="Своя категория есть только у YouTube; у Reddit роль категории играет сабреддит. Для остальных площадок тему видно по хэштегам (соседняя карточка). Записывается с 18.11.2026."
      period={q.period}
      onPeriod={q.setPeriod}
      loading={q.loading}
      error={q.error}
    >
      {rows.length ? (
        <BarList rows={rows.map((r) => ({ label: r.category, sub: PLATFORM_NAMES[r.platform], value: r.downloads }))} />
      ) : (
        <p className="py-6 text-center text-sm text-foreground/50">Пока пусто: категории появятся с новыми скачиваниями.</p>
      )}
    </ChartCard>
  );
}

function HashtagsCard() {
  const [platform, setPlatform] = useState("");
  const q = usePeriodQuery<ContentHashtag[]>("content/hashtags", { ...(platform ? { platform } : {}), limit: 40 });
  const rows = q.data ?? [];
  return (
    <ChartCard
      title={`Хэштеги — ${q.label.toLowerCase()}`}
      hint="Хэштеги из названий и описаний скачанных видео. Пустые для темы (#shorts, #fyp, #viral, #рек и подобные) не считаем. Записываются с 18.11.2026; за прошлое — только из названий."
      period={q.period}
      onPeriod={q.setPeriod}
      controls={<PlatformSelect value={platform} onChange={setPlatform} />}
      loading={q.loading}
      error={q.error}
    >
      {rows.length ? (
        <BarList rows={rows.map((r) => ({ label: `#${r.tag}`, value: r.downloads }))} />
      ) : (
        <p className="py-6 text-center text-sm text-foreground/50">За этот период хэштегов нет.</p>
      )}
    </ChartCard>
  );
}

// Религия по конфессиям и эзотерика — только частота (владелец 18.11.2026:
// пока ничего не блокируем). Определяется по словам в названии, хэштегах и
// имени автора (server: lib/sensitive-topics.ts); примеры — чтобы видеть,
// где список слов ошибается.
function TopicsCard() {
  const [platform, setPlatform] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const q = usePeriodQuery<ContentTopics>("content/topics", platform ? { platform } : {});
  const total = q.data?.total ?? 0;
  const wb = q.data?.wouldBlockReligion;
  const pct = (n: number) => (total ? `${((n / total) * 100).toFixed(1)}%` : "—");
  return (
    <ChartCard
      title={`Религия и эзотерика — ${q.label.toLowerCase()}`}
      hint="Определяется по словам в названии, хэштегах и имени автора, поэтому примерно: видео без подписи сюда не попадут, а редкое слово может сработать не по теме. Нажмите на тему, чтобы увидеть примеры. Пока только подсчёт — ничего не блокируется."
      period={q.period}
      onPeriod={q.setPeriod}
      controls={<PlatformSelect value={platform} onChange={setPlatform} />}
      loading={q.loading}
      error={q.error}
    >
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-foreground/50">
          <tr>
            <th className="py-1 font-normal">Тема</th>
            <th className="py-1 text-right font-normal">Скачиваний</th>
            <th className="py-1 text-right font-normal">Доля</th>
            <th className="py-1 text-right font-normal">Людей</th>
          </tr>
        </thead>
        <tbody>
          {(q.data?.topics ?? []).map((t) => (
            <Fragment key={t.id}>
              <tr
                className={t.examples.length ? "cursor-pointer hover:bg-foreground/5" : ""}
                onClick={() => t.examples.length && setOpen(open === t.id ? null : t.id)}
              >
                <td className="py-1.5">
                  {t.examples.length ? (open === t.id ? "▾ " : "▸ ") : ""}
                  {t.label}
                </td>
                <td className="py-1.5 text-right tabular-nums">{t.downloads}</td>
                <td className="py-1.5 text-right tabular-nums text-foreground/60">{pct(t.downloads)}</td>
                <td className="py-1.5 text-right tabular-nums">{t.users}</td>
              </tr>
              {open === t.id && (
                <tr>
                  <td colSpan={4} className="pb-3 pl-4">
                    <ul className="space-y-0.5 text-xs text-foreground/70">
                      {t.examples.map((e) => (
                        <li key={e.title} className="truncate" title={e.title}>
                          {e.count > 1 && <span className="mr-1 tabular-nums text-foreground/40">×{e.count}</span>}
                          {e.title}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-foreground/40">
        {q.data?.truncated ? `Скачиваний много — посчитано по последним ${total}` : `Всего удачных скачиваний за период: ${total}`}
      </p>
      <div className="mt-4 space-y-2 border-t border-foreground/10 pt-3 text-sm">
        <p>
          <b>Запрет эзотерики:</b> отказано {q.data?.blocked ?? 0} раз
          <span className="text-foreground/50"> (автор olga_taro_guru и строгий список слов; подробности — в журнале ошибок, «Запрещённая тема»)</span>
        </p>
        <p>
          <b>Религии, кроме ислама — тихий режим:</b> было бы запрещено {wb?.downloads ?? 0} скачиваний, {wb?.users ?? 0} людей
          <span className="text-foreground/50"> (пока ничего не запрещается; видео со словами про ислам — разрешены)</span>
        </p>
        {!!wb?.examples.length && (
          <details>
            <summary className="cursor-pointer text-xs text-foreground/60">Что было бы запрещено — проверьте, нет ли ошибок</summary>
            <ul className="mt-1 space-y-0.5 pl-4 text-xs text-foreground/70">
              {wb.examples.map((e) => (
                <li key={e.title} className="truncate" title={e.title}>
                  {e.count > 1 && <span className="mr-1 tabular-nums text-foreground/40">×{e.count}</span>}
                  {e.title}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </ChartCard>
  );
}

export function ContentTab() {
  return (
    <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <AuthorsCard />
      <CategoriesCard />
      <HashtagsCard />
      <TopicsCard />
    </section>
  );
}
