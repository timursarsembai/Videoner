import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";

export const metadata: Metadata = {
  title: "Vidyoza - Download Instagram Videos & Reels",
  description:
    "Download Instagram videos, reels, and stories in high quality formats. Fast, free, and easy to use. Support for posts, stories, and IGTV.",
  keywords:
    "Instagram downloader, Instagram Reels downloader, video downloader, Instagram to MP4, download Instagram Reels, Instagram video downloader, HD video downloader, Instagram story downloader, IGTV downloader",
  robots: "index, follow",
  openGraph: {
    title: "Vidyoza - Download Instagram Videos & Reels",
    description:
      "Download Instagram videos, reels, and stories in high quality formats. Fast, free, and easy to use. Support for posts, stories, and IGTV.",
    url: "https://www.vidyoza.com/instagram",
    siteName: "Vidyoza",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidyoza - Download Instagram Videos & Reels",
    description:
      "Download Instagram videos, reels, and stories in high quality formats. Fast, free, and easy to use. Support for posts, stories, and IGTV.",
  },
  alternates: {
    canonical: "https://www.vidyoza.com/instagram",
  },
};

export default function page() {
  return (
    <Suspense fallback={null}>
      <Page
        platform="instagram"
        news="Support for reels, stories, and IGTV"
        title={["Instagram Videos", "& Reels Downloader"]}
        description="Download Instagram videos, reels, and stories in high quality formats. Fast, free, and easy to use. Support for posts, stories, and IGTV."
        placeholder="Paste Instagram URL here..."
      />
    </Suspense>
  );
}
