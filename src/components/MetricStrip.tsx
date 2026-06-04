import type { MetricCard } from "../models/dashboard";

type MetricStripProps = {
  metricCards: MetricCard[];
};

function MetricStrip({ metricCards }: MetricStripProps) {
  return (
    <section className="metric-strip">
      {metricCards.map((card) => (
        <article className={`metric-card metric-card--${card.tone}`} key={card.title}>
          <h3>{card.title}</h3>
          <strong>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}

export default MetricStrip;
