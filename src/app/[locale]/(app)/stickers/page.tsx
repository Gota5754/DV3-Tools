import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
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

  return (
    <div className="space-y-6">
      <h1 className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-3xl font-extrabold tracking-wide text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)] sm:text-4xl">
        {t("title")}
      </h1>
      <StickerBook userId={user!.id} initialState={initialState} />
    </div>
  );
}
