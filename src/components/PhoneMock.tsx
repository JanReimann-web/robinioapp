export default function PhoneMock() {
  return (
    <div className="relative mx-auto w-64 max-w-full lg:w-[280px]">
      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-emerald-400/30 blur-3xl" />
      <div className="absolute -left-10 bottom-4 h-24 w-24 rounded-full bg-green-400/30 blur-3xl" />
      <div className="relative rounded-[44px] border border-white/25 bg-slate-900/70 p-3 shadow-2xl shadow-emerald-950/50">
        <div className="flex items-center justify-center">
          <div className="h-1.5 w-12 rounded-full bg-white/40" />
        </div>
        <div className="mt-6 space-y-4 rounded-[36px] bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-5">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 p-4 text-white shadow-lg">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">
              Balance
            </p>
            <p className="mt-2 text-2xl font-semibold">€8,420.50</p>
            <p className="mt-1 text-xs text-white/70">Updated just now</p>
          </div>
          <div className="space-y-3">
            <div className="h-10 rounded-xl bg-white/10" />
            <div className="h-10 rounded-xl bg-white/10" />
            <div className="h-10 rounded-xl bg-white/10" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="h-3 w-24 rounded-full bg-white/20" />
            <div className="mt-3 h-2 w-full rounded-full bg-white/10" />
            <div className="mt-2 h-2 w-3/4 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
