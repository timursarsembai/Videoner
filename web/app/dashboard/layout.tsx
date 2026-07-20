import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics — Videoner",
  robots: "noindex, nofollow",
};

export default function AnalyticsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
