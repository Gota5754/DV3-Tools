import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { stickerImagePath } from "@/lib/data/stickers";
import type { TradeMatch } from "@/lib/supabase/types";
import { Separator } from "@/components/ui/separator";

function StickerRow({ ids }: { ids: number[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <div
          key={id}
          className="relative aspect-[526/637] w-11 overflow-hidden rounded-lg border border-slate-700/60"
          title={`Sticker ${id}`}
        >
          <Image
            src={stickerImagePath(id)}
            alt={`Sticker ${id}`}
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export async function TradeMatchCard({ match }: { match: TradeMatch }) {
  const t = await getTranslations("Trade");

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10">
      {/* Card header */}
      <div className="border-b border-slate-700/60 px-5 py-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold tracking-wide text-slate-100">{match.partner_ign}</p>
          {match.partner_uid && (
            <span className="shrink-0 rounded-md bg-slate-700/60 px-2 py-0.5 font-mono text-xs text-slate-300">
              {match.partner_uid}
            </span>
          )}
        </div>
        {match.partner_discord && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-indigo-400">
            <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.028.015.056.03.074a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
            </svg>
            @{match.partner_discord}
          </p>
        )}
      </div>

      <div className="space-y-4 px-5 py-4">
        {/* They have what you need */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            {t("theyHave")}{" "}
            <span className="text-slate-500">
              — {t("stickerCount", { count: match.they_have.length })}
            </span>
          </p>
          <StickerRow ids={match.they_have} />
        </div>

        <Separator className="bg-slate-700/60" />

        {/* They want your duplicates */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
            {t("youHave")}{" "}
            <span className="text-slate-500">
              — {t("stickerCount", { count: match.they_need.length })}
            </span>
          </p>
          <StickerRow ids={match.they_need} />
        </div>
      </div>
    </div>
  );
}
