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
import { Badge } from "@/components/ui/badge";
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
      <p className="text-muted-foreground">
        {t("subtitle", { owned: ownedTotal, total: TOTAL_STICKERS })}
      </p>

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
                    "group relative overflow-hidden rounded-2xl border-2 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
                    complete ? "border-amber-400" : "border-border"
                  )}
                >
                  {/* Cover image — fills entire button including the black band. */}
                  <div className="relative aspect-square w-full bg-muted">
                    <Image
                      src={collectionImagePath(collection)}
                      alt={name}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Name label overlaid on the black band at the bottom of the PNG. */}
                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-center px-2 pb-1.5 pt-5">
                      <span className="truncate text-center text-sm font-bold text-white drop-shadow">
                        {name}
                      </span>
                    </div>
                    {/* Progress badge top-right. */}
                    <div className="absolute top-1.5 right-1.5">
                      <Badge
                        variant={complete ? "default" : "secondary"}
                        className={cn(
                          "text-xs",
                          complete && "bg-amber-500 text-white"
                        )}
                      >
                        {complete ? t("complete") : `${ownedInCollection}/${STICKERS_PER_COLLECTION}`}
                      </Badge>
                    </div>
                  </div>
                  {/* Thin progress bar at the very bottom. */}
                  <div className="h-1 w-full bg-muted">
                    <div
                      className={cn(
                        "h-full transition-all",
                        complete ? "bg-amber-400" : "bg-primary"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl border">
                    <Image
                      src={collectionImagePath(collection)}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <DialogTitle>{name}</DialogTitle>
                    <p className="text-sm text-muted-foreground">
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
