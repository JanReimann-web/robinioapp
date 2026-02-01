import { getMessages } from "@/i18n/getMessages";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
          Robinio
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
          {messages.privacy.title}
        </h1>
        <p className="mt-6 text-base leading-relaxed text-slate-600">
          {messages.privacy.body}
        </p>
      </div>
    </section>
  );
}
