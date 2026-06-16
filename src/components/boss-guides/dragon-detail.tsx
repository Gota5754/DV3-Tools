"use client";

import { useState } from "react";
import { X, Shield, Zap, Gem } from "lucide-react";
import type { DragonRec } from "@/lib/data/boss-guides";

interface Props {
  dragon: DragonRec;
  labels: {
    runes: string;
    stats: string;
    orbs: string;
    close: string;
  };
}

export function DragonCard({ dragon, labels }: Props) {
  const [open, setOpen] = useState(false);

  const tierColor: Record<string, string> = {
    premium: "text-amber-400 border-amber-500/40 bg-amber-500/10",
    mid: "text-indigo-400 border-indigo-500/40 bg-indigo-500/10",
    low: "text-slate-400 border-slate-600/40 bg-slate-700/30",
  };
  const tierBadge = tierColor[dragon.tier] ?? tierColor.low;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`w-full rounded-xl border px-4 py-3 text-left transition-all hover:brightness-110 ${tierBadge}`}
      >
        <span className="font-semibold text-slate-100">{dragon.name}</span>
      </button>

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
            <div className="flex items-center justify-between border-b border-slate-700/60 px-5 py-4">
              <h3 className="text-lg font-bold text-slate-100">{dragon.name}</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
                aria-label={labels.close}
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-5 px-5 py-5">
              {/* Runes */}
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

              {/* Stats */}
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

              {/* Orbs */}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
