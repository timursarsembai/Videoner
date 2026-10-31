import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { LanguageProvider } from "@/lib/i18n/context";
import { AuthProvider } from "@/lib/auth/context";
import { LANGUAGES, Language, isRtl } from "@/lib/i18n/translations";
import { notFound } from "next/navigation";
import React from "react";

export function generateStaticParams() {
  return LANGUAGES.map((locale) => ({ locale }));
}

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  if (!(LANGUAGES as readonly string[]).includes(locale)) {
    notFound();
  }

  return (
    <LanguageProvider initialLanguage={locale as Language}>
      <AuthProvider>
        {/* Арабский пишется справа налево: dir здесь, чтобы SSR сразу отдал
            зеркальную вёрстку (на <html> его ставит LanguageProvider уже в
            браузере — корневой layout общий для всех локалей). */}
        <main dir={isRtl(locale as Language) ? "rtl" : "ltr"}>
          <Navbar />
          {children}
          <Footer />
        </main>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default Layout;
