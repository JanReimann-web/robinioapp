import Link from "next/link";
import { getMessages } from "@/i18n/getMessages";

type TipsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TipsPage({ params }: TipsPageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
          MoneyBear
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
          {messages.tips.title}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-slate-600">
          {messages.tips.intro}
        </p>
        <div className="mt-8 grid gap-6">
          {messages.tips.sections.map(
            (section: { title: string; items: string[] }) => (
              <div
                key={section.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/60"
              >
                <h2 className="text-xl font-semibold text-slate-900">
                  {section.title}
                </h2>
                <ul className="mt-4 space-y-3 text-sm text-slate-600">
                  {section.items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
        <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
          <h3 className="text-base font-semibold text-emerald-950">
            {messages.tips.ctaTitle}
          </h3>
          <p className="mt-2 text-sm text-emerald-900/80">
            {messages.tips.ctaBody}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="mt-4 inline-flex w-fit items-center rounded-full bg-emerald-950 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-900"
          >
            {messages.nav.contact}
          </Link>
        </div>
      </div>
    </section>
  );
}
