import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, BookOpen } from "lucide-react";
import { getBoss } from "@/lib/data/boss-guides";
import { DragonCard } from "@/components/boss-guides/dragon-detail";
import type { Locale } from "@/i18n/routing";
import type { DragonTier } from "@/lib/data/boss-guides";

export default async function BossGuidePage({
  params,
}: {
  params: Promise<{ locale: Locale; boss: string }>;
}) {
  const { locale, boss: bossSlug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("BossGuides");

  const boss = getBoss(bossSlug);
  if (!boss) notFound();

  const guideText = locale === "fr" ? boss.guide.fr : boss.guide.en;
  const bossName = boss.name[locale];

  const tiers: { key: DragonTier; label: string; accent: string }[] = [
    { key: "premium", label: t("tierPremium"), accent: "text-amber-400" },
    { key: "mid",     label: t("tierMid"),     accent: "text-indigo-400" },
    { key: "low",     label: t("tierLow"),      accent: "text-slate-400" },
  ];

  const dragonLabels = {
    runes: t("labelRunes"),
    stats: t("labelStats"),
    orbs:  t("labelOrbs"),
    close: t("labelClose"),
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">
      {/* Back link */}
      <Link
        href="/boss-guides"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition-colors"
      >
        <ChevronLeft className="size-4" /> {t("backToList")}
      </Link>

      {/* Boss hero */}
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 shadow-lg shadow-black/40">
        <div className="relative h-64 w-full bg-slate-900">
          <Image
            src={boss.image}
            alt={bossName}
            fill
            className="object-contain p-6"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-800/80 to-transparent" />
          <h1 className="absolute bottom-4 left-5 text-2xl font-bold text-slate-100">
            {bossName}
          </h1>
        </div>
      </div>

      {/* Guide text */}
      {guideText && guideText !== "Guide à venir." && guideText !== "Guide coming soon." && (
        <section className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-slate-400">
            <BookOpen className="size-4" /> {t("guideTitle")}
          </h2>
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 px-5 py-4 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
            {guideText}
          </div>
        </section>
      )}

      {/* Dragon recommendations */}
      {boss.dragons.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
            {t("recommendedDragons")}
          </h2>

          {tiers.map(({ key, label, accent }) => {
            const dragons = boss.dragons.filter((d) => d.tier === key);
            if (dragons.length === 0) return null;
            return (
              <div key={key} className="space-y-2">
                <h3 className={`text-xs font-semibold uppercase tracking-widest ${accent}`}>
                  {label}
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {dragons.map((dragon) => (
                    <DragonCard key={dragon.name} dragon={dragon} labels={dragonLabels} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      {boss.dragons.length === 0 && (
        <p className="text-slate-500 text-sm">{t("noDragonsYet")}</p>
      )}
    </div>
  );
}
