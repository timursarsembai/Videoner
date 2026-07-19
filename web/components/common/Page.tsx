"use client";

import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { HeroInput } from "@/components/ui/hero-input";
import { downloaders } from "@/config/downloaders";
import { api } from "@/lib/api";
import { cn, extractErrorMessage } from "@/lib/utils";
import { detectPlatform, isValidUrl } from "@/lib/validations/url";
import { Platform } from "@/types";
import { VideoInfo } from "@/types/youtube";
import { motion } from "framer-motion";
import { ArrowRight, Download, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { VideoInfoSection } from "./VideoInfo";

interface PageProps {
  news: string;
  title: string[];
  description: string;
  placeholder: string;
  platform: Platform;
}

const Page = ({ platform, news, title, description, placeholder }: PageProps) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Handle URL from query parameters
  useEffect(() => {
    const urlFromParams = searchParams?.get("url");
    if (!urlFromParams) return;

    const platform = detectPlatform(urlFromParams);
    if (!platform) return;

    setUrl(urlFromParams);
    fetchVideoInfo(urlFromParams, platform);
    // remove url from query params
    router.replace(`/${platform}`, { scroll: false });
  }, [searchParams, router]);

  const fetchVideoInfo = async (videoUrl: string, platform: Platform) => {
    const url = videoUrl.trim();
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }

    const downloader = downloaders.find(
      (downloader) => downloader.value === platform
    );

    if (!downloader) {
      toast.error("This URL is not supported");
      return;
    }

    if (!downloader.isUrlValid(url)) {
      toast.error(`Please enter a valid ${downloader.value} URL`);
      return;
    }

    setLoading(true);
    try {
      setVideoInfo(null);
      const info = await api.getVideoInfo(url);
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetchVideoInfo(url, platform!);
  };

  return (
    <div className="relative">
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
                  <span className="text-xs font-medium text-white">New</span>
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
                        Download
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
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
          <VideoInfoSection videoInfo={videoInfo} url={url} />
        </motion.div>
      )}
    </div>
  );
};

export default Page;
