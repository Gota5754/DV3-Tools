import { getTranslations, setRequestLocale } from "next-intl/server";

// Placeholder — future module: one page per World Boss (e.g. /boss-guides/hydra).
export default async function BossGuidePage({
  params,
}: {
  params: Promise<{ locale: string; boss: string }>;
}) {
  const { locale, boss } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("BossGuides");

  return (
    <div className="space-y-2 py-12 text-center">
      <h1 className="text-2xl font-bold capitalize">{boss}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
    </div>
  );
}
