import { LegalPage, legalMetadata, legalStaticParams } from "@/lib/legal/page";

export const generateStaticParams = legalStaticParams;
export const generateMetadata = legalMetadata("terms");

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return <LegalPage slug="terms" params={params} />;
}
