import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { BOSSES } from "@/lib/data/boss-guides";
import type { Locale } from "@/i18n/routing";

export default async function BossGuidesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("BossGuides");

  return (
    <div className="relative min-h-[60vh]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image
          src="/bosses/raid_banner_bg.png"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/80 to-slate-950" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">
            {t("title")}
          </h1>
          <p className="text-slate-400">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {BOSSES.map((boss) => (
            <Link
              key={boss.slug}
              href={`/boss-guides/${boss.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 shadow-lg shadow-black/40 transition-all hover:border-amber-500/60 hover:shadow-amber-500/10"
            >
              {/* Boss image */}
              <div className="relative h-72 w-full overflow-hidden bg-slate-900">
                <Image
                  src={boss.image}
                  alt={boss.slug}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Name bar */}
              <div className="border-t border-slate-700/60 px-4 py-3 text-center">
                <span className="text-sm font-semibold uppercase tracking-widest text-slate-200 group-hover:text-amber-400 transition-colors">
                  {boss.name[locale]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
