"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

export function MobileMenu({ pendingCount = 0 }: { pendingCount?: number }) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/stickers",    label: t("stickers"),   badge: 0 },
    { href: "/trade",       label: t("trade"),      badge: 0 },
    { href: "/my-trades",   label: t("myTrades"),   badge: pendingCount },
    { href: "/tier-list",   label: t("tierList"),   badge: 0 },
    { href: "/boss-guides", label: t("bossGuides"), badge: 0 },
    { href: "/profile",     label: t("profile"),    badge: 0 },
  ];

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        aria-label="Menu"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-14 z-50 border-b border-slate-700/60 bg-slate-950/95 backdrop-blur-md">
          <nav className="flex flex-col divide-y divide-slate-800">
            {links.map(({ href, label, badge }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={
                  "flex items-center justify-between px-6 py-4 text-sm font-medium transition-colors " +
                  (pathname === href
                    ? "text-amber-400"
                    : "text-slate-300 hover:text-slate-100")
                }
              >
                {label}
                {badge > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-[11px] font-bold text-slate-950">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
