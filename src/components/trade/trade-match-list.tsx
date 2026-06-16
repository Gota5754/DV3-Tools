"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { stickerCoords, COLLECTION_NAMES } from "@/lib/data/stickers";
import { StickerThumb } from "./sticker-thumb";
import { TradeOfferBuilder, type BuilderLabels } from "./trade-offer-builder";
import type { TradeMatch } from "@/lib/supabase/types";
import type { Locale } from "@/i18n/routing";

type GameServer = "europe" | "america" | "asia";

const SERVER_LABELS: Record<GameServer, { flag: string; label: string }> = {
  europe:  { flag: "🇪🇺", label: "Europe" },
  america: { flag: "🌎", label: "America" },
  asia:    { flag: "🌏", label: "Asia" },
};

function groupByCollection(ids: number[]): Map<number, number[]> {
  const map = new Map<number, number[]>();
  for (const id of ids) {
    const { collection } = stickerCoords(id);
    if (!map.has(collection)) map.set(collection, []);
    map.get(collection)!.push(id);
  }
  return map;
}

function StickerGrid({ ids, locale, accentClass }: { ids: number[]; locale: Locale; accentClass: string }) {
  const grouped = groupByCollection(ids);
  return (
    <div className="space-y-4">
      {Array.from(grouped.entries()).map(([collection, colIds]) => (
        <div key={collection}>
          <p className={`mb-2 text-[10px] font-semibold uppercase tracking-widest ${accentClass}`}>
            {COLLECTION_NAMES[locale][collection - 1]}{" "}
            <span className="text-slate-600">({colIds.length})</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {colIds.map((id) => (
              <StickerThumb key={id} id={id} locale={locale} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ServerBadge({ server }: { server: string | null }) {
  if (!server) return null;
  const s = server as GameServer;
  const info = SERVER_LABELS[s];
  if (!info) return null;
  return (
    <span className="flex items-center gap-1 rounded-md bg-slate-700/60 px-2 py-0.5 text-xs font-medium text-slate-300">
      {info.flag} {info.label}
    </span>
  );
}

function MatchSummary({ match, theyHaveLabel, youHaveLabel }: {
  match: TradeMatch;
  theyHaveLabel: string;
  youHaveLabel: string;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-slate-100">{match.partner_ign}</span>
          {match.partner_uid && (
            <span className="rounded-md bg-slate-700/60 px-2 py-0.5 font-mono text-xs text-slate-300">
              {match.partner_uid}
            </span>
          )}
          <ServerBadge server={match.partner_server} />
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
  userId,
  matches,
  locale,
  labels,
  builderLabels,
}: {
  userId: string;
  matches: TradeMatch[];
  locale: Locale;
  labels: {
    theyHave: string;
    youHave: string;
    theyHaveShort: string;
    youHaveShort: string;
    searchPlaceholder: string;
    filterAll: string;
    noResults: string;
  };
  builderLabels: BuilderLabels;
}) {
  const [search, setSearch] = useState("");
  const [serverFilter, setServerFilter] = useState<GameServer | null>(null);

  const sorted = [...matches].sort(
    (a, b) =>
      (b.they_have.length + b.they_need.length) -
      (a.they_have.length + a.they_need.length)
  );

  const filtered = sorted.filter((m) => {
    const matchesSearch = m.partner_ign.toLowerCase().includes(search.toLowerCase());
    const matchesServer = !serverFilter || m.partner_server === serverFilter;
    return matchesSearch && matchesServer;
  });

  return (
    <div className="space-y-4">
      {/* Search + server filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/60 py-2 pl-9 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-500/60 focus:outline-none focus:ring-1 focus:ring-amber-500/20"
          />
        </div>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => setServerFilter(null)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              !serverFilter
                ? "border-amber-500/60 bg-amber-500/15 text-amber-300"
                : "border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:text-slate-300"
            }`}
          >
            {labels.filterAll}
          </button>
          {(Object.entries(SERVER_LABELS) as [GameServer, { flag: string; label: string }][]).map(
            ([key, { flag, label }]) => (
              <button
                key={key}
                type="button"
                onClick={() => setServerFilter(serverFilter === key ? null : key)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                  serverFilter === key
                    ? "border-amber-500/60 bg-amber-500/15 text-amber-300"
                    : "border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                }`}
              >
                {flag} {label}
              </button>
            )
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">{labels.noResults}</p>
      ) : (
        <Accordion>
          {filtered.map((match) => (
            <AccordionItem
              key={match.partner_id}
              summary={
                <MatchSummary
                  match={match}
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
                <div className="flex justify-end pt-1">
                  <TradeOfferBuilder
                    userId={userId}
                    match={match}
                    locale={locale}
                    labels={builderLabels}
                  />
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
