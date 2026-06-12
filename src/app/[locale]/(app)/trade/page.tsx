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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("ign")
    .eq("id", user!.id)
    .single();

  const { data: matches } = await supabase.rpc("get_trade_matches");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      {!profile?.ign && (
        <p className="rounded-md border border-dashed p-4 text-sm">
          <Link href="/profile" className="underline underline-offset-4">
            {t("needIgn")}
          </Link>
        </p>
      )}

      {!matches?.length ? (
        <p className="text-muted-foreground">{t("noMatches")}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((match) => (
            <TradeMatchCard key={match.partner_id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
