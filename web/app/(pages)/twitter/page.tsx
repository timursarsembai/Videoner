import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";

export const metadata: Metadata = {
  title: "Vidyoza - Download Twitter Videos",
  description:
    "Download Twitter videos and clips in high quality formats. Fast, free, and easy to use. Support for tweets, spaces, and fleets.",
  keywords:
    "Twitter video downloader, Twitter downloader, download Twitter videos, Twitter to MP4, HD Twitter downloader, Twitter video saver, Twitter spaces downloader",
  robots: "index, follow",
  openGraph: {
    title: "Vidyoza - Download Twitter Videos",
    description:
      "Download Twitter videos and clips in high quality formats. Fast, free, and easy to use. Support for tweets, spaces, and fleets.",
    url: "https://www.vidyoza.com/twitter",
    siteName: "Vidyoza",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidyoza - Download Twitter Videos",
    description:
      "Download Twitter videos and clips in high quality formats. Fast, free, and easy to use. Support for tweets, spaces, and fleets.",
  },
  alternates: {
    canonical: "https://www.vidyoza.com/twitter",
  },
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <Page
        platform="twitter"
        news="Support for tweets and spaces"
        title={["Twitter Videos", "Downloader"]}
        description="Download Twitter videos and clips in high quality formats. Fast, free, and easy to use. Support for tweets, spaces, and fleets."
        placeholder="Paste Twitter URL here..."
      />
    </Suspense>
  );
}
