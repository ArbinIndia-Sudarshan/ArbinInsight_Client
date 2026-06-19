import type { SummaryStat } from "../models/dashboard";

type SummaryPanelProps = {
  activePeriod: string;
  summaryStats: SummaryStat[];
};

function SummaryPanel({ activePeriod, summaryStats }: SummaryPanelProps) {
  return (
    <section className="rounded-[18px] bg-white/95 border border-slate-200 shadow-panel p-4">
      <div className="mb-4 grid gap-4 sm:grid-cols-[minmax(180px,220px)_1fr]">
        <div className="flex flex-col justify-center gap-2 border-r border-slate-200 pr-4 sm:border-r sm:pb-0 sm:pr-4">
          <h2 className="text-2xl font-semibold text-slate-900">Total Machines</h2>
          <p className="text-sm font-semibold uppercase tracking-[0.04em] text-slate-500">{activePeriod} view</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {summaryStats.map((item) => (
            <div key={item.label} className="rounded-xl border-r border-slate-200 pr-4 last:border-r-0 last:pr-0">
              <div className={`text-2xl font-black ${
                item.color === "blue"
                  ? "text-slate-900"
                  : item.color === "green"
                  ? "text-emerald-600"
                  : item.color === "text-rose-600"
              }`}>
                {item.value}
              </div>
              <div className="mt-2 text-sm font-semibold text-slate-600">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SummaryPanel;
