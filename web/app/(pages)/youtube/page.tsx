import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";

export const metadata: Metadata = {
  title: "Videoner - Download Youtube Videos & Shorts",
  description:
    "Download YouTube videos, Shorts, and audio in high quality formats. Fast, free, and easy to use. Support for 8K, 4K, HD quality and MP3 audio.",
  keywords:
    "YouTube downloader, YouTube Shorts downloader, video downloader, YouTube to MP3, YouTube to MP4, download YouTube Shorts, YouTube video downloader, HD video downloader, 8K video downloader, YouTube audio downloader",
  robots: "index, follow",
  openGraph: {
    title: "Videoner - Download Youtube Videos & Shorts",
    description:
      "Download YouTube videos, Shorts, and audio in high quality formats. Fast, free, and easy to use. Support for 8K, 4K, HD quality and MP3 audio.",
    url: "https://videoner.download/youtube",
    siteName: "Videoner",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Videoner - Download Youtube Videos & Shorts",
    description:
      "Download YouTube videos, Shorts, and audio in high quality formats. Fast, free, and easy to use. Support for 8K, 4K, HD quality and MP3 audio.",
  },
  alternates: {
    canonical: "https://videoner.download/youtube",
  },
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <Page platform="youtube" />
    </Suspense>
  );
}
