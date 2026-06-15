"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const UID_RE = /^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/;

export function ProfileForm({
  initialIgn,
  initialDiscord,
  initialUid,
}: {
  initialIgn: string;
  initialDiscord: string;
  initialUid: string;
}) {
  const t = useTranslations("Profile");
  const tCommon = useTranslations("Common");
  const [ign, setIgn] = useState(initialIgn);
  const [discord, setDiscord] = useState(initialDiscord);
  const [uid, setUid] = useState(initialUid);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function formatUid(value: string) {
    // Keep only alphanumeric chars, max 9
    const chars = value.replace(/[^A-Za-z0-9]/g, "").slice(0, 9);
    if (chars.length <= 3) return chars;
    if (chars.length <= 6) return `${chars.slice(0, 3)}-${chars.slice(3)}`;
    return `${chars.slice(0, 3)}-${chars.slice(3, 6)}-${chars.slice(6)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (uid && !UID_RE.test(uid)) {
      setStatus(t("uidInvalid"));
      return;
    }
    setLoading(true);
    setStatus(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({
        ign: ign.trim() || null,
        discord: discord.trim() || null,
        uid: uid.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user!.id);
    setStatus(error ? error.message : t("saved"));
    setLoading(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 shadow-lg shadow-black/40">
      <div className="border-b border-slate-700/60 px-6 py-5">
        <h2 className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text font-bold tracking-wide text-transparent">
          {t("title")}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
        {/* IGN */}
        <div className="space-y-2">
          <Label htmlFor="ign" className="text-slate-300">{t("ignLabel")}</Label>
          <Input
            id="ign"
            value={ign}
            placeholder={t("ignPlaceholder")}
            minLength={2}
            maxLength={32}
            onChange={(e) => setIgn(e.target.value)}
            className="border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
          />
          <p className="text-sm text-slate-500">{t("ignHelp")}</p>
        </div>

        {/* UID */}
        <div className="space-y-2">
          <Label htmlFor="uid" className="text-slate-300">{t("uidLabel")}</Label>
          <Input
            id="uid"
            value={uid}
            placeholder="000-000-000"
            maxLength={11}
            onChange={(e) => setUid(formatUid(e.target.value))}
            className="border-slate-700 bg-slate-800 font-mono text-slate-100 placeholder:text-slate-500 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
          />
          <p className="text-sm text-slate-500">{t("uidHelp")}</p>
        </div>

        {/* Discord */}
        <div className="space-y-2">
          <Label htmlFor="discord" className="text-slate-300">{t("discordLabel")}</Label>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">@</span>
            <Input
              id="discord"
              value={discord}
              placeholder={t("discordPlaceholder")}
              maxLength={64}
              onChange={(e) => setDiscord(e.target.value)}
              className="border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:border-indigo-500/60 focus-visible:ring-indigo-500/20"
            />
          </div>
          <p className="text-sm text-slate-500">{t("discordHelp")}</p>
        </div>

        {status && (
          <p className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-300">
            {status}
          </p>
        )}
        <Button
          type="submit"
          disabled={loading}
          className="bg-amber-500 font-semibold text-slate-950 hover:bg-amber-400"
        >
          {tCommon("save")}
        </Button>
      </form>
    </div>
  );
}
