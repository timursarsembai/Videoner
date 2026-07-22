import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "Videoner - Download Rutube Videos";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return renderOgImage("Download Rutube Videos");
}
