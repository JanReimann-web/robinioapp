import Link from "next/link";
import { company } from "@/lib/company";

type NavLabels = {
  home: string;
  privacy: string;
  terms: string;
  contact: string;
};

type FooterLabels = {
  tagline: string;
  company: string;
  address: string;
  domain: string;
  email: string;
  rights: string;
};

type FooterProps = {
  locale: string;
  nav: NavLabels;
  footer: FooterLabels;
};

export default function Footer({ locale, nav, footer }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-lg font-semibold text-white">
            R
          </span>
          <p className="text-lg font-semibold text-white">{footer.company}</p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Links
          </p>
          <div className="flex flex-col gap-2">
            <Link href={`/${locale}`} className="hover:text-white">
              {nav.home}
            </Link>
            <Link href={`/${locale}/privacy`} className="hover:text-white">
              {nav.privacy}
            </Link>
            <Link href={`/${locale}/terms`} className="hover:text-white">
              {nav.terms}
            </Link>
            <Link href={`/${locale}/contact`} className="hover:text-white">
              {nav.contact}
            </Link>
          </div>
        </div>

        <div className="space-y-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Company
          </p>
          <div className="space-y-2 text-slate-400">
            <p>{footer.company}</p>
            <p>{footer.address}</p>
            <p>{footer.domain}</p>
            <p>{footer.email}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {footer.company}. {footer.rights}
          </p>
          <p>{footer.email}</p>
        </div>
      </div>
    </footer>
  );
}
