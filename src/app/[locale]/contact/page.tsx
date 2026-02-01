import { Building2, Mail, MapPin } from "lucide-react";
import { getMessages } from "@/i18n/getMessages";
import { company } from "@/lib/company";

type ContactPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
          MoneyBear
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
          {messages.contact.title}
        </h1>
        <p className="mt-4 text-base text-slate-600">
          {messages.contact.subtitle}
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/70">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Building2 size={22} />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-900">
              {messages.contact.companyLabel}
            </p>
            <p className="mt-2 text-sm text-slate-600">{company.name}</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/70">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <MapPin size={22} />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-900">
              {messages.contact.addressLabel}
            </p>
            <p className="mt-2 text-sm text-slate-600">{company.address}</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/70">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Mail size={22} />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-900">
              {messages.contact.emailLabel}
            </p>
            <a
              href={`mailto:${company.email}`}
              className="mt-2 block text-sm text-emerald-700 hover:text-emerald-900"
            >
              {company.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
