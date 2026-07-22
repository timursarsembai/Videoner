import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";

export const metadata: Metadata = {
  title: "Videoner - Download TikTok Videos",
  description:
    "Download TikTok videos without watermark in high quality formats. Fast, free, and easy to use. Support for all TikTok content types.",
  keywords:
    "TikTok downloader, TikTok video downloader, download TikTok without watermark, TikTok to MP4, HD TikTok downloader, TikTok saver, TikTok video saver",
  robots: "index, follow",
  openGraph: {
    title: "Videoner - Download TikTok Videos",
    description:
      "Download TikTok videos without watermark in high quality formats. Fast, free, and easy to use. Support for all TikTok content types.",
    url: "https://videoner.download/tiktok",
    siteName: "Videoner",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Videoner - Download TikTok Videos",
    description:
      "Download TikTok videos without watermark in high quality formats. Fast, free, and easy to use. Support for all TikTok content types.",
  },
  alternates: {
    canonical: "https://videoner.download/tiktok",
  },
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <Page platform="tiktok" />
    </Suspense>
  );
}
