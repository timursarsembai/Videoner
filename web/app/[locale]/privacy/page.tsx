import { LegalPage, legalMetadata, legalStaticParams } from "@/lib/legal/page";

export const generateStaticParams = legalStaticParams;
export const generateMetadata = legalMetadata("privacy");

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LegalPage slug="privacy" params={params} />;
}
