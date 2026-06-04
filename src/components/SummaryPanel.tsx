import type { SummaryStat } from "../models/dashboard";

type SummaryPanelProps = {
  activePeriod: string;
  summaryStats: SummaryStat[];
};

function SummaryPanel({ activePeriod, summaryStats }: SummaryPanelProps) {
  return (
    <section className="summary panel">
      <div className="summary__title">
        <h2>Total Machines</h2>
        <p className="summary__subtitle">{activePeriod} view</p>
      </div>
      <div className="summary__stats">
        {summaryStats.map((item) => (
          <div className="summary-stat" key={item.label}>
            <div className={`summary-stat__value summary-stat__value--${item.color}`}>{item.value}</div>
            <div className="summary-stat__label">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SummaryPanel;
