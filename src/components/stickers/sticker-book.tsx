"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import {
  COLLECTION_NAMES,
  COLLECTION_NUMBERS,
  POSITION_NUMBERS,
  STICKERS_PER_COLLECTION,
  TOTAL_STICKERS,
  collectionImagePath,
  stickerId,
} from "@/lib/data/stickers";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { StickerTile } from "./sticker-tile";
import type { Locale } from "@/i18n/routing";

export interface UserStickerState {
  owned: boolean;
  duplicates: number;
}

const EMPTY: UserStickerState = { owned: false, duplicates: 0 };
const TOTAL_COLLECTIONS = COLLECTION_NUMBERS.length;

export function StickerBook({
  userId,
  initialState,
}: {
  userId: string;
  initialState: Record<number, UserStickerState>;
}) {
  const t = useTranslations("Stickers");
  const locale = useLocale() as Locale;
  const names = COLLECTION_NAMES[locale] ?? COLLECTION_NAMES.fr;
  const [state, setState] = useState(initialState);
  const [openCollection, setOpenCollection] = useState<number | null>(null);

  const ownedTotal = Object.values(state).filter((s) => s.owned).length;

  async function update(id: number, next: UserStickerState) {
    const prev = state[id] ?? EMPTY;
    setState((s) => ({ ...s, [id]: next }));
    const { error } = await createClient()
      .from("user_stickers")
      .upsert({
        user_id: userId,
        sticker_id: id,
        owned: next.owned,
        duplicates: next.duplicates,
        updated_at: new Date().toISOString(),
      });
    if (error) setState((s) => ({ ...s, [id]: prev }));
  }

  function goTo(delta: number) {
    if (openCollection === null) return;
    const idx = COLLECTION_NUMBERS.indexOf(openCollection);
    const next = COLLECTION_NUMBERS[(idx + delta + TOTAL_COLLECTIONS) % TOTAL_COLLECTIONS];
    setOpenCollection(next);
  }

  const col = openCollection;
  const colIdx = col !== null ? COLLECTION_NUMBERS.indexOf(col) : -1;
  const ownedInOpen = col !== null
    ? POSITION_NUMBERS.filter((p) => state[stickerId(col, p)]?.owned).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Global counter */}
      <div className="flex items-center gap-4 rounded-2xl border border-slate-700 bg-slate-800/50 p-4 shadow-lg">
        <div className="h-4 flex-1 overflow-hidden rounded-full border border-slate-700 bg-slate-950/80 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-500"
            style={{ width: `${(ownedTotal / TOTAL_STICKERS) * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-base font-bold tabular-nums text-amber-400">
          {ownedTotal} / {TOTAL_STICKERS}
        </span>
      </div>

      {/* Collection grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {COLLECTION_NUMBERS.map((collection) => {
          const name = names[collection - 1];
          const ownedInCollection = POSITION_NUMBERS.filter(
            (p) => state[stickerId(collection, p)]?.owned
          ).length;
          const complete = ownedInCollection === STICKERS_PER_COLLECTION;
          const pct = (ownedInCollection / STICKERS_PER_COLLECTION) * 100;

          return (
            <button
              key={collection}
              type="button"
              onClick={() => setOpenCollection(collection)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border text-left shadow-lg shadow-black/40 transition-all duration-300",
                "hover:-translate-y-1.5 hover:shadow-xl",
                complete
                  ? "border-amber-500/60 bg-slate-800/50 hover:shadow-amber-500/20"
                  : "border-slate-700 bg-slate-800/50 hover:border-indigo-500/40 hover:shadow-indigo-500/15"
              )}
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={collectionImagePath(collection)}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-center px-2 pb-[22px] pt-5">
                  <span className="truncate text-center text-sm font-bold tracking-wide text-white drop-shadow">
                    {name}
                  </span>
                </div>
                <div className="absolute top-1.5 right-1.5">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-bold backdrop-blur-sm",
                      complete
                        ? "bg-amber-500/90 text-slate-950"
                        : "bg-slate-900/80 text-slate-300"
                    )}
                  >
                    {complete ? t("complete") : `${ownedInCollection}/${STICKERS_PER_COLLECTION}`}
                  </span>
                </div>
              </div>
              <div className="h-1 w-full bg-slate-800">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    complete ? "bg-amber-400" : "bg-indigo-500"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Single shared Dialog for all collections */}
      <Dialog open={openCollection !== null} onOpenChange={(v) => !v && setOpenCollection(null)}>
        <DialogContent className="max-w-md border-slate-700/60 bg-slate-900">
          {col !== null && (
            <>
              {/* Header with prev/next */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goTo(-1)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                  aria-label="Collection précédente"
                >
                  <ChevronLeft className="size-5" />
                </button>

                <div className="flex flex-1 items-center gap-3 min-w-0">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-700">
                    <Image
                      src={collectionImagePath(col)}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <DialogTitle className="truncate text-slate-100">{names[col - 1]}</DialogTitle>
                    <p className="text-sm text-slate-400">
                      {ownedInOpen}/{STICKERS_PER_COLLECTION}
                      <span className="ml-2 text-slate-600 text-xs">
                        {colIdx + 1} / {TOTAL_COLLECTIONS}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => goTo(1)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                  aria-label="Collection suivante"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {POSITION_NUMBERS.map((position) => {
                  const id = stickerId(col, position);
                  return (
                    <StickerTile
                      key={id}
                      id={id}
                      state={state[id] ?? EMPTY}
                      onChange={(next) => update(id, next)}
                    />
                  );
                })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
