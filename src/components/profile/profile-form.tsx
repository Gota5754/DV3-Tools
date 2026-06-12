"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("profiles")
      .update({ ign: ign.trim() || null, updated_at: new Date().toISOString() })
      .eq("id", user!.id);
    setStatus(error ? error.message : t("saved"));
    setLoading(false);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-2">
          <Label htmlFor="ign">{t("ignLabel")}</Label>
          <Input
            id="ign"
            value={ign}
            placeholder={t("ignPlaceholder")}
            minLength={2}
            maxLength={32}
            onChange={(e) => setIgn(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">{t("ignHelp")}</p>
          {status && <p className="text-sm">{status}</p>}
        </CardContent>
        <CardFooter className="mt-6">
          <Button type="submit" disabled={loading}>
            {tCommon("save")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
