import { isFacebookUrl, isInstagramUrl, isTikTokUrl, isTwitterUrl, isYoutubeUrl } from "@/lib/validations/url";
import { Downloader } from "@/types/nav";

export const downloaders: Downloader[] = [
  {
    name: "YouTube",
    value: "youtube",
    href: "/youtube",
    description: "Download videos from YouTube in HD quality",
    logo: "/images/logos/youtube.svg",
    isComingSoon: false,
    isUrlValid: isYoutubeUrl,
  },
  {
    name: "Facebook",
    value: "facebook",
    href: "/facebook",
    description: "Save videos from Facebook posts and reels",
    logo: "/images/logos/facebook.svg",
    isComingSoon: false,
    isUrlValid: isFacebookUrl,
  },
  {
    name: "Instagram",
    value: "instagram",
    href: "/instagram",
    description: "Download Instagram reels, stories, and posts",
    logo: "/images/logos/instagram.svg",
    isComingSoon: false,
    isUrlValid: isInstagramUrl,
  },
  {
    name: "TikTok",
    value: "tiktok",
    href: "/tiktok",
    description: "Download TikTok videos without watermark",
    logo: "/images/logos/tiktok.svg",
    isComingSoon: false,
    isUrlValid: isTikTokUrl,
  },
  {
    name: "Twitter",
    value: "twitter",
    href: "/twitter",
    description: "Download Twitter videos",
    logo: "/images/logos/twitter.svg",
    isComingSoon: false,
    isUrlValid: isTwitterUrl,
  },
];

