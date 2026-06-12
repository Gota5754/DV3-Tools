import { getTranslations, setRequestLocale } from "next-intl/server";
import { BookImage, Swords, Trophy } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");

  return (
    <div className="flex flex-col items-center gap-10 py-12 text-center">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground text-lg">{t("subtitle")}</p>
      </div>

      <div className="grid w-full gap-4 sm:grid-cols-3">
        <Link href="/stickers" className="group">
          <Card className="h-full transition-colors group-hover:border-primary">
            <CardHeader>
              <BookImage className="mx-auto size-8" />
              <CardTitle>Sticker Book</CardTitle>
              <CardDescription>{t("stickersCard")}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/tier-list" className="group">
          <Card className="h-full transition-colors group-hover:border-primary">
            <CardHeader>
              <Trophy className="mx-auto size-8" />
              <CardTitle>Tier List</CardTitle>
              <CardDescription>{t("tierListCard")}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/boss-guides" className="group">
          <Card className="h-full transition-colors group-hover:border-primary">
            <CardHeader>
              <Swords className="mx-auto size-8" />
              <CardTitle>Boss Guides</CardTitle>
              <CardDescription>{t("bossCard")}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <Button asChild size="lg">
        <Link href="/stickers">{t("getStarted")}</Link>
      </Button>
    </div>
  );
}
