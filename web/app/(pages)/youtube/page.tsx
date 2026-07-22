import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";
import JsonLd from "@/components/common/JsonLd";

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

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Videoner YouTube Downloader",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  url: "https://videoner.download/youtube",
  description:
    "Download YouTube videos, Shorts, and audio in high quality formats. Fast, free, and easy to use. Support for 8K, 4K, HD quality and MP3 audio.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://videoner.download",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "YouTube",
      item: "https://videoner.download/youtube",
    },
  ],
};

export default function page() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={null}>
        <Page platform="youtube" />
      </Suspense>
    </>
  );
}
