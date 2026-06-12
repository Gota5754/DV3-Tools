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
    <header className="border-b">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-4">
        <Link href="/" className="font-bold">
          DV3 Tools
        </Link>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/stickers" className="hover:text-foreground">
            {t("stickers")}
          </Link>
          <Link href="/trade" className="hover:text-foreground">
            {t("trade")}
          </Link>
          <Link href="/tier-list" className="hover:text-foreground">
            {t("tierList")}
          </Link>
          <Link href="/boss-guides" className="hover:text-foreground">
            {t("bossGuides")}
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          {user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">{t("profile")}</Link>
              </Button>
              <LogoutButton label={t("logout")} />
            </>
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">{t("login")}</Link>
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}
