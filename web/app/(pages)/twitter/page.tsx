import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";
import JsonLd from "@/components/common/JsonLd";

export const metadata: Metadata = {
  title: "Videoner - Download Twitter Videos",
  description:
    "Download Twitter videos and clips in high quality formats. Fast, free, and easy to use. Support for tweets, spaces, and fleets.",
  keywords:
    "Twitter video downloader, Twitter downloader, download Twitter videos, Twitter to MP4, HD Twitter downloader, Twitter video saver, Twitter spaces downloader",
  robots: "index, follow",
  openGraph: {
    title: "Videoner - Download Twitter Videos",
    description:
      "Download Twitter videos and clips in high quality formats. Fast, free, and easy to use. Support for tweets, spaces, and fleets.",
    url: "https://videoner.download/twitter",
    siteName: "Videoner",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Videoner - Download Twitter Videos",
    description:
      "Download Twitter videos and clips in high quality formats. Fast, free, and easy to use. Support for tweets, spaces, and fleets.",
  },
  alternates: {
    canonical: "https://videoner.download/twitter",
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Videoner Twitter Downloader",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  url: "https://videoner.download/twitter",
  description:
    "Download Twitter videos and clips in high quality formats. Fast, free, and easy to use. Support for tweets, spaces, and fleets.",
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
      name: "Twitter",
      item: "https://videoner.download/twitter",
    },
  ],
};

export default function page() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={null}>
        <Page platform="twitter" />
      </Suspense>
    </>
  );
}
