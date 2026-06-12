import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Profile");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("ign, discord")
    .eq("id", user!.id)
    .single();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 bg-clip-text text-3xl font-extrabold tracking-wide text-transparent drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]">
        {t("title")}
      </h1>
      <ProfileForm initialIgn={profile?.ign ?? ""} initialDiscord={profile?.discord ?? ""} />
    </div>
  );
}
