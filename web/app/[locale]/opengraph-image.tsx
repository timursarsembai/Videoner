import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "Videoner - Universal Video Downloader";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return renderOgImage("Universal Video Downloader");
}
