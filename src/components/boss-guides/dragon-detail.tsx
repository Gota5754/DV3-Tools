"use client";

import { useState } from "react";
import { X, Shield, Zap, Gem } from "lucide-react";
import Image from "next/image";
import type { DragonRec } from "@/lib/data/boss-guides";

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

export function DragonCard({ dragon, locale, labels }: Props) {
  const [open, setOpen] = useState(false);
  const note = dragon.note ? (locale === "fr" ? dragon.note.fr : dragon.note.en) : null;
  const hasBuild = dragon.build.runes.length > 0 || dragon.build.stats.length > 0 || dragon.build.orbs.length > 0;

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
              className="object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-slate-700/50" />
          )}
        </div>

        {/* Button background (game UI style) */}
        <div className="relative flex h-12 w-40 items-center justify-center">
          <Image
            src="/bosses/ui/dragon-button.png"
            alt=""
            fill
            className="object-fill"
          />
          <span className="relative z-10 px-3 text-center text-[11px] font-bold leading-tight text-amber-950 drop-shadow-none">
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
            {/* Header with sprite */}
            <div className="relative flex items-center gap-4 border-b border-slate-700/60 bg-slate-800/60 px-5 py-4">
              {dragon.image && (
                <div className="relative size-16 shrink-0">
                  <Image src={dragon.image} alt={dragon.name} fill className="object-contain" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-100">{dragon.name}</h3>
                {note && <p className="mt-0.5 text-xs leading-snug text-emerald-400">{note}</p>}
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-100"
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
                      <div className="space-y-1">
                        {dragon.build.runes.map((r, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg bg-slate-800/60 px-3 py-2 text-sm">
                            <span className="font-medium text-slate-200">{r.name}</span>
                            <span className="text-slate-400">{r.slots}</span>
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
                          <span key={i} className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-sm font-medium text-indigo-300">
                            {s}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* Orbs */}
                  {dragon.build.orbs.length > 0 && (
                    <section className="space-y-2">
                      <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-400">
                        <Shield className="size-3.5" /> {labels.orbs}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {dragon.build.orbs.map((o, i) => (
                          <span key={i} className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-sm font-medium text-emerald-300">
                            {o}
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
