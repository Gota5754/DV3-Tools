import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { TOTAL_STICKERS } from "@/lib/data/stickers";
import { StickerBook, type UserStickerState } from "@/components/stickers/sticker-book";

export default async function StickersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Stickers");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows } = await supabase
    .from("user_stickers")
    .select("sticker_id, owned, duplicates")
    .eq("user_id", user!.id);

  const initialState: Record<number, UserStickerState> = {};
  for (const row of rows ?? []) {
    initialState[row.sticker_id] = {
      owned: row.owned,
      duplicates: row.duplicates,
    };
  }

  const ownedCount = Object.values(initialState).filter((s) => s.owned).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground">
          {t("subtitle", { owned: ownedCount, total: TOTAL_STICKERS })}
        </p>
      </div>
      <StickerBook userId={user!.id} initialState={initialState} />
    </div>
  );
}
