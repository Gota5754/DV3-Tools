import { getTranslations, setRequestLocale, getLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { TradeOffersManager } from "@/components/trade/trade-offers-manager";
import type { Locale } from "@/i18n/routing";

export default async function MyTradesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("MyTrades");
  const currentLocale = (await getLocale()) as Locale;

  const supabase = await createClient();
  const { data: offers } = await supabase.rpc("get_my_trade_offers");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-3xl font-extrabold tracking-wide text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)] sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-1 text-slate-400">{t("subtitle")}</p>
      </div>

      <TradeOffersManager
        offers={offers ?? []}
        locale={currentLocale}
        labels={{
          incoming: t("incoming"),
          toConfirm: t("toConfirm"),
          outgoing: t("outgoing"),
          history: t("history"),
          empty: t("empty"),
          iGive: t("iGive"),
          iReceive: t("iReceive"),
          accept: t("accept"),
          reject: t("reject"),
          cancel: t("cancel"),
          confirm: t("confirm"),
          waitingPartner: t("waitingPartner"),
          youConfirmed: t("youConfirmed"),
          partnerConfirmed: t("partnerConfirmed"),
          confirmHint: t("confirmHint"),
          statusPending: t("statusPending"),
          statusAccepted: t("statusAccepted"),
          statusCompleted: t("statusCompleted"),
          statusRejected: t("statusRejected"),
          statusCancelled: t("statusCancelled"),
        }}
      />
    </div>
  );
}
