import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { LogoutButton } from "./logout-button";

export async function Navbar() {
  const t = await getTranslations("Nav");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4">
        <Link
          href="/"
          className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-lg font-bold tracking-wider text-transparent"
        >
          DV3 Tools
        </Link>

        <div className="hidden items-center gap-1 text-sm md:flex">
          {[
            { href: "/stickers", label: t("stickers") },
            { href: "/trade",    label: t("trade") },
            { href: "/tier-list",   label: t("tierList") },
            { href: "/boss-guides", label: t("bossGuides") },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-md px-3 py-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-slate-400 hover:bg-slate-800 hover:text-slate-100"
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
        </div>
      </nav>
    </header>
  );
}
