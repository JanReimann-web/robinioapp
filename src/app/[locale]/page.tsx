import Link from "next/link";
import { Layers, ShieldCheck, Sparkles } from "lucide-react";
import IosInterestForm from "@/components/IosInterestForm";
import PhoneCarousel from "@/components/PhoneCarousel";
import { getMessages } from "@/i18n/getMessages";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const featureIcons = [ShieldCheck, Sparkles, Layers];

  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-900 text-white">
        <div className="absolute inset-0 opacity-40">
          <svg
            className="h-full w-full"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="poly" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#065f46" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <polygon
              points="0,120 240,0 420,160 220,280"
              fill="url(#poly)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <polygon
              points="420,160 720,40 940,200 620,360"
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            <polygon
              points="620,360 940,200 1200,360 880,520"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            <polygon
              points="0,520 220,280 620,360 360,560"
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            <polygon
              points="360,560 620,360 880,520 620,720"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-24 lg:grid-cols-[1.1fr_0.9fr] lg:pt-28">
          <div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {messages.hero.title}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-emerald-100/80">
              {messages.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-950/40 transition hover:-translate-y-0.5 hover:bg-emerald-100"
              >
                {messages.hero.ctaPrimary}
              </Link>
            </div>
            <p className="mt-4 text-sm text-emerald-200/70">
              {messages.hero.note}
            </p>
            <div className="mt-8 rounded-2xl border border-white/15 bg-white/10 p-5 shadow-lg shadow-emerald-950/30 backdrop-blur">
              <IosInterestForm
                title={messages.hero.iosTitle}
                description={messages.hero.iosDescription}
                placeholder={messages.hero.iosPlaceholder}
                cta={messages.hero.iosCta}
                note={messages.hero.iosNote}
                successMessage={messages.hero.iosSuccess}
                duplicateMessage={messages.hero.iosDuplicate}
                errorMessage={messages.hero.iosError}
              />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneCarousel />
          </div>
        </div>
      </section>

      <section id="features" className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
              MoneyBear
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
              {messages.features.title}
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {messages.features.items.map(
              (
                item: { title: string; description: string },
                index: number
              ) => {
                const Icon = featureIcons[index];
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/70"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {item.description}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
