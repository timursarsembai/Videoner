import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";
import JsonLd from "@/components/common/JsonLd";

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
    url: "https://videoner.download/vk",
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
    canonical: "https://videoner.download/vk",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Videoner VK Downloader",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  url: "https://videoner.download/vk",
  description:
    "Download VK videos and clips in high quality formats. Fast, free, and easy to use.",
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
      name: "VK",
      item: "https://videoner.download/vk",
    },
  ],
};

export default function page() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={null}>
        <Page platform="vk" />
      </Suspense>
    </>
  );
}
