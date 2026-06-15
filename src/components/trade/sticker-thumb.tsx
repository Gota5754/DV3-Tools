import Image from "next/image";
import { Star } from "lucide-react";
import { stickerImagePath, stickerName, stickerStars } from "@/lib/data/stickers";
import { cn } from "@/lib/utils";
import type { Locale } from "@/i18n/routing";

function Stars({ count }: { count: number }) {
  return (
    <div className="pointer-events-none absolute -top-1.5 left-1/2 z-10 flex -translate-x-1/2 gap-px drop-shadow">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="size-2.5 fill-yellow-400 stroke-yellow-600" />
      ))}
    </div>
  );
}

/**
 * A small sticker tile (image + rarity stars + name) used across the trade
 * board, the offer builder and the "My trades" page. When `onClick` is
 * provided it renders as a toggle button (used in the offer builder).
 */
export function StickerThumb({
  id,
  locale,
  selectable = false,
  selected = false,
  onClick,
}: {
  id: number;
  locale: Locale;
  selectable?: boolean;
  selected?: boolean;
  onClick?: () => void;
}) {
  const name = stickerName(id, locale);
  const stars = stickerStars(id);

  const inner = (
    <>
      <div
        className={cn(
          "group relative aspect-[526/637] w-14 overflow-hidden rounded-lg border transition-all",
          selectable
            ? selected
              ? "border-amber-400 ring-2 ring-amber-400/50"
              : "border-slate-700/60 opacity-70 hover:opacity-100"
            : "border-slate-700/60"
        )}
      >
        <Stars count={stars} />
        <Image src={stickerImagePath(id)} alt={name} fill sizes="56px" className="object-cover" />
      </div>
      <span className="mt-1 w-14 truncate text-center text-[9px] leading-tight text-slate-500">
        {name}
      </span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="flex flex-col items-center pt-1.5">
        {inner}
      </button>
    );
  }
  return <div className="flex flex-col items-center pt-1.5">{inner}</div>;
}
