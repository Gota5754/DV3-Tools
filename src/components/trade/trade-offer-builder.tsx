"use client";

import { useState } from "react";
import { Handshake } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StickerThumb } from "./sticker-thumb";
import { stickerStars } from "@/lib/data/stickers";
import type { Locale } from "@/i18n/routing";
import type { TradeMatch } from "@/lib/supabase/types";

export interface BuilderLabels {
  propose: string;
  title: string;
  description: string;
  youGive: string;
  youReceive: string;
  starTotal: string;
  send: string;
  sending: string;
  sent: string;
  error: string;
  pickBoth: string;
}

function totalStars(ids: number[]): number {
  return ids.reduce((sum, id) => sum + stickerStars(id), 0);
}

export function TradeOfferBuilder({
  userId,
  match,
  locale,
  labels,
}: {
  userId: string;
  match: TradeMatch;
  locale: Locale;
  labels: BuilderLabels;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // offered = my duplicates the partner needs; requested = partner's duplicates I want
  const [offered, setOffered] = useState<Set<number>>(new Set());
  const [requested, setRequested] = useState<Set<number>>(new Set());
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function toggle(set: Set<number>, setter: (s: Set<number>) => void, id: number) {
    const next = new Set(set);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setter(next);
    if (status !== "idle") setStatus("idle");
  }

  async function send() {
    if (offered.size === 0 || requested.size === 0) return;
    setStatus("sending");
    const { error } = await createClient().from("trade_offers").insert({
      from_user: userId,
      to_user: match.partner_id,
      offered_sticker_ids: [...offered],
      requested_sticker_ids: [...requested],
    });
    if (error) {
      setStatus("error");
      return;
    }
    setStatus("sent");
    router.refresh();
    setTimeout(() => {
      setOpen(false);
      setOffered(new Set());
      setRequested(new Set());
      setStatus("idle");
    }, 1200);
  }

  const offeredStars = totalStars([...offered]);
  const requestedStars = totalStars([...requested]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="gap-1.5 bg-indigo-500 font-semibold text-white hover:bg-indigo-400"
        >
          <Handshake className="size-4" />
          {labels.propose}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-slate-700 bg-slate-900 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-slate-100">
            {labels.title} {match.partner_ign}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {labels.description}
          </DialogDescription>
        </DialogHeader>

        {/* You receive (partner's duplicates) */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            {labels.youReceive}{" "}
            <span className="text-slate-500">— ⭐ {requestedStars}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {match.they_have.map((id) => (
              <StickerThumb
                key={id}
                id={id}
                locale={locale}
                selectable
                selected={requested.has(id)}
                onClick={() => toggle(requested, setRequested, id)}
              />
            ))}
          </div>
        </div>

        {/* You give (your duplicates the partner needs) */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            {labels.youGive}{" "}
            <span className="text-slate-500">— ⭐ {offeredStars}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {match.they_need.map((id) => (
              <StickerThumb
                key={id}
                id={id}
                locale={locale}
                selectable
                selected={offered.has(id)}
                onClick={() => toggle(offered, setOffered, id)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <p className="text-sm text-slate-400">
            {status === "sent" && <span className="text-emerald-400">{labels.sent}</span>}
            {status === "error" && <span className="text-red-400">{labels.error}</span>}
            {status === "idle" && (offered.size === 0 || requested.size === 0) && (
              <span className="text-slate-500">{labels.pickBoth}</span>
            )}
          </p>
          <Button
            onClick={send}
            disabled={offered.size === 0 || requested.size === 0 || status === "sending" || status === "sent"}
            className="bg-amber-500 font-semibold text-slate-950 hover:bg-amber-400"
          >
            {status === "sending" ? labels.sending : labels.send}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
