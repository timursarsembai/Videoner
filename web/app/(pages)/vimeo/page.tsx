import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";

export const metadata: Metadata = {
  title: "Videoner - Download Vimeo Videos",
  description:
    "Download Vimeo videos in high quality formats. Fast, free, and easy to use.",
  keywords:
    "Vimeo downloader, Vimeo video downloader, download Vimeo videos, Vimeo to MP4, HD Vimeo downloader, Vimeo saver, Vimeo video saver",
  robots: "index, follow",
  openGraph: {
    title: "Videoner - Download Vimeo Videos",
    description:
      "Download Vimeo videos in high quality formats. Fast, free, and easy to use.",
    url: "https://videoner.download/vimeo",
    siteName: "Videoner",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Videoner - Download Vimeo Videos",
    description:
      "Download Vimeo videos in high quality formats. Fast, free, and easy to use.",
  },
  alternates: {
    canonical: "https://videoner.download/vimeo",
  },
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <Page platform="vimeo" />
    </Suspense>
  );
}
