import { getTranslations } from "next-intl/server";
import { KofiButton } from "./kofi-button";

export async function Footer() {
  const t = await getTranslations("Footer");
  return (
    <footer className="mt-12 border-t border-slate-800 py-10 text-center">
      <p className="mb-1 text-sm text-slate-400">{t("support")}</p>
      <p className="mb-5 text-xs text-slate-600">{t("disclaimer")}</p>
      <KofiButton label={t("kofi")} />
    </footer>
  );
}
