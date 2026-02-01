import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getMessages } from "@/i18n/getMessages";
import { isLocale, locales } from "@/i18n/config";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const generateStaticParams = async () =>
  locales.map((locale) => ({ locale }));

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        locale={locale}
        brand={messages.brand}
        nav={messages.nav}
        cta={messages.hero.ctaPrimary}
      />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} nav={messages.nav} footer={messages.footer} />
    </div>
  );
}
