"use client";

import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";
import { HeroInput } from "@/components/ui/hero-input";
import { downloaders } from "@/config/downloaders";
import { cn } from "@/lib/utils";
import { detectPlatform, isValidUrl } from "@/lib/validations/url";
import { motion } from "framer-motion";
import { ArrowRight, Download, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

export function Hero() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }

      if (!isValidUrl(url)) {
        toast.error("Please enter a valid URL");
        return;
      }

    const platform = detectPlatform(url);
    if (!platform) {
      toast.error("This platform is not supported");
      return;
    }

    setLoading(true);

    const downloader = downloaders.find((downloader) => downloader.value === platform);

    if (!downloader) {
      toast.error("This platform is not supported");
      return;
    }

    if (!downloader.isComingSoon) {
      const urlParams = new URLSearchParams({ url });
      router.push(`${downloader.href}?${urlParams.toString()}`);
    } else {
      toast.error(
        `Coming soon! ${
          downloader.name.charAt(0).toUpperCase() + downloader.name.slice(1)
        } is not supported yet`
      );
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
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
          <div className="flex min-h-screen flex-col items-center justify-center py-20">
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
                <p className="text-sm font-medium">Many new features →</p>
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
                  Download Videos
                  <br />
                  <span className="relative mt-2 inline-block">
                    <span className="relative z-10 bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                      Fast & Easy
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
                  Your universal video downloader for YouTube, Instagram,
                  TikTok, and more. Choose any quality, from HD to
                  mobile-friendly.
                  <span className="hidden sm:inline">
                    {" "}
                    No limits, no hassle, just downloads.
                  </span>
                </motion.p>
              </motion.div>

              {/* Download Form */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                onSubmit={handleDownload}
                className="relative w-full max-w-3xl"
              >
                <div className="absolute -inset-1.5 animate-pulse rounded-2xl bg-gradient-to-r from-primary/20 to-primary-light/20 blur" />
                <div className="relative flex flex-col gap-4 rounded-2xl bg-background/80 p-2 backdrop-blur sm:flex-row">
                  <div className="flex-1">
                    <HeroInput
                      type="url"
                      placeholder="Paste video URL from any platform..."
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

              {/* Stats */}
              {/* <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-wrap justify-center gap-8 text-center"
              >
                {[
                  { label: "Happy Users", value: "5M+" },
                  { label: "Downloads Daily", value: "1M+" },
                  { label: "Supported Platforms", value: "20+" },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.7 }}
                    className="flex flex-col"
                  >
                    <span className="text-2xl font-bold text-foreground sm:text-3xl">
                      {stat.value}
                    </span>
                    <span className="text-sm text-foreground/60">
                      {stat.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
