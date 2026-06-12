"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({ initialIgn }: { initialIgn: string }) {
  const t = useTranslations("Profile");
  const tCommon = useTranslations("Common");
  const [ign, setIgn] = useState(initialIgn);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({ ign: ign.trim() || null, updated_at: new Date().toISOString() })
      .eq("id", user!.id);
    setStatus(error ? error.message : t("saved"));
    setLoading(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl shadow-black/30">
      <div className="border-b border-slate-700/60 px-6 py-5">
        <h2 className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text font-bold tracking-wide text-transparent">
          {t("title")}
        </h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
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
