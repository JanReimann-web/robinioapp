import Image from "next/image";
import Link from "next/link";
import { company } from "@/lib/company";

type NavLabels = {
  home: string;
  privacy: string;
  terms: string;
  contact: string;
  tips: string;
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
    <footer className="bg-emerald-950 text-emerald-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex items-center justify-center md:justify-start">
          <Image
            src="/RobinioInvest.png"
            alt={`${footer.company} logo`}
            width={1400}
            height={650}
            className="h-44 w-auto max-w-full object-contain brightness-110 contrast-110 sm:h-40 md:h-48 lg:h-56"
          />
        </div>

        <div className="space-y-3 text-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
            Links
          </p>
          <div className="flex flex-col gap-2">
            <Link href={`/${locale}`} className="hover:text-white">
              {nav.home}
            </Link>
            <Link href={`/${locale}/tips`} className="hover:text-white">
              {nav.tips}
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300/70">
            Company
          </p>
          <div className="space-y-2 text-emerald-200/80">
            <p>{footer.company}</p>
            <p>{footer.address}</p>
            <p>{footer.domain}</p>
            <p>{footer.email}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-4 text-xs text-emerald-300/70 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {footer.company}. {footer.rights}
          </p>
          <p>{footer.email}</p>
        </div>
      </div>
    </footer>
  );
}
