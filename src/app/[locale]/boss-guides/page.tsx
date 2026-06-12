import { getTranslations, setRequestLocale } from "next-intl/server";

// Placeholder — future module: index of the 3 World Boss guides.
// Individual guides will live at /boss-guides/[boss].
export default async function BossGuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("BossGuides");

  return (
    <div className="space-y-2 py-12 text-center">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
    </div>
  );
}
