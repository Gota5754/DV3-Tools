"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  COLLECTION_NUMBERS,
  POSITION_NUMBERS,
  STICKERS_PER_COLLECTION,
  stickerId,
} from "@/lib/data/stickers";
import { createClient } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {COLLECTION_NUMBERS.map((collection) => {
        const ownedInCollection = POSITION_NUMBERS.filter(
          (p) => state[stickerId(collection, p)]?.owned
        ).length;
        const complete = ownedInCollection === STICKERS_PER_COLLECTION;

        return (
          <Card key={collection}>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>{t("collection", { number: collection })}</CardTitle>
              <Badge variant={complete ? "default" : "secondary"}>
                {complete
                  ? t("complete")
                  : `${ownedInCollection}/${STICKERS_PER_COLLECTION}`}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
