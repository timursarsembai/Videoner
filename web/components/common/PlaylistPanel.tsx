"use client";

import { useEffect, useRef, useState } from "react";
import { ListVideo, Music, Square, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { api, type Playlist } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/context";
import { downloadFile } from "@/lib/utils";

// Плейлист YouTube на сайте: видео качаются строго по одному — сервер
// готовит файл, браузер его сохраняет, потом следующее. «Остановить»
// прерывает и текущее (его файл просто не сохраняется). Сведения о каждом
// видео не запрашиваются: качество передаётся сразу (сервер подбирает
// ближайшее не выше), а /info стоит капчи на каждый запрос.

type Mode = "std" | "hd" | "audio";
type RunState = {
  mode: Mode;
  index: number;
  done: number;
  failed: number;
  progress: number | null;
  finished: boolean;
  stopped: boolean;
  // Сервер отказал всем скачиваниям (лимит трафика YouTube для сети, частота
  // запросов) — дальше идти бессмысленно, показываем причину.
  error?: string;
};

// Отказ, после которого следующие видео тоже не скачать.
class FatalError extends Error {}

function errorInfo(error: unknown): { status?: number; message: string } {
  const e = error as { statusCode?: number; message?: string } | undefined;
  return { status: e?.statusCode, message: e?.message ?? "" };
}

const POLL_MS = 2000;
const MAX_WAIT_MS = 60 * 60_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function PlaylistPanel({ playlist }: { playlist: Playlist }) {
  const { t } = useLanguage();
  const [run, setRun] = useState<RunState | null>(null);
  const stopRef = useRef(false);
  const n = playlist.entries.length;

  // Ушли со страницы или открыли другой плейлист — цикл должен закончиться.
  useEffect(() => () => {
    stopRef.current = true;
  }, [playlist.id]);

  // Запуск скачивания одного видео. Лучшее качество оказалось тяжелее
  // предела сервера — пробуем 720p. 403/429 — стоп всего плейлиста.
  async function startOne(entry: Playlist["entries"][number], mode: Mode) {
    const attempt = (quality: string) =>
      mode === "audio" ? api.downloadAudio(entry.url, "128Kbps", "mp3") : api.downloadVideo(entry.url, quality, "mp4");
    try {
      return await attempt(mode === "hd" ? "2160p" : "720p");
    } catch (error) {
      const { status, message } = errorInfo(error);
      if (status === 403 || status === 429) throw new FatalError(message);
      if (mode === "hd" && /too large/i.test(message)) return attempt("720p");
      throw error;
    }
  }

  async function downloadOne(entry: Playlist["entries"][number], mode: Mode): Promise<boolean | "stopped"> {
    const started = await startOne(entry, mode);
    const startedAt = Date.now();
    while (Date.now() - startedAt < MAX_WAIT_MS) {
      await sleep(POLL_MS);
      if (stopRef.current) return "stopped";
      const status = await api.getDownloadStatus(started.downloadId as unknown as number).catch(() => null);
      if (!status) continue;
      if (status.status === "COMPLETED") {
        if (stopRef.current) return "stopped";
        const file = status.items?.length ? status.items[0].filename : status.downloadUrl;
        downloadFile(file);
        return true;
      }
      if (status.status === "FAILED" || status.status === "EXPIRED") return false;
      const pct = status.progress?.percentage;
      setRun((r) => (r ? { ...r, progress: Number.isFinite(pct) ? Math.round(pct) : null } : r));
    }
    return false;
  }

  async function start(mode: Mode) {
    stopRef.current = false;
    let done = 0;
    let failed = 0;
    setRun({ mode, index: 0, done, failed, progress: null, finished: false, stopped: false });
    for (let index = 0; index < n; index++) {
      if (stopRef.current) break;
      setRun((r) => (r ? { ...r, index, progress: null } : r));
      let result: boolean | "stopped";
      try {
        result = await downloadOne(playlist.entries[index], mode);
      } catch (error) {
        if (error instanceof FatalError) {
          setRun((r) => (r ? { ...r, finished: true, error: error.message || "Error" } : r));
          return;
        }
        result = false;
      }
      if (result === "stopped") break;
      if (result) done++;
      else failed++;
      setRun((r) => (r ? { ...r, done, failed } : r));
    }
    setRun((r) => (r ? { ...r, finished: true, stopped: stopRef.current } : r));
  }

  const running = run && !run.finished;
  return (
    <section className="container max-w-3xl py-8">
      <div className="rounded-xl border p-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ListVideo className="h-5 w-5" />
          {t("playlist.title", { title: playlist.title || "YouTube", count: String(n) })}
        </h2>
        {!run && (
          <>
            <p className="mt-2 text-sm text-foreground/70">{t("playlist.hint")}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              <Button variant="outline" onClick={() => start("std")}>
                <Video className="mr-2 h-4 w-4" />
                {t("playlist.std")}
              </Button>
              <Button variant="outline" onClick={() => start("hd")}>
                <Video className="mr-2 h-4 w-4" />
                {t("playlist.hd")}
              </Button>
              <Button variant="outline" onClick={() => start("audio")}>
                <Music className="mr-2 h-4 w-4" />
                {t("playlist.audio")}
              </Button>
            </div>
          </>
        )}
        {run && (
          <div className="mt-4 space-y-3">
            {running ? (
              <>
                <p className="text-sm">
                  {t("playlist.progress", { index: String(run.index + 1), count: String(n) })}
                  {playlist.entries[run.index]?.title ? ` — ${playlist.entries[run.index].title}` : ""}
                </p>
                <Progress value={run.progress ?? 0} />
              </>
            ) : (
              <p className="text-sm font-medium">
                {run.stopped
                  ? t("playlist.stopped", { done: String(run.done), count: String(n) })
                  : t("playlist.finished", { done: String(run.done), count: String(n) })}
              </p>
            )}
            <p className="text-sm text-foreground/60">
              {t("playlist.stats", { done: String(run.done), failed: String(run.failed) })}
            </p>
            {run.error && <p className="text-sm text-destructive">{run.error}</p>}
            {running ? (
              <Button variant="destructive" onClick={() => (stopRef.current = true)}>
                <Square className="mr-2 h-4 w-4" />
                {t("playlist.stop")}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setRun(null)}>
                {t("playlist.again")}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
