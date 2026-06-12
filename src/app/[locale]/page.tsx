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
    <div className="flex flex-col items-center gap-12 pb-16 text-center">
      {/* Hero with game artwork (upload public/hero.jpg to enable the image) */}
      <div
        className="relative -mx-4 flex w-[calc(100%+2rem)] flex-col items-center justify-center gap-4 overflow-hidden rounded-b-3xl bg-cover bg-center px-4 py-24 sm:py-32"
        style={{ backgroundImage: "url(/hero.jpg)" }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/40 to-slate-950/90" />
        <h1 className="relative bg-gradient-to-b from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] sm:text-6xl">
          {t("title")}
        </h1>
        <p className="relative text-lg font-medium text-slate-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          {t("subtitle")}
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid w-full gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="group">
            <div
              className={
                "relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 p-6 shadow-lg shadow-black/40 transition-all duration-300 " +
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
