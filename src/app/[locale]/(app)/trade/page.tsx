import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { TradeMatchCard } from "@/components/trade/trade-match-card";

export default async function TradePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Trade");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("ign")
    .eq("id", user!.id)
    .single();

  const { data: matches } = await supabase.rpc("get_trade_matches");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-3xl font-extrabold tracking-wide text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-slate-400">{t("subtitle")}</p>
      </div>

      {!profile?.ign && (
        <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/60 p-4 text-sm text-slate-400">
          <Link href="/profile" className="text-amber-400 underline-offset-4 hover:underline">
            {t("needIgn")}
          </Link>
        </div>
      )}

      {!matches?.length ? (
        <p className="text-slate-500">{t("noMatches")}</p>
      ) : (
        <div className="grid gap-6">
          {matches.map((match) => (
            <TradeMatchCard key={match.partner_id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
