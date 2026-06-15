"use client";

import { useState } from "react";
import { Check, X, Handshake, Clock, CheckCheck } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StickerThumb } from "./sticker-thumb";
import { stickerStars } from "@/lib/data/stickers";
import type { Locale } from "@/i18n/routing";
import type { MyTradeOffer } from "@/lib/supabase/types";

export interface ManagerLabels {
  incoming: string;
  toConfirm: string;
  outgoing: string;
  history: string;
  empty: string;
  iGive: string;
  iReceive: string;
  accept: string;
  reject: string;
  cancel: string;
  confirm: string;
  waitingPartner: string;
  youConfirmed: string;
  partnerConfirmed: string;
  confirmHint: string;
  statusPending: string;
  statusAccepted: string;
  statusCompleted: string;
  statusRejected: string;
  statusCancelled: string;
}

function totalStars(ids: number[]): number {
  return ids.reduce((sum, id) => sum + stickerStars(id), 0);
}

function StickerLine({
  ids,
  locale,
  label,
  accent,
}: {
  ids: number[];
  locale: Locale;
  label: string;
  accent: string;
}) {
  return (
    <div>
      <p className={`mb-1.5 text-[10px] font-semibold uppercase tracking-widest ${accent}`}>
        {label} <span className="text-slate-600">— ⭐ {totalStars(ids)}</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {ids.map((id) => (
          <StickerThumb key={id} id={id} locale={locale} />
        ))}
      </div>
    </div>
  );
}

function OfferCard({
  offer,
  locale,
  labels,
}: {
  offer: MyTradeOffer;
  locale: Locale;
  labels: ManagerLabels;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const iGive = offer.i_am_sender ? offer.offered_ids : offer.requested_ids;
  const iReceive = offer.i_am_sender ? offer.requested_ids : offer.offered_ids;
  const iConfirmed = offer.i_am_sender ? offer.from_confirmed : offer.to_confirmed;
  const partnerConfirmed = offer.i_am_sender ? offer.to_confirmed : offer.from_confirmed;

  async function run(fn: () => PromiseLike<{ error: unknown }>) {
    setBusy(true);
    const { error } = await fn();
    if (error) setBusy(false);
    else router.refresh();
  }

  const sb = createClient();
  const accept = () => run(() => sb.rpc("respond_to_trade", { p_offer_id: offer.id, p_accept: true }));
  const reject = () => run(() => sb.rpc("respond_to_trade", { p_offer_id: offer.id, p_accept: false }));
  const cancel = () => run(() => sb.rpc("cancel_trade", { p_offer_id: offer.id }));
  const confirm = () => run(() => sb.rpc("confirm_trade", { p_offer_id: offer.id }));

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 shadow-lg shadow-black/40">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-700/60 px-5 py-3">
        <span className="font-bold text-slate-100">{offer.partner_ign}</span>
        {offer.partner_uid && (
          <span className="rounded-md bg-slate-700/60 px-2 py-0.5 font-mono text-xs text-slate-300">
            {offer.partner_uid}
          </span>
        )}
        {offer.partner_discord && (
          <span className="text-xs text-indigo-400">@{offer.partner_discord}</span>
        )}
      </div>

      <div className="space-y-3 px-5 py-4">
        <StickerLine ids={iReceive} locale={locale} label={labels.iReceive} accent="text-amber-400" />
        <Separator className="bg-slate-700/60" />
        <StickerLine ids={iGive} locale={locale} label={labels.iGive} accent="text-indigo-400" />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-700/60 px-5 py-3">
        {offer.status === "pending" && !offer.i_am_sender && (
          <>
            <Button size="sm" onClick={accept} disabled={busy} className="gap-1 bg-emerald-500 text-slate-950 hover:bg-emerald-400">
              <Check className="size-4" /> {labels.accept}
            </Button>
            <Button size="sm" variant="ghost" onClick={reject} disabled={busy} className="gap-1 text-red-400 hover:bg-red-500/10 hover:text-red-300">
              <X className="size-4" /> {labels.reject}
            </Button>
          </>
        )}

        {offer.status === "pending" && offer.i_am_sender && (
          <>
            <span className="flex items-center gap-1.5 text-sm text-slate-400">
              <Clock className="size-4" /> {labels.statusPending}
            </span>
            <Button size="sm" variant="ghost" onClick={cancel} disabled={busy} className="gap-1 text-red-400 hover:bg-red-500/10 hover:text-red-300">
              <X className="size-4" /> {labels.cancel}
            </Button>
          </>
        )}

        {offer.status === "accepted" && (
          <>
            {iConfirmed ? (
              <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                <CheckCheck className="size-4" /> {labels.youConfirmed}
              </span>
            ) : (
              <Button size="sm" onClick={confirm} disabled={busy} className="gap-1 bg-amber-500 font-semibold text-slate-950 hover:bg-amber-400">
                <Handshake className="size-4" /> {labels.confirm}
              </Button>
            )}
            {partnerConfirmed ? (
              <span className="text-sm text-emerald-400">{labels.partnerConfirmed}</span>
            ) : (
              iConfirmed && <span className="text-sm text-slate-400">{labels.waitingPartner}</span>
            )}
            {!iConfirmed && <span className="text-xs text-slate-500">{labels.confirmHint}</span>}
            <Button size="sm" variant="ghost" onClick={cancel} disabled={busy} className="ml-auto gap-1 text-red-400 hover:bg-red-500/10 hover:text-red-300">
              <X className="size-4" /> {labels.cancel}
            </Button>
          </>
        )}

        {offer.status === "completed" && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-400">
            <CheckCheck className="size-4" /> {labels.statusCompleted}
          </span>
        )}
        {offer.status === "rejected" && (
          <span className="text-sm text-red-400">{labels.statusRejected}</span>
        )}
        {offer.status === "cancelled" && (
          <span className="text-sm text-slate-500">{labels.statusCancelled}</span>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  offers,
  locale,
  labels,
}: {
  title: string;
  offers: MyTradeOffer[];
  locale: Locale;
  labels: ManagerLabels;
}) {
  if (offers.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
        {title} <span className="text-slate-600">({offers.length})</span>
      </h2>
      <div className="grid gap-4">
        {offers.map((o) => (
          <OfferCard key={o.id} offer={o} locale={locale} labels={labels} />
        ))}
      </div>
    </section>
  );
}

export function TradeOffersManager({
  offers,
  locale,
  labels,
}: {
  offers: MyTradeOffer[];
  locale: Locale;
  labels: ManagerLabels;
}) {
  const incoming = offers.filter((o) => o.status === "pending" && !o.i_am_sender);
  const toConfirm = offers.filter((o) => o.status === "accepted");
  const outgoing = offers.filter((o) => o.status === "pending" && o.i_am_sender);
  const history = offers.filter((o) =>
    ["completed", "rejected", "cancelled"].includes(o.status)
  );

  if (offers.length === 0) {
    return <p className="text-slate-500">{labels.empty}</p>;
  }

  return (
    <div className="space-y-8">
      <Section title={labels.incoming} offers={incoming} locale={locale} labels={labels} />
      <Section title={labels.toConfirm} offers={toConfirm} locale={locale} labels={labels} />
      <Section title={labels.outgoing} offers={outgoing} locale={locale} labels={labels} />
      <Section title={labels.history} offers={history} locale={locale} labels={labels} />
    </div>
  );
}
