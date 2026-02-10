"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Entry = {
  email: string;
  createdAt: string;
};

export default function AdminPage() {
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";
  const isEt = locale === "et";

  const copy = useMemo(
    () =>
      isEt
        ? {
            title: "Admin",
            subtitle: "Laadi iOS huviliste e-postid ja ekspordi CSV.",
            codeLabel: "Admin-kood",
            codePlaceholder: "Sisesta kood",
            loadButton: "Lae andmed",
            exportButton: "Ekspordi CSV",
            countLabel: "Kokku",
            empty: "Kirjeid pole.",
            error: "Ligipääs keelatud või midagi läks valesti.",
            delete: "Kustuta",
            confirmDelete: "Kas oled kindel, et soovid selle e-posti eemaldada?",
            helper:
              "See leht on kaitstud admin-koodiga ja pole avalikult linkitud.",
          }
        : {
            title: "Admin",
            subtitle: "Load iOS interest emails and export CSV.",
            codeLabel: "Admin code",
            codePlaceholder: "Enter code",
            loadButton: "Load entries",
            exportButton: "Export CSV",
            countLabel: "Total",
            empty: "No entries yet.",
            error: "Unauthorized or something went wrong.",
            delete: "Delete",
            confirmDelete:
              "Are you sure you want to remove this email from the list?",
            helper:
              "This page is protected by an admin code and not linked publicly.",
          },
    [isEt]
  );

  const [code, setCode] = useState("");
  const [entries, setEntries] = useState<Entry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadEntries = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ios-interest", {
        headers: { "x-admin-code": code },
      });
      if (!response.ok) {
        throw new Error("Request failed");
      }
      const data = (await response.json()) as { entries: Entry[] };
      setEntries(data.entries ?? []);
    } catch {
      setError(copy.error);
      setEntries(null);
    } finally {
      setLoading(false);
    }
  };

  const exportCsv = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ios-interest/export", {
        headers: { "x-admin-code": code },
      });
      if (!response.ok) {
        throw new Error("Export failed");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "ios-interest.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError(copy.error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (email: string) => {
    if (!code || deletingEmail) return;
    const confirmed = window.confirm(copy.confirmDelete);
    if (!confirmed) return;

    setDeletingEmail(email);
    setError("");
    try {
      const response = await fetch("/api/ios-interest", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "x-admin-code": code },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        throw new Error("Delete failed");
      }
      setEntries((prev) =>
        prev ? prev.filter((entry) => entry.email !== email) : prev
      );
    } catch {
      setError(copy.error);
    } finally {
      setDeletingEmail(null);
    }
  };

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-4xl px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600">
          {copy.title}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
          {copy.subtitle}
        </h1>
        <p className="mt-3 text-sm text-slate-500">{copy.helper}</p>

        <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/70">
          <label className="text-sm font-semibold text-slate-700">
            {copy.codeLabel}
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder={copy.codePlaceholder}
              className="h-11 w-full rounded-full border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200/50 sm:flex-1"
            />
            <button
              type="button"
              onClick={loadEntries}
              disabled={!code || loading}
              className="h-11 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {copy.loadButton}
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={!code || loading}
              className="h-11 rounded-full border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {copy.exportButton}
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-lg shadow-slate-200/70">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>{copy.countLabel}</span>
            <span className="font-semibold text-slate-900">
              {entries ? entries.length : "—"}
            </span>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-600">
            {entries && entries.length === 0 && <p>{copy.empty}</p>}
            {entries?.map((entry) => (
              <div
                key={`${entry.email}-${entry.createdAt}`}
                className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-slate-900">
                    {entry.email}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => deleteEntry(entry.email)}
                  disabled={loading || deletingEmail === entry.email}
                  className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {copy.delete}
                </button>
              </div>
            ))}
            {!entries && (
              <p className="text-slate-400">{copy.empty}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
