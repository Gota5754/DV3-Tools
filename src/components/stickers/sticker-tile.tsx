"use client";

import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { stickerImagePath } from "@/lib/data/stickers";
import { cn } from "@/lib/utils";
import type { UserStickerState } from "./sticker-book";

export function StickerTile({
  id,
  state,
  onChange,
}: {
  id: number;
  state: UserStickerState;
  onChange: (next: UserStickerState) => void;
}) {
  function toggleOwned() {
    const owned = !state.owned;
    // A sticker that is no longer owned cannot have duplicates.
    onChange({ owned, duplicates: owned ? state.duplicates : 0 });
  }

  function changeDuplicates(delta: number) {
    const duplicates = Math.max(0, Math.min(99, state.duplicates + delta));
    onChange({ ...state, duplicates });
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={toggleOwned}
        className={cn(
          "relative aspect-square w-full overflow-hidden rounded-md border transition-all",
          state.owned
            ? "border-primary ring-1 ring-primary"
            : "opacity-40 grayscale hover:opacity-70"
        )}
      >
        <Image
          src={stickerImagePath(id)}
          alt={`Sticker ${id}`}
          fill
          sizes="120px"
          className="object-contain p-1"
        />
        {state.duplicates > 0 && (
          <span className="absolute top-0.5 right-0.5 rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground">
            +{state.duplicates}
          </span>
        )}
      </button>
      <div
        className={cn(
          "flex items-center gap-1",
          !state.owned && "pointer-events-none opacity-30"
        )}
      >
        <button
          type="button"
          onClick={() => changeDuplicates(-1)}
          className="rounded border p-0.5 hover:bg-accent"
          aria-label="-1"
        >
          <Minus className="size-3" />
        </button>
        <span className="w-5 text-center text-xs tabular-nums">
          {state.duplicates}
        </span>
        <button
          type="button"
          onClick={() => changeDuplicates(1)}
          className="rounded border p-0.5 hover:bg-accent"
          aria-label="+1"
        >
          <Plus className="size-3" />
        </button>
      </div>
    </div>
  );
}
