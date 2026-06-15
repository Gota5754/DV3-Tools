"use client";

import Image from "next/image";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  stickerImagePath,
  stickerName,
  stickerCoords,
  COLLECTION_NAMES,
} from "@/lib/data/stickers";
import type { TradeMatch } from "@/lib/supabase/types";
import type { Locale } from "@/i18n/routing";

function groupByCollection(ids: number[]): Map<number, number[]> {
  const map = new Map<number, number[]>();
  for (const id of ids) {
    const { collection } = stickerCoords(id);
    if (!map.has(collection)) map.set(collection, []);
    map.get(collection)!.push(id);
  }
  return map;
}

function StickerGrid({
  ids,
  locale,
  accentClass,
}: {
  ids: number[];
  locale: Locale;
  accentClass: string;
}) {
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
                  <div className="group relative aspect-[526/637] w-14 overflow-hidden rounded-lg border border-slate-700/60">
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

function MatchSummary({ match, locale, theyHaveLabel, youHaveLabel }: {
  match: TradeMatch;
  locale: Locale;
  theyHaveLabel: string;
  youHaveLabel: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      {/* IGN + UID + Discord */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-100">{match.partner_ign}</span>
          {match.partner_uid && (
            <span className="rounded-md bg-slate-700/60 px-2 py-0.5 font-mono text-xs text-slate-300">
              {match.partner_uid}
            </span>
          )}
          {match.partner_discord && (
            <span className="flex items-center gap-1 text-xs text-indigo-400">
              <svg viewBox="0 0 24 24" className="size-3 fill-current" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.003.028.015.056.03.074a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              @{match.partner_discord}
            </span>
          )}
        </div>
      </div>
      {/* Score badges */}
      <div className="flex shrink-0 flex-wrap gap-1.5">
        <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-400">
          ↓ {match.they_have.length} {theyHaveLabel}
        </span>
        <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
          ↑ {match.they_need.length} {youHaveLabel}
        </span>
      </div>
    </div>
  );
}

export function TradeMatchList({
  matches,
  locale,
  labels,
}: {
  matches: TradeMatch[];
  locale: Locale;
  labels: {
    theyHave: string;
    youHave: string;
    theyHaveShort: string;
    youHaveShort: string;
  };
}) {
  const sorted = [...matches].sort(
    (a, b) =>
      (b.they_have.length + b.they_need.length) -
      (a.they_have.length + a.they_need.length)
  );

  return (
    <Accordion>
      {sorted.map((match) => (
        <AccordionItem
          key={match.partner_id}
          summary={
            <MatchSummary
              match={match}
              locale={locale}
              theyHaveLabel={labels.theyHaveShort}
              youHaveLabel={labels.youHaveShort}
            />
          }
        >
          <div className="space-y-5">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-amber-400">
                {labels.theyHave}
              </p>
              <StickerGrid ids={match.they_have} locale={locale} accentClass="text-amber-600" />
            </div>
            <Separator className="bg-slate-700/60" />
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                {labels.youHave}
              </p>
              <StickerGrid ids={match.they_need} locale={locale} accentClass="text-indigo-600" />
            </div>
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
