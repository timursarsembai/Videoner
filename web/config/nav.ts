import { Downloader, NavConfig } from "@/types/nav";
import { Home, Download, Gem, CreditCard } from "lucide-react";
import { downloaders } from "./downloaders";

export const navConfig: NavConfig = {
  mainNav: [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Downloaders",
      href: "#",
      icon: Download,
      subMenu: downloaders,
    },
  ],
};
