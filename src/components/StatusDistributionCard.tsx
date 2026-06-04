import type { StatusDistribution } from "../models/dashboard";

type StatusDistributionCardProps = {
  items: StatusDistribution[];
};

function StatusDistributionCard({ items }: StatusDistributionCardProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let start = 0;
  const donutStyle = {
    background: `conic-gradient(${items
      .map((item) => {
        const size = (item.value / total) * 100;
        const slice = `${item.color} ${start}% ${start + size}%`;
        start += size;
        return slice;
      })
      .join(", ")})`,
  };

  return (
    <article className="panel donut-card">
      <div className="section-heading">
        <h3>Status Distribution</h3>
      </div>
      <div className="donut-layout">
        <div className="donut" style={donutStyle} />
        <div className="legend">
          {items.map((item) => (
            <span key={item.label}>
              <i className="swatch" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default StatusDistributionCard;
