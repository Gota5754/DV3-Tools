import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookImage, Swords, Trophy } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface FeatureCard {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  available: boolean;
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  const cards: FeatureCard[] = [
    {
      href: "/stickers",
      icon: <BookImage className="size-8" />,
      title: "Sticker Book",
      description: t("stickersCard"),
      available: true,
    },
    {
      href: "/tier-list",
      icon: <Trophy className="size-8" />,
      title: "Tier List",
      description: t("tierListCard"),
      available: false,
    },
    {
      href: "/boss-guides",
      icon: <Swords className="size-8" />,
      title: "Boss Guides",
      description: t("bossCard"),
      available: false,
    },
  ];

  return (
    <div className="flex flex-col items-center gap-12 py-16 text-center">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="bg-gradient-to-b from-amber-300 to-amber-600 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
          {t("title")}
        </h1>
        <p className="text-lg text-slate-400">{t("subtitle")}</p>
      </div>

      {/* Feature cards */}
      <div className="grid w-full gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group">
            <div
              className={
                "relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 p-6 transition-all duration-300 " +
                (card.available
                  ? "hover:-translate-y-1.5 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10"
                  : "hover:-translate-y-1.5 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 opacity-70")
              }
            >
              {!card.available && (
                <span className="absolute top-3 right-3 rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                  Soon
                </span>
              )}
              <div
                className={
                  "rounded-xl p-3 " +
                  (card.available ? "bg-amber-500/10 text-amber-400" : "bg-indigo-500/10 text-indigo-400")
                }
              >
                {card.icon}
              </div>
              <div className="space-y-1">
                <p className="font-bold tracking-wide text-slate-100">{card.title}</p>
                <p className="text-sm text-slate-400">{card.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Button
        asChild
        size="lg"
        className="bg-amber-500 px-8 text-slate-950 hover:bg-amber-400"
      >
        <Link href="/stickers">{t("getStarted")}</Link>
      </Button>
    </div>
  );
}
