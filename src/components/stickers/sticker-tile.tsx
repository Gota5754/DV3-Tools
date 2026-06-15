"use client";

import Image from "next/image";
import { Lock, Minus, Plus, Star } from "lucide-react";
import { useLocale } from "next-intl";
import { isTradeable, stickerImagePath, stickerName, stickerStars } from "@/lib/data/stickers";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";
import type { UserStickerState } from "./sticker-book";

const STAR_SIZE: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "size-6",
  2: "size-5",
  3: "size-4",
  4: "size-3.5",
  5: "size-3",
};

function StarRow({ count, owned }: { count: 1 | 2 | 3 | 4 | 5; owned: boolean }) {
  return (
    <div className="absolute -top-3 left-1/2 z-10 flex -translate-x-1/2 gap-px drop-shadow">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "transition-colors",
            STAR_SIZE[count],
            owned
              ? "fill-yellow-400 stroke-yellow-500"
              : "fill-zinc-500 stroke-zinc-600"
          )}
        />
      ))}
    </div>
  );
}

export function StickerTile({
  id,
  state,
  onChange,
}: {
  id: number;
  state: UserStickerState;
  onChange: (next: UserStickerState) => void;
}) {
  const locale = useLocale() as Locale;
  const name = stickerName(id, locale);
  const tradeable = isTradeable(id);
  const stars = stickerStars(id) as 1 | 2 | 3 | 4 | 5;

  function toggleOwned() {
    const owned = !state.owned;
    onChange({ owned, duplicates: owned ? state.duplicates : 0 });
  }

  function changeDuplicates(delta: number) {
    const duplicates = Math.max(0, Math.min(99, state.duplicates + delta));
    onChange({ ...state, duplicates });
  }

  return (
    <div className="flex flex-col items-center gap-1 pt-3">
      <button
        type="button"
        onClick={toggleOwned}
        className="group relative w-full transition-transform hover:scale-[1.03]"
      >
        <StarRow count={stars} owned={state.owned} />
        <div
          className={cn(
            "relative aspect-[526/637] w-full overflow-hidden rounded-xl border-[3px] shadow-md transition-all",
            state.owned
              ? "border-amber-800 bg-amber-900"
              : "border-zinc-400 bg-zinc-300 opacity-60 saturate-50 group-hover:opacity-85"
          )}
        >
          <Image
            src={stickerImagePath(id)}
            alt={name}
            title={name}
            fill
            sizes="140px"
            className="scale-[1.06] object-cover"
          />

          {/* Tooltip name — slides up on hover */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="bg-black/80 px-1.5 py-1 text-center text-[10px] leading-tight text-white backdrop-blur-sm">
              {name}
            </div>
          </div>

          {/* Lock badge for non-tradeable */}
          {!tradeable && (
            <span className="absolute top-1 left-1 rounded-full bg-black/60 p-1">
              <Lock className="size-2.5 text-slate-300" />
            </span>
          )}

          {state.duplicates > 0 && (
            <span className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-2.5 py-0.5 text-xs font-bold text-white">
              +{state.duplicates}
            </span>
          )}
        </div>
      </button>

      {tradeable ? (
        <div
          className={cn(
            "flex items-center gap-1",
            !state.owned && "pointer-events-none opacity-30"
          )}
        >
          <button type="button" onClick={() => changeDuplicates(-1)} className="rounded border p-0.5 hover:bg-accent" aria-label="-1">
            <Minus className="size-3" />
          </button>
          <span className="w-5 text-center text-xs tabular-nums">{state.duplicates}</span>
          <button type="button" onClick={() => changeDuplicates(1)} className="rounded border p-0.5 hover:bg-accent" aria-label="+1">
            <Plus className="size-3" />
          </button>
        </div>
      ) : (
        <span className="text-[10px] text-slate-500">non-éch.</span>
      )}
      {/* Name always visible — the only way to read it on mobile */}
      <span className="w-full truncate text-center text-[10px] leading-tight text-slate-400">
        {name}
      </span>
    </div>
  );
}
