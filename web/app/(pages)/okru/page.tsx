import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";

export const metadata: Metadata = {
  title: "Videoner - Download OK.ru Videos",
  description:
    "Download OK.ru (Odnoklassniki) videos in high quality formats. Fast, free, and easy to use.",
  keywords:
    "OK.ru downloader, Odnoklassniki video downloader, download OK.ru videos, OK.ru to MP4, HD OK.ru downloader, OK.ru saver",
  robots: "index, follow",
  openGraph: {
    title: "Videoner - Download OK.ru Videos",
    description:
      "Download OK.ru (Odnoklassniki) videos in high quality formats. Fast, free, and easy to use.",
    url: "https://videoner.download/okru",
    siteName: "Videoner",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Videoner - Download OK.ru Videos",
    description:
      "Download OK.ru (Odnoklassniki) videos in high quality formats. Fast, free, and easy to use.",
  },
  alternates: {
    canonical: "https://videoner.download/okru",
  },
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <Page platform="okru" />
    </Suspense>
  );
}
