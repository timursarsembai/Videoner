import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";
import JsonLd from "@/components/common/JsonLd";

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

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Videoner TikTok Downloader",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  url: "https://videoner.download/tiktok",
  description:
    "Download TikTok videos without watermark in high quality formats. Fast, free, and easy to use. Support for all TikTok content types.",
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
      name: "TikTok",
      item: "https://videoner.download/tiktok",
    },
  ],
};

export default function page() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={null}>
        <Page platform="tiktok" />
      </Suspense>
    </>
  );
}
