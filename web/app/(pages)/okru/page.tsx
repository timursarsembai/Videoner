import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";
import JsonLd from "@/components/common/JsonLd";

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

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Videoner OK.ru Downloader",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  url: "https://videoner.download/okru",
  description:
    "Download OK.ru (Odnoklassniki) videos in high quality formats. Fast, free, and easy to use.",
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
      name: "OK.ru",
      item: "https://videoner.download/okru",
    },
  ],
};

export default function page() {
  return (
    <>
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={null}>
        <Page platform="okru" />
      </Suspense>
    </>
  );
}
