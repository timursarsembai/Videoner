import { LucideIcon } from "lucide-react";
import { Platform } from ".";

export interface NavItem {
  name: string;
  href: string;
  description?: string;
  isExternal?: boolean;
  icon?: LucideIcon;
  logo?: string;
  subMenu?: Downloader[] | NavItem[];
}

export interface NavConfig {
  mainNav: NavItem[];
  sideNav?: NavItem[];
}

export interface Downloader {
  name: string;
  value: Platform;
  href: string;
  description: string;
  isComingSoon: boolean;
  isUrlValid: (url: string) => boolean;
  icon?: LucideIcon;
  logo?: string;
}
