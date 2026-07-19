import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Platform =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | "twitter";
