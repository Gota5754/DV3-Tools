"use client";

import { useState } from "react";
import { X, Zap, Gem } from "lucide-react";
import Image from "next/image";
import type { DragonRec, OrbTier } from "@/lib/data/boss-guides";

interface Props {
  dragon: DragonRec;
  locale: string;
  labels: {
    runes: string;
    stats: string;
    orbs: string;
    close: string;
    buildSoon: string;
  };
}

const ORB_COLOR: Record<OrbTier, string> = {
  S: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
  A: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40",
  B: "bg-slate-700/60 text-slate-400 border border-slate-600/40",
};

export function DragonCard({ dragon, locale, labels }: Props) {
  const [open, setOpen] = useState(false);
  const note = dragon.note ? (locale === "fr" ? dragon.note.fr : dragon.note.en) : null;
  const hasBuild =
    dragon.build.runes.length > 0 ||
    dragon.build.stats.length > 0 ||
    dragon.build.orbs.length > 0;

  return (
    <>
      {/* Game-style button card */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative flex flex-col items-center gap-1 transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none"
      >
        {/* Dragon sprite */}
        <div className="relative h-20 w-20">
          {dragon.image ? (
            <Image
              src={dragon.image}
              alt={dragon.name}
              fill
              className="object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-slate-700/50" />
          )}
        </div>

        {/* Button background */}
        <div className="relative flex h-12 w-40 items-center justify-center">
          <Image src="/bosses/ui/dragon-button.png" alt="" fill className="object-fill" />
          <span className="relative z-10 px-3 text-center text-[11px] font-bold leading-tight text-amber-950">
            {dragon.name}
          </span>
        </div>
      </button>

      {/* Detail modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative flex items-center gap-4 border-b border-slate-700/60 bg-slate-800/60 px-5 py-4">
              {dragon.image && (
                <div className="relative size-16 shrink-0">
                  <Image src={dragon.image} alt={dragon.name} fill className="object-contain" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-100">{dragon.name}</h3>
                {note && (
                  <p className="mt-0.5 text-xs leading-snug text-emerald-400">{note}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="self-start rounded-md p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-100"
                aria-label={labels.close}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="px-5 py-5">
              {hasBuild ? (
                <div className="space-y-5">
                  {/* Runes */}
                  {dragon.build.runes.length > 0 && (
                    <section className="space-y-2">
                      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
                        <Gem className="size-3.5" /> {labels.runes}
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {dragon.build.runes.map((r) => (
                          <div
                            key={r.name}
                            className="flex items-center gap-2 rounded-xl bg-slate-800/60 px-3 py-2"
                          >
                            <div className="relative size-8 shrink-0">
                              <Image src={r.image} alt={r.name} fill className="object-contain" />
                            </div>
                            <div className="leading-tight">
                              <p className="text-sm font-semibold text-slate-200">{r.name}</p>
                              <p className="text-xs text-slate-400">×{r.count}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Stats */}
                  {dragon.build.stats.length > 0 && (
                    <section className="space-y-2">
                      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-400">
                        <Zap className="size-3.5" /> {labels.stats}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {dragon.build.stats.map((s, i) => (
                          <span
                            key={i}
                            className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-sm font-medium text-indigo-300"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Orbs */}
                  {dragon.build.orbs.length > 0 && (
                    <section className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                        {labels.orbs}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {dragon.build.orbs.map((o) => (
                          <span
                            key={o.name}
                            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-medium ${ORB_COLOR[o.tier]}`}
                          >
                            <span className="text-[10px] font-bold opacity-70">{o.tier}</span>
                            {o.name}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                <p className="text-sm text-slate-500">{labels.buildSoon}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
