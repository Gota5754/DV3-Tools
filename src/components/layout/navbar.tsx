import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { LogoutButton } from "./logout-button";
import { MobileMenu } from "./mobile-menu";
import { KofiNavButton } from "./kofi-button";

export async function Navbar() {
  const t = await getTranslations("Nav");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let pendingCount = 0;
  if (user) {
    const { count } = await supabase
      .from("trade_offers")
      .select("id", { count: "exact", head: true })
      .eq("to_user", user.id)
      .eq("status", "pending");
    pendingCount = count ?? 0;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center gap-4 px-4">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-lg font-bold tracking-wider text-transparent"
        >
          DV3 Tools
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 text-sm md:flex">
          {[
            { href: "/stickers",    label: t("stickers"),    badge: 0 },
            { href: "/trade",       label: t("trade"),       badge: 0 },
            { href: "/my-trades",   label: t("myTrades"),    badge: pendingCount },
            { href: "/tier-list",   label: t("tierList"),    badge: 0 },
            { href: "/boss-guides", label: t("bossGuides"),  badge: 0 },
          ].map(({ href, label, badge }) => (
            <Link
              key={href}
              href={href}
              className="relative rounded-md px-3 py-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            >
              {label}
              {badge > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-950">
                  {badge}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <KofiNavButton className="hidden sm:inline-flex" />
          <LanguageSwitcher />
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden text-slate-400 hover:bg-slate-800 hover:text-slate-100 sm:flex"
              >
                <Link href="/profile">{t("profile")}</Link>
              </Button>
              <LogoutButton label={t("logout")} />
            </>
          ) : (
            <Button
              size="sm"
              asChild
              className="bg-amber-500 text-slate-950 hover:bg-amber-400"
            >
              <Link href="/login">{t("login")}</Link>
            </Button>
          )}
          {/* Mobile hamburger */}
          <MobileMenu pendingCount={pendingCount} />
        </div>
      </nav>
    </header>
  );
}
