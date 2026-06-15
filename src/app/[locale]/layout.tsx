import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/navbar";
import { KofiButton } from "@/components/layout/kofi-button";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DV3 Tools",
  description: "Dragon Village 3 companion — sticker book tracker, trade board, tier lists and boss guides.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <NextIntlClientProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
          <footer className="mt-8 border-t border-slate-800 py-6 text-center">
            <p className="mb-3 text-xs text-slate-600">DV3 Tools — fan-made companion site, not affiliated with Dragon Village 3</p>
            <KofiButton />
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
