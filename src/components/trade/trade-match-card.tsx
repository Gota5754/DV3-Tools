import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import {
  stickerImagePath,
  stickerName,
  stickerCoords,
  COLLECTION_NAMES,
} from "@/lib/data/stickers";
import type { Locale } from "@/i18n/routing";
import type { TradeMatch } from "@/lib/supabase/types";
import { Separator } from "@/components/ui/separator";

function groupByCollection(ids: number[]): Map<number, number[]> {
  const map = new Map<number, number[]>();
  for (const id of ids) {
    const { collection } = stickerCoords(id);
    if (!map.has(collection)) map.set(collection, []);
    map.get(collection)!.push(id);
  }
  return map;
}

async function StickersByCollection({
  ids,
  accentClass,
}: {
  ids: number[];
  accentClass: string;
}) {
  const locale = (await getLocale()) as Locale;
  const grouped = groupByCollection(ids);

  return (
    <div className="space-y-4">
      {Array.from(grouped.entries()).map(([collection, colIds]) => (
        <div key={collection}>
          <p className={`mb-2 text-[10px] font-semibold uppercase tracking-widest ${accentClass}`}>
            {COLLECTION_NAMES[locale][collection - 1]}{" "}
            <span className="text-slate-600">({colIds.length})</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colIds.map((id) => {
              const name = stickerName(id, locale);
              return (
                <div key={id} className="flex flex-col items-center gap-1">
                  <div
                    className="group relative aspect-[526/637] w-14 overflow-hidden rounded-lg border border-slate-700/60"
                    title={name}
                  >
                    <Image
                      src={stickerImagePath(id)}
                      alt={name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="bg-black/85 px-1 py-0.5 text-center text-[9px] leading-tight text-white">
                        {name}
                      </div>
                    </div>
                  </div>
                  <span className="w-14 truncate text-center text-[9px] leading-tight text-slate-500">
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
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
        {/* Summary badges */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
            {t("theyHave")} — {t("stickerCount", { count: match.they_have.length })}
          </span>
          <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
            {t("youHave")} — {t("stickerCount", { count: match.they_need.length })}
          </span>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        {/* They have what you need */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-400">
            {t("theyHave")}
          </p>
          <StickersByCollection ids={match.they_have} accentClass="text-amber-600" />
        </div>

        <Separator className="bg-slate-700/60" />

        {/* They want your duplicates */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-400">
            {t("youHave")}
          </p>
          <StickersByCollection ids={match.they_need} accentClass="text-indigo-600" />
        </div>
      </div>
    </div>
  );
}
