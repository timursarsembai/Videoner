import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";

export const metadata: Metadata = {
  title: "Videoner - Download VK Videos & Clips",
  description:
    "Download VK videos and clips in high quality formats. Fast, free, and easy to use.",
  keywords:
    "VK downloader, VK video downloader, download VK videos, VK to MP4, HD VK downloader, VK saver, VK video saver, VKontakte downloader",
  robots: "index, follow",
  openGraph: {
    title: "Videoner - Download VK Videos & Clips",
    description:
      "Download VK videos and clips in high quality formats. Fast, free, and easy to use.",
    url: "https://www.vidyoza.com/vk",
    siteName: "Videoner",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Videoner - Download VK Videos & Clips",
    description:
      "Download VK videos and clips in high quality formats. Fast, free, and easy to use.",
  },
  alternates: {
    canonical: "https://www.vidyoza.com/vk",
  },
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <Page platform="vk" />
    </Suspense>
  );
}
