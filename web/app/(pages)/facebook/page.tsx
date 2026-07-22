import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";
import JsonLd from "@/components/common/JsonLd";

export const metadata: Metadata = {
  title: "Videoner - Download Facebook Videos",
  description:
    "Download Facebook videos in high quality formats. Fast, free, and easy to use. Support for 8K, 4K, HD quality and MP3 audio.",
  keywords:
    "YouTube downloader, YouTube Shorts downloader, video downloader, YouTube to MP3, YouTube to MP4, download YouTube Shorts, YouTube video downloader, HD video downloader, 8K video downloader, YouTube audio downloader",
  robots: "index, follow",
  openGraph: {
    title: "Videoner - Download Facebook Videos",
    description:
      "Download Facebook videos in high quality formats. Fast, free, and easy to use. Support for 8K, 4K, HD quality and MP3 audio.",
    url: "https://videoner.download/facebook",
    siteName: "Videoner",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Videoner - Download Facebook Videos",
    description:
      "Download Facebook videos in high quality formats. Fast, free, and easy to use. Support for 8K, 4K, HD quality and MP3 audio.",
  },
  alternates: {
    canonical: "https://videoner.download/facebook",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Videoner Facebook Downloader",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  url: "https://videoner.download/facebook",
  description:
    "Download Facebook videos in high quality formats. Fast, free, and easy to use. Support for 8K, 4K, HD quality and MP3 audio.",
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
      name: "Facebook",
      item: "https://videoner.download/facebook",
    },
  ],
};

export default function page() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={null}>
        <Page platform="facebook" />
      </Suspense>
    </>
  );
}
