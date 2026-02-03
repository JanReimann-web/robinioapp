"use client";

import { useState } from "react";

type IosInterestFormProps = {
  title: string;
  description: string;
  placeholder: string;
  cta: string;
  note: string;
  successMessage: string;
  duplicateMessage: string;
  errorMessage: string;
};

type SubmitStatus = "idle" | "loading" | "success" | "error";

export default function IosInterestForm({
  title,
  description,
  placeholder,
  cta,
  note,
  successMessage,
  duplicateMessage,
  errorMessage,
}: IosInterestFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      return;
    }

    setStatus("loading");
    setFeedbackMessage("");
    try {
      const response = await fetch("/api/ios-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        duplicate?: boolean;
      };

      if (!response.ok || data.ok === false) {
        throw new Error("Request failed");
      }

      setEmail("");
      setFeedbackMessage(data.duplicate ? duplicateMessage : successMessage);
      setStatus("success");
    } catch {
      setStatus("error");
    }
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
          disabled={status === "loading"}
        />
        <button
          type="submit"
          suppressHydrationWarning
          className="h-11 rounded-full bg-white px-5 text-sm font-semibold text-emerald-950 transition hover:-translate-y-0.5 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={status === "loading"}
        >
          {cta}
        </button>
      </form>
      {status === "success" && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-200/30 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-50"
        >
          {feedbackMessage || successMessage}
        </div>
      )}
      {status === "error" && (
        <p role="alert" className="text-xs text-red-200">
          {errorMessage}
        </p>
      )}
      {status === "idle" && (
        <p className="text-xs text-emerald-100/70">{note}</p>
      )}
    </div>
  );
}
