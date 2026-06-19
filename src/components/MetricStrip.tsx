import type { MetricCard } from "../models/dashboard";

type MetricStripProps = {
  metricCards: MetricCard[];
};

function MetricStrip({ metricCards }: MetricStripProps) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {metricCards.map((card) => (
        <article
          className={`rounded-[14px] p-4 text-white shadow-panel ${
            card.tone === "blue"
              ? "bg-gradient-to-br from-blue-500 to-slate-700"
              : card.tone === "green"
              ? "bg-gradient-to-br from-emerald-500 to-emerald-700"
              : card.tone === "red"
              ? "bg-gradient-to-br from-rose-500 to-red-600"
              : card.tone === "orange"
              ? "bg-gradient-to-br from-orange-400 to-orange-700"
              : "bg-gradient-to-br from-slate-600 to-slate-800"
          }`}
          key={card.title}
        >
          <h3 className="text-sm font-semibold text-slate-100">{card.title}</h3>
          <strong className="mt-2 block text-2xl font-bold">{card.value}</strong>
        </article>
      ))}
    </section>
  );
}

export default MetricStrip;
