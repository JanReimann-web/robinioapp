import Link from "next/link";
import { getMessages } from "@/i18n/getMessages";

type PricingPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const pricing = messages.pricing;

  const playStoreUrl =
    "https://play.google.com/store/apps/details?id=com.jan.moneybear";
  const hasPlayStoreUrl = playStoreUrl.trim().length > 0;

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
          MoneyBear
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
          {pricing.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
          {pricing.subtitle}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              {pricing.trialEyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-900">
              {pricing.trialTitle}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {pricing.trialBody}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50 to-emerald-100/60 p-6 shadow-lg shadow-emerald-200/60">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              {pricing.premiumEyebrow}
            </p>
            <div className="mt-3 text-3xl font-semibold text-slate-900">
              {pricing.premiumPrice}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              {pricing.premiumBody}
            </p>
            <p className="mt-4 text-xs text-slate-500">{pricing.note}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          {hasPlayStoreUrl ? (
            <a
              href={playStoreUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200/70 transition hover:-translate-y-0.5 hover:bg-emerald-500"
            >
              {pricing.ctaPrimary}
            </a>
          ) : (
            <span
              aria-disabled="true"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600/60 px-6 py-3 text-sm font-semibold text-white/90 shadow-lg shadow-emerald-200/70"
            >
              {pricing.ctaPrimary}
            </span>
          )}
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50"
          >
            {pricing.ctaSecondary}
          </Link>
        </div>
      </div>
    </section>
  );
}
