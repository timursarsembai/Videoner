import { renderOgImage, ogImageSize, ogImageContentType } from "@/lib/og";

export const alt = "Videoner - Download Pinterest Videos";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return renderOgImage("Download Pinterest Videos");
}
