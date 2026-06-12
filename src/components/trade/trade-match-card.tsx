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
    <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-lg shadow-black/30 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10">
      {/* Card header */}
      <div className="border-b border-slate-700/60 px-5 py-4">
        <p className="font-bold tracking-wide text-slate-100">{match.partner_ign}</p>
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
