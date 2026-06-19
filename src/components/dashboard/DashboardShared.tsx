import type { ReactNode } from "react";

export function PageShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
      <header className="mb-4">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </header>
      {children}
    </section>
  );
}

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-600">{title}</h3>
      </div>
      {children}
    </section>
  );
}

export function StatusPill({ status, compact = false }: { status: string; compact?: boolean }) {
  const cls =
    status === "Running"
      ? "bg-emerald-100 text-emerald-700"
      : status === "Idle"
      ? "bg-amber-100 text-amber-700"
      : "bg-rose-100 text-rose-700";
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${cls} ${compact ? "uppercase tracking-[0.16em]" : ""}`}>
      {status}
    </span>
  );
}

export function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded-sm ${color}`} />
      {label}
    </span>
  );
}

export function MetricRow({ label, value, accent }: { label: string; value: string; accent?: "amber" }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 py-2 last:border-b-0">
      <span className="text-slate-500">{label}</span>
      <span className={accent === "amber" ? "font-semibold text-amber-700" : "font-semibold text-slate-900"}>{value}</span>
    </div>
  );
}

export function AlertBar({ tone, title, text, action }: { tone: "danger" | "warn"; title: string; text: string; action: string }) {
  return (
    <div className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 ${tone === "danger" ? "border-rose-200 bg-rose-50" : "border-amber-200 bg-amber-50"}`}>
      <div className="flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${tone === "danger" ? "bg-rose-400" : "bg-amber-400"}`} />
        <div>
          <div className="text-sm font-semibold text-slate-900">{title}</div>
          <div className="text-xs text-slate-600">{text}</div>
        </div>
      </div>
      <button className="rounded-md border border-sky-600 px-3 py-1.5 text-sm text-sky-700 hover:bg-sky-50">{action}</button>
    </div>
  );
}

export function KpiCard({ label, value, subtext, accent }: { label: string; value: string; subtext: string; accent: "green" | "blue" | "amber" | "teal" | "red" }) {
  const accentMap = {
    green: "border-t-emerald-400",
    blue: "border-t-sky-500",
    amber: "border-t-amber-400",
    teal: "border-t-cyan-400",
    red: "border-t-rose-500",
  };
  return (
    <article className={`rounded-[18px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 border-t-4 ${accentMap[accent]}`}>
      <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
      <div className="mt-2 text-sm text-slate-600" dangerouslySetInnerHTML={{ __html: subtext }} />
    </article>
  );
}
