"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth/context";
import { useLanguage } from "@/lib/i18n/context";
import { downloadFile, extractErrorMessage } from "@/lib/utils";
import { SubtitleTrack } from "@/types/youtube";
import { motion } from "framer-motion";
import { Captions, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { TelegramLoginWidget } from "./TelegramLoginWidget";

// Субтитры YouTube — отдельной панелью, а не третьим видом в общей логике
// VideoInfo. Там выбор завязан на качества, расширения и восстановление после
// входа через Telegram; у субтитров ничего этого нет, и вплетать их туда значило
// бы трогать путь скачивания видео ради файла в несколько килобайт.
//
// Файл готовится за секунды, поэтому ни хода выполнения, ни «скачать снова»:
// ответ сервера — сразу имя файла.
export const SubtitlesPanel = ({
  url,
  title,
  tracks,
}: {
  url: string;
  title: string;
  tracks: SubtitleTrack[];
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [selected, setSelected] = useState<string | null>(tracks.length === 1 ? tracks[0].lang : null);
  const [busy, setBusy] = useState(false);

  const handleDownload = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      const { fileName } = await api.downloadSubtitles(url, selected, title);
      downloadFile(fileName);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{t("video.subtitlesHint")}</p>

      <div className="grid gap-3 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
        {tracks.map((track, index) => (
          <motion.div
            key={track.lang}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Button
              variant={selected === track.lang ? "default" : "outline"}
              onClick={() => setSelected(track.lang)}
              className="h-auto w-full py-5"
            >
              <span className="flex items-center gap-2 font-medium">
                <Captions className="h-5 w-5" />
                {track.name}
                {track.auto && (
                  <span className="text-xs opacity-70">({t("video.subtitlesAuto")})</span>
                )}
              </span>
            </Button>
          </motion.div>
        ))}
      </div>

      {user === null ? (
        <div className="flex flex-col items-center gap-2 rounded-lg bg-muted/30 p-4 text-center">
          <p className="text-sm text-muted-foreground">{t("video.loginRequiredHint")}</p>
          {/* После входа человек вернётся на ту же ссылку; язык выберет заново —
              он один клик, и тащить его через адрес незачем. */}
          <TelegramLoginWidget label={t("auth.loginButton")} preserveParams={{ url }} />
        </div>
      ) : (
        <Button
          onClick={handleDownload}
          disabled={!selected || busy || user === undefined}
          className="w-full gap-2"
          size="lg"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {busy ? t("video.subtitlesDownloading") : t("video.subtitlesDownload")}
        </Button>
      )}
    </div>
  );
};
