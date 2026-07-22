import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";

export const metadata: Metadata = {
  title: "Videoner - Download Rutube Videos",
  description:
    "Download Rutube videos in high quality formats. Fast, free, and easy to use.",
  keywords:
    "Rutube downloader, Rutube video downloader, download Rutube videos, Rutube to MP4, HD Rutube downloader, Rutube saver, Rutube video saver",
  robots: "index, follow",
  openGraph: {
    title: "Videoner - Download Rutube Videos",
    description:
      "Download Rutube videos in high quality formats. Fast, free, and easy to use.",
    url: "https://videoner.download/rutube",
    siteName: "Videoner",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Videoner - Download Rutube Videos",
    description:
      "Download Rutube videos in high quality formats. Fast, free, and easy to use.",
  },
  alternates: {
    canonical: "https://videoner.download/rutube",
  },
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <Page platform="rutube" />
    </Suspense>
  );
}
