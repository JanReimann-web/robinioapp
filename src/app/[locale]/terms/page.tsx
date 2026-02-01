import { getMessages } from "@/i18n/getMessages";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
          Robinio
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
          {messages.terms.title}
        </h1>
        <p className="mt-6 text-base text-slate-600">{messages.terms.intro}</p>
        <ul className="mt-6 space-y-3 text-base text-slate-600">
          {messages.terms.items.map((item: string) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-base text-slate-600">{messages.terms.closing}</p>
      </div>
    </section>
  );
}
