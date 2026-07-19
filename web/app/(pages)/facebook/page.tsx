import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";

export const metadata: Metadata = {
  title: "Vidyoza - Download Facebook Videos",
  description:
    "Download Facebook videos in high quality formats. Fast, free, and easy to use. Support for 8K, 4K, HD quality and MP3 audio.",
  keywords:
    "YouTube downloader, YouTube Shorts downloader, video downloader, YouTube to MP3, YouTube to MP4, download YouTube Shorts, YouTube video downloader, HD video downloader, 8K video downloader, YouTube audio downloader",
  robots: "index, follow",
  openGraph: {
    title: "Vidyoza - Download Facebook Videos",
    description:
      "Download Facebook videos in high quality formats. Fast, free, and easy to use. Support for 8K, 4K, HD quality and MP3 audio.",
    url: "https://www.vidyoza.com/facebook",
    siteName: "Vidyoza",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidyoza - Download Facebook Videos",
    description:
      "Download Facebook videos in high quality formats. Fast, free, and easy to use. Support for 8K, 4K, HD quality and MP3 audio.",
  },
  alternates: {
    canonical: "https://www.vidyoza.com/facebook",
  },
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <Page
        platform="facebook"
        news="Now with videos and reels support"
        title={["Facebook Videos", "& Reels Downloader"]}
        description="Advanced online tool to download Facebook videos and reels in
                  HD quality. Support for videos, group content, and
                  stories."
        placeholder="Paste Facebook URL here..."
      />
    </Suspense>
  );
}
