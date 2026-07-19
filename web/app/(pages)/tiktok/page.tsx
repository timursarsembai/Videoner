import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";

export const metadata: Metadata = {
  title: "Vidyoza - Download TikTok Videos",
  description:
    "Download TikTok videos without watermark in high quality formats. Fast, free, and easy to use. Support for all TikTok content types.",
  keywords:
    "TikTok downloader, TikTok video downloader, download TikTok without watermark, TikTok to MP4, HD TikTok downloader, TikTok saver, TikTok video saver",
  robots: "index, follow",
  openGraph: {
    title: "Vidyoza - Download TikTok Videos",
    description:
      "Download TikTok videos without watermark in high quality formats. Fast, free, and easy to use. Support for all TikTok content types.",
    url: "https://www.vidyoza.com/tiktok",
    siteName: "Vidyoza",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidyoza - Download TikTok Videos",
    description:
      "Download TikTok videos without watermark in high quality formats. Fast, free, and easy to use. Support for all TikTok content types.",
  },
  alternates: {
    canonical: "https://www.vidyoza.com/tiktok",
  },
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <Page
        platform="tiktok"
        news="Download without watermark"
        title={["TikTok Videos", "Downloader"]}
        description="Download TikTok videos without watermark in high quality formats. Fast, free, and easy to use. Support for all TikTok content types."
        placeholder="Paste TikTok URL here..."
      />
    </Suspense>
  );
}
