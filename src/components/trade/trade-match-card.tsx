import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { stickerImagePath } from "@/lib/data/stickers";
import type { TradeMatch } from "@/lib/supabase/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function StickerRow({ ids }: { ids: number[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <div
          key={id}
          className="relative size-12 overflow-hidden rounded border"
          title={`Sticker ${id}`}
        >
          <Image
            src={stickerImagePath(id)}
            alt={`Sticker ${id}`}
            fill
            sizes="48px"
            className="object-contain p-0.5"
          />
        </div>
      ))}
    </div>
  );
}

export async function TradeMatchCard({ match }: { match: TradeMatch }) {
  const t = await getTranslations("Trade");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{match.partner_ign}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {t("theyHave")} —{" "}
            <span className="text-muted-foreground">
              {t("stickerCount", { count: match.they_have.length })}
            </span>
          </p>
          <StickerRow ids={match.they_have} />
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="text-sm font-medium">
            {t("youHave")} —{" "}
            <span className="text-muted-foreground">
              {t("stickerCount", { count: match.they_need.length })}
            </span>
          </p>
          <StickerRow ids={match.they_need} />
        </div>
      </CardContent>
    </Card>
  );
}
