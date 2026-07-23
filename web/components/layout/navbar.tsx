"use client";

import { navConfig } from "@/config/nav";
import { useLanguage } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types/nav";
import { Platform } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { LanguageToggle } from "../ui/language-toggle";
import { ModeToggle } from "../ui/theme-toggle";
import { UserMenu } from "./UserMenu";
import type { TranslationKey } from "@/lib/i18n/context";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { t, language } = useLanguage();

  // Единственное место, обрабатывающее возврат с oauth.telegram.org
  // (#tgAuthResult=base64(JSON) во фрагменте URL, не query-параметры —
  // см. TelegramLoginWidget.tsx). Navbar монтируется один раз на страницу,
  // в отличие от UserMenu (десктоп+мобильная версии одновременно в DOM).
  // После входа — полный редирект на чистый URL, чтобы оба экземпляра
  // UserMenu синхронно перечитали свежую сессию, а не гадали о состоянии гонки.
  useEffect(() => {
    const rawHash = window.location.hash;
    if (!rawHash.startsWith("#tgAuthResult=")) return;

    const cleanUrl = window.location.pathname + window.location.search;
    const encoded = rawHash.slice("#tgAuthResult=".length);

    (async () => {
      try {
        const padded = encoded + "=".repeat((4 - (encoded.length % 4)) % 4);
        const decoded = JSON.parse(atob(padded));
        if (decoded && typeof decoded === "object" && decoded.hash) {
          await fetch("/api/auth/telegram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(decoded),
          });
        }
      } catch (error) {
        console.error("Failed to process Telegram auth result:", error);
      } finally {
        window.location.replace(cleanUrl);
      }
    })();
  }, []);

  const handleDropdownClick = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  // Метки главного меню переводим по href (идентичность в state/ключах — по name).
  const navLabel = (item: NavItem) =>
    item.href === "/" ? t("nav.home") : t("nav.downloaders");

  // Названия загрузчиков — имена собственные (оставляем), описания переводим по платформе.
  const subLabel = (subItem: NavItem) =>
    "value" in subItem
      ? t(`platforms.${(subItem as { value: Platform }).value}.description` as TranslationKey)
      : subItem.description;

  const NavLink = ({ item }: { item: NavItem }) => {
    if (item.subMenu?.length) {
      return (
        <div className="relative group">
          <button
            onClick={() => handleDropdownClick(item.name)}
            className="flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground/90"
          >
            {item.icon && <item.icon className="h-4 w-4" />}
            {navLabel(item)}
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                activeDropdown === item.name && "rotate-180"
              )}
            />
          </button>
          <div className="absolute left-0 top-full hidden w-[380px] pt-2 group-hover:block">
            <div className="max-h-[75vh] overflow-y-auto rounded-lg border bg-background p-3 shadow-lg backdrop-blur-sm">
              <div className="grid gap-2">
                {item.subMenu.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={localizedHref(language, subItem.href)}
                    className={cn(
                      "grid grid-cols-[32px_1fr] items-center gap-4 rounded-md p-3 text-sm transition-colors",
                      "isComingSoon" in subItem && subItem.isComingSoon
                        ? "cursor-not-allowed opacity-60"
                        : "hover:bg-primary/10"
                    )}
                    onClick={(e) => {
                      if ("isComingSoon" in subItem && subItem.isComingSoon) {
                        e.preventDefault();
                      }
                    }}
                  >
                    {subItem.icon && (
                      <subItem.icon className="h-8 w-8 text-foreground/60" />
                    )}
                    {subItem.logo && (
                      <Image
                        src={subItem.logo}
                        alt={subItem.name}
                        width={32}
                        height={32}
                        className="h-8 w-8"
                      />
                    )}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground/90">
                          {subItem.name}
                        </span>
                        {"isComingSoon" in subItem && subItem.isComingSoon && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {t("nav.comingSoon")}
                          </span>
                        )}
                      </div>
                      {subItem.description && (
                        <span className="line-clamp-2 text-sm text-foreground/60">
                          {subLabel(subItem)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        href={localizedHref(language, item.href)}
        className={cn(
          "flex items-center gap-1.5 text-sm font-medium transition-colors",
          item.href === "/"
            ? "text-foreground/90"
            : "text-foreground/60 hover:text-foreground/90"
        )}
      >
        {item.icon && <item.icon className="h-4 w-4" />}
        {navLabel(item)}
      </Link>
    );
  };

  const MobileNavLink = ({ item }: { item: NavItem }) => {
    if (item.subMenu?.length) {
      return (
        <div>
          <button
            onClick={() => handleDropdownClick(item.name)}
            className="flex w-full items-center justify-between py-2 text-xl font-medium"
          >
            <div className="flex items-center gap-2">
              {item.icon && <item.icon className="h-6 w-6" />}
              {navLabel(item)}
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                activeDropdown === item.name && "rotate-180"
              )}
            />
          </button>

          <div
            className={cn(
              "grid transition-all duration-300 ease-in-out",
              activeDropdown === item.name
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            )}
          >
            <div className="overflow-hidden">
              <div className="space-y-4 py-4 pl-8">
                {item.subMenu.map((subItem, index) => (
                  <motion.div
                    key={subItem.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{
                      opacity: activeDropdown === item.name ? 1 : 0,
                      x: activeDropdown === item.name ? 0 : -20,
                      transition: {
                        duration: 0.3,
                        delay: index * 0.1,
                      },
                    }}
                  >
                    <Link
                      href={localizedHref(language, subItem.href)}
                      className={cn(
                        "flex items-start gap-4",
                        "isComingSoon" in subItem && subItem.isComingSoon
                          ? "cursor-not-allowed opacity-60"
                          : ""
                      )}
                      onClick={(e) => {
                        if ("isComingSoon" in subItem && subItem.isComingSoon) {
                          e.preventDefault();
                        } else {
                          setIsOpen(false);
                        }
                      }}
                    >
                      {subItem.logo && (
                        <Image
                          src={subItem.logo}
                          alt={subItem.name}
                          width={40}
                          height={40}
                          className="h-10 w-10"
                        />
                      )}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-medium text-foreground/90">
                            {subItem.name}
                          </span>
                          {"isComingSoon" in subItem &&
                            subItem.isComingSoon && (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {t("nav.comingSoon")}
                              </span>
                            )}
                        </div>
                        {subItem.description && (
                          <span className="text-sm text-foreground/60">
                            {subLabel(subItem)}
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        href={localizedHref(language, item.href)}
        className="flex items-center gap-2 py-2 text-xl font-medium"
        onClick={() => setIsOpen(false)}
      >
        {item.icon && <item.icon className="h-6 w-6" />}
        {navLabel(item)}
      </Link>
    );
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 z-50 w-screen border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
          "data-[scroll-locked=true]:mr-[var(--removed-body-scroll-bar-size)]"
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href={localizedHref(language, "/")} className="flex items-center gap-2">
              <Image
                src="/images/videoner-website-logo.webp"
                alt="Videoner"
                width={30}
                height={30}
                className="h-[30px] w-[30px]"
              />
              <span className="text-xl font-semibold">Videoner</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-6 md:flex">
            {navConfig.mainNav.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <UserMenu />
            <LanguageToggle />
            <ModeToggle />
          </div>

          {/* Mobile: компактная иконка входа/аккаунта — раньше была спрятана в
              выпадающем меню и была слишком мелкой, теперь всегда в шапке. */}
          <div className="flex items-center gap-1 md:hidden">
            <UserMenu compact />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 h-12 w-12 p-0"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col justify-center items-center">
                <span
                  className={cn(
                    "absolute h-0.5 w-6 bg-foreground transition-all duration-300",
                    isOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
                  )}
                />
                <span
                  className={cn(
                    "absolute h-0.5 w-6 bg-foreground transition-all duration-300",
                    isOpen ? "opacity-0" : "opacity-100"
                  )}
                />
                <span
                  className={cn(
                    "absolute h-0.5 w-6 bg-foreground transition-all duration-300",
                    isOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
                  )}
                />
              </div>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed right-0 top-0 h-screen w-full max-w-md border-l bg-background p-6 shadow-lg pt-20"
            >
              <div className="flex h-full flex-col">
                <div className="flex-1 space-y-4">
                  {navConfig.mainNav.map((item) => (
                    <MobileNavLink key={item.href} item={item} />
                  ))}
                </div>

                <div className="flex flex-col gap-3 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/60">
                      {t("nav.language")}
                    </span>
                    <LanguageToggle />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/60">
                      {t("nav.switchTheme")}
                    </span>
                    <ModeToggle />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
