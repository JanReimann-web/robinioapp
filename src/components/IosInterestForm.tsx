"use client";

import { useState } from "react";

type IosInterestFormProps = {
  title: string;
  description: string;
  placeholder: string;
  cta: string;
  note: string;
  emailTo: string;
};

export default function IosInterestForm({
  title,
  description,
  placeholder,
  cta,
  note,
  emailTo,
}: IosInterestFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      return;
    }

    const subject = encodeURIComponent("iOS app interest");
    const body = encodeURIComponent(
      `Please notify me when the iOS app is available.\nEmail: ${email}`
    );
    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-sm text-emerald-100/80">{description}</p>
      </div>
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={placeholder}
          suppressHydrationWarning
          className="h-11 w-full rounded-full border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-emerald-100/60 focus:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-200/40 sm:flex-1"
        />
        <button
          type="submit"
          suppressHydrationWarning
          className="h-11 rounded-full bg-white px-5 text-sm font-semibold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-emerald-100"
        >
          {cta}
        </button>
      </form>
      <p className="text-xs text-emerald-100/70">{note}</p>
    </div>
  );
}
