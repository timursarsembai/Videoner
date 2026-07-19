import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import GoogleAnalytics from "@/components/layout/GoogleAnalytics";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Vidyoza - Universal Video Downloader",
  description:
    "Vidyoza is the ultimate video downloader for YouTube, Facebook, Instagram, TikTok, Twitter, and more. Save videos and audio in high-quality formats effortlessly.",
  keywords:
    "video downloader, YouTube downloader, Facebook video downloader, TikTok video downloader, Instagram video downloader, Twitter video saver, universal video downloader, download videos online, HD video downloader, multi-format downloader",
  robots: "index, follow",
  openGraph: {
    title: "Vidyoza - Universal Video Downloader",
    description:
      "Download videos and audio from all popular platforms, including YouTube, Facebook, Instagram, TikTok, and Twitter. Vidyoza supports multiple formats and resolutions.",
    url: "https://www.vidyoza.com",
    siteName: "Vidyoza",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vidyoza - Universal Video Downloader",
    description:
      "Save videos and audio from YouTube, Facebook, Instagram, TikTok, Twitter, and more with Vidyoza. Fast, easy, and versatile.",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased", spaceGrotesk.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="bottom-right" />
        </ThemeProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
