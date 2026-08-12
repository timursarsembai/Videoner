import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type DownloadItem = {
  position: number;
  filename: string;
  kind: "VIDEO" | "PHOTO" | "AUDIO";
  width?: number;
  height?: number;
  duration?: number;
  fileSize?: number;
  downloadUrl: string;
};

export type Platform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "vimeo"
  | "vk"
  | "rutube"
  | "okru"
  | "pinterest"
  | "threads";
