"use client";

import { useState } from "react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { StickerTile } from "./sticker-tile";
import type { Locale } from "@/i18n/routing";

export interface UserStickerState {
  owned: boolean;
  duplicates: number;
}

const EMPTY: UserStickerState = { owned: false, duplicates: 0 };

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

  return (
    <div className="space-y-6">
      {/* Global counter */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-500"
            style={{ width: `${(ownedTotal / TOTAL_STICKERS) * 100}%` }}
          />
        </div>
        <span className="shrink-0 text-sm font-semibold tabular-nums text-amber-400">
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
            <Dialog key={collection}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border text-left transition-all duration-300",
                    "hover:-translate-y-1.5 hover:shadow-xl",
                    complete
                      ? "border-amber-500/60 hover:shadow-amber-500/20"
                      : "border-slate-700/50 bg-slate-900 hover:border-indigo-500/40 hover:shadow-indigo-500/15"
                  )}
                >
                  {/* Cover image */}
                  <div className="relative aspect-square w-full overflow-hidden">
                    <Image
                      src={collectionImagePath(collection)}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Collection name on the black band */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center px-2 pb-[22px] pt-5">
                      <span className="truncate text-center text-sm font-bold tracking-wide text-white drop-shadow">
                        {name}
                      </span>
                    </div>

                    {/* Progress badge */}
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

                  {/* Thin progress bar */}
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
              </DialogTrigger>

              {/* Album detail overlay */}
              <DialogContent className="max-w-md border-slate-700/60 bg-slate-900">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-slate-700">
                    <Image
                      src={collectionImagePath(collection)}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <DialogTitle className="text-slate-100">{name}</DialogTitle>
                    <p className="text-sm text-slate-400">
                      {ownedInCollection}/{STICKERS_PER_COLLECTION}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {POSITION_NUMBERS.map((position) => {
                    const id = stickerId(collection, position);
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
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}
