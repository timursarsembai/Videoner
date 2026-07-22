import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";
import JsonLd from "@/components/common/JsonLd";

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

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Videoner Vimeo Downloader",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  url: "https://videoner.download/vimeo",
  description:
    "Download Vimeo videos in high quality formats. Fast, free, and easy to use.",
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
      name: "Vimeo",
      item: "https://videoner.download/vimeo",
    },
  ],
};

export default function page() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={null}>
        <Page platform="vimeo" />
      </Suspense>
    </>
  );
}
