"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    const supabase = createClient();

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setMessage(t("error", { message: error.message }));
      } else if (data.session) {
        router.push("/stickers");
        router.refresh();
      } else {
        setMessage(t("checkEmail"));
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(t("error", { message: error.message }));
      } else {
        router.push("/stickers");
        router.refresh();
      }
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-700 bg-slate-800/50 shadow-lg shadow-black/40">
      {/* Header band */}
      <div className="border-b border-slate-700/60 px-6 py-5">
        <h2 className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-xl font-bold tracking-wide text-transparent">
          {mode === "login" ? t("loginTitle") : t("signupTitle")}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-300">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-500 focus-visible:border-amber-500/60 focus-visible:ring-amber-500/20"
          />
        </div>

        {message && (
          <p className="rounded-lg border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-300">
            {message}
          </p>
        )}

        <Button
          type="submit"
          className="w-full bg-amber-500 font-semibold text-slate-950 hover:bg-amber-400"
          disabled={loading}
        >
          {mode === "login" ? t("loginButton") : t("signupButton")}
        </Button>

        <button
          type="button"
          className="w-full text-center text-sm text-slate-400 underline-offset-4 hover:text-slate-200 hover:underline"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? t("noAccount") : t("hasAccount")}
        </button>
      </form>
    </div>
  );
}
