"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
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
  const [state, setState] = useState(initialState);

  const ownedTotal = Object.values(state).filter((s) => s.owned).length;

  async function update(id: number, next: UserStickerState) {
    // Optimistic update; revert on failure.
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
    if (error) {
      setState((s) => ({ ...s, [id]: prev }));
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        {t("subtitle", { owned: ownedTotal, total: TOTAL_STICKERS })}
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {COLLECTION_NUMBERS.map((collection) => {
          const ownedInCollection = POSITION_NUMBERS.filter(
            (p) => state[stickerId(collection, p)]?.owned
          ).length;
          const complete = ownedInCollection === STICKERS_PER_COLLECTION;

          return (
            <Dialog key={collection}>
              <DialogTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "group flex flex-col overflow-hidden rounded-xl border-2 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
                    complete ? "border-amber-400" : "border-border"
                  )}
                >
                  <div className="relative aspect-square w-full bg-muted">
                    <Image
                      src={collectionImagePath(collection)}
                      alt={t("collection", { number: collection })}
                      fill
                      sizes="(max-width: 640px) 50vw, 20vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex w-full items-center justify-between gap-2 p-2">
                    <span className="truncate text-sm font-semibold">
                      {t("collection", { number: collection })}
                    </span>
                    <Badge
                      variant={complete ? "default" : "secondary"}
                      className={cn(complete && "bg-amber-500 text-white")}
                    >
                      {complete
                        ? t("complete")
                        : `${ownedInCollection}/${STICKERS_PER_COLLECTION}`}
                    </Badge>
                  </div>
                  <div className="h-1.5 w-full bg-muted">
                    <div
                      className={cn(
                        "h-full transition-all",
                        complete ? "bg-amber-400" : "bg-primary"
                      )}
                      style={{
                        width: `${(ownedInCollection / STICKERS_PER_COLLECTION) * 100}%`,
                      }}
                    />
                  </div>
                </button>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border">
                    <Image
                      src={collectionImagePath(collection)}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <DialogTitle>
                      {t("collection", { number: collection })}
                    </DialogTitle>
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
