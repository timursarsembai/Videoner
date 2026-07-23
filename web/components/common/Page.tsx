"use client";

import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { HeroInput } from "@/components/ui/hero-input";
import { downloaders } from "@/config/downloaders";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/routing";
import { cn, extractErrorMessage } from "@/lib/utils";
import { detectPlatform, isValidUrl } from "@/lib/validations/url";
import { Platform } from "@/types";
import { VideoInfo } from "@/types/youtube";
import { motion } from "framer-motion";
import { ArrowRight, Download, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { PlatformContent } from "./PlatformContent";
import { TurnstileWidget } from "./TurnstileWidget";
import { VideoInfoSection } from "./VideoInfo";

interface PageProps {
  platform: Platform;
}

interface RestoredSelection {
  quality?: string;
  tab?: "video" | "audio";
  ext?: string;
}

interface UrlFromQueryParamsProps {
  onFound: (url: string, platform: Platform, selection: RestoredSelection) => void;
}

// useSearchParams требует Suspense-границу; на статической генерации Next.js
// рендерит fallback этой границы. Изолируем хук сюда, в невидимый компонент,
// чтобы под fallback=null не попадала вся остальная (индексируемая) разметка
// страницы — иначе краулеры без JS видят пустой <main>.
const UrlFromQueryParams = ({ onFound }: UrlFromQueryParamsProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useLanguage();

  useEffect(() => {
    const urlFromParams = searchParams?.get("url");
    if (!urlFromParams) return;

    const platform = detectPlatform(urlFromParams);
    if (!platform) return;

    const tabParam = searchParams?.get("tab");
    onFound(urlFromParams, platform, {
      quality: searchParams?.get("quality") ?? undefined,
      tab: tabParam === "video" || tabParam === "audio" ? tabParam : undefined,
      ext: searchParams?.get("ext") ?? undefined,
    });
    // remove url from query params
    router.replace(localizedHref(language, `/${platform}`), { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router]);

  return null;
};

const Page = ({ platform }: PageProps) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Тексты страницы платформы берём из словаря по её ключу.
  const news = t(`platforms.${platform}.news`);
  const title = [
    t(`platforms.${platform}.titleLine1`),
    t(`platforms.${platform}.titleLine2`),
  ];
  const description = t(`platforms.${platform}.pageDescription`);
  const placeholder = t(`platforms.${platform}.placeholder`);

  const fetchVideoInfo = useCallback(async (videoUrl: string, platform: Platform) => {
    const url = videoUrl.trim();
    if (!url) {
      toast.error(t("toast.enterUrl"));
      return;
    }

    if (!isValidUrl(url)) {
      toast.error(t("toast.enterValidUrl"));
      return;
    }

    const downloader = downloaders.find(
      (downloader) => downloader.value === platform
    );

    if (!downloader) {
      toast.error(t("toast.urlNotSupported"));
      return;
    }

    if (!downloader.isUrlValid(url)) {
      toast.error(
        t("toast.enterValidPlatformUrl", { platform: downloader.value })
      );
      return;
    }

    if (!turnstileToken) {
      toast.error(t("toast.captchaNotReady"));
      return;
    }

    setLoading(true);
    try {
      setVideoInfo(null);
      const info = await api.getVideoInfo(url, turnstileToken);
      setVideoInfo(info);
      // Smooth scroll to video section after a short delay
      setTimeout(() => {
        if (videoSectionRef.current) {
          videoSectionRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (error: unknown) {
      toast.error(extractErrorMessage(error));
      setVideoInfo(null);
    } finally {
      setLoading(false);
    }
  }, [t, turnstileToken]);

  // Переход с главной (?url=...) вызывает автозапуск ДО того, как Turnstile-виджет
  // успевает загрузиться и выдать токен (скрипт грузится асинхронно) — откладываем
  // до готовности токена, а не просто требуем повторной ручной отправки формы.
  const [pendingAutoFetch, setPendingAutoFetch] = useState<{ url: string; platform: Platform } | null>(null);
  const [restoredSelection, setRestoredSelection] = useState<RestoredSelection | null>(null);

  const handleUrlFromParams = useCallback(
    (urlFromParams: string, detectedPlatform: Platform, selection: RestoredSelection) => {
      setUrl(urlFromParams);
      setPendingAutoFetch({ url: urlFromParams, platform: detectedPlatform });
      setRestoredSelection(selection);
    },
    []
  );

  useEffect(() => {
    if (!pendingAutoFetch || !turnstileToken) return;
    fetchVideoInfo(pendingAutoFetch.url, pendingAutoFetch.platform);
    setPendingAutoFetch(null);
  }, [pendingAutoFetch, turnstileToken, fetchVideoInfo]);

  // restoredSelection нужен только для самого первого монтирования
  // VideoInfoSection после auto-fetch (initialQuality и т.п. — это просто
  // сид для useState там, читается один раз) — чистим его следующим
  // рендером, чтобы он не переиспользовался при следующем ручном поиске.
  useEffect(() => {
    if (videoInfo && restoredSelection) setRestoredSelection(null);
  }, [videoInfo, restoredSelection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchVideoInfo(url, platform);
  };

  return (
    <div className={cn("relative", platform)}>
      <Suspense fallback={null}>
        <UrlFromQueryParams onFound={handleUrlFromParams} />
      </Suspense>

      {/* Hero Section */}
      <div className="relative overflow-hidden ">
        <GridPattern
          squares={[
            [4, 4],
            [5, 1],
            [8, 2],
            [5, 3],
            [5, 5],
            [10, 10],
            [12, 15],
            [15, 10],
            [10, 15],
            [15, 10],
            [10, 15],
            [15, 10],
          ]}
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
            "inset-x-0 inset-y-[-45%] h-[200%] skew-y-12"
          )}
        />

        <div className="container relative">
          <div className="flex min-h-screen flex-col items-center justify-center ">
            {/* Feature Banner */}
            <div className="flex justify-center mb-10">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 rounded-full border border-foreground/10 bg-background/50 px-4 py-2 backdrop-blur"
              >
                <div className="rounded-full bg-primary px-2 py-0.5">
                  <span className="text-xs font-medium text-white">
                    {t("home.new")}
                  </span>
                </div>
                <p className="text-sm font-medium">{news} →</p>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex w-full flex-col items-center gap-16 px-4">
              {/* Hero Text */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative space-y-6 text-center"
              >
                <motion.h1
                  className="relative mx-auto max-w-[900px] text-center text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {title[0]}
                  <br />
                  <span className="relative mt-2 inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                      {title[1]}
                    </span>
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-3 w-full bg-primary/20"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    />
                  </span>
                </motion.h1>

                <motion.p
                  className="mx-auto max-w-2xl text-lg text-foreground/60 sm:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {description}
                </motion.p>
              </motion.div>

              {/* Download Form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                onSubmit={handleSubmit}
                className="relative w-full max-w-3xl"
              >
                <div className="absolute -inset-1.5 animate-pulse rounded-2xl bg-gradient-to-r from-primary/20 to-primary-light/20 blur" />
                <div className="relative flex flex-col gap-4 rounded-2xl bg-background/80 p-2 backdrop-blur sm:flex-row">
                  <div className="flex-1">
                    <HeroInput
                      type="url"
                      placeholder={placeholder}
                      value={url}
                      onValueChange={(value) => setUrl(value)}
                      icon={<Download className="h-6 w-6" />}
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="group h-14 gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-light px-8 text-base hover:opacity-90"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        {t("home.download")}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
                <div className="mt-4 flex justify-center">
                  <TurnstileWidget onVerify={setTurnstileToken} />
                </div>
              </motion.form>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info Section */}
      {videoInfo && (
        <motion.div
          ref={videoSectionRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <VideoInfoSection
            videoInfo={videoInfo}
            url={url}
            initialQuality={restoredSelection?.quality}
            initialTab={restoredSelection?.tab}
            initialExtension={restoredSelection?.ext}
          />
        </motion.div>
      )}

      <PlatformContent platform={platform} />
    </div>
  );
};

export default Page;
