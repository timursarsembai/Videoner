import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";
import JsonLd from "@/components/common/JsonLd";

export const metadata: Metadata = {
  title: "Videoner - Download Instagram Videos & Reels",
  description:
    "Download Instagram videos, reels, and stories in high quality formats. Fast, free, and easy to use. Support for posts, stories, and IGTV.",
  keywords:
    "Instagram downloader, Instagram Reels downloader, video downloader, Instagram to MP4, download Instagram Reels, Instagram video downloader, HD video downloader, Instagram story downloader, IGTV downloader",
  robots: "index, follow",
  openGraph: {
    title: "Videoner - Download Instagram Videos & Reels",
    description:
      "Download Instagram videos, reels, and stories in high quality formats. Fast, free, and easy to use. Support for posts, stories, and IGTV.",
    url: "https://videoner.download/instagram",
    siteName: "Videoner",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Videoner - Download Instagram Videos & Reels",
    description:
      "Download Instagram videos, reels, and stories in high quality formats. Fast, free, and easy to use. Support for posts, stories, and IGTV.",
  },
  alternates: {
    canonical: "https://videoner.download/instagram",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Videoner Instagram Downloader",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  url: "https://videoner.download/instagram",
  description:
    "Download Instagram videos, reels, and stories in high quality formats. Fast, free, and easy to use. Support for posts, stories, and IGTV.",
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
      name: "Instagram",
      item: "https://videoner.download/instagram",
    },
  ],
};

export default function page() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={null}>
        <Page platform="instagram" />
      </Suspense>
    </>
  );
}
