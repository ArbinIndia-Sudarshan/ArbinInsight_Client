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
    <article className="rounded-[18px] bg-white/95 border border-slate-200 shadow-panel p-4">
      <div className="mb-4 flex items-center">
        <h3 className="text-xl font-semibold text-slate-900">Status Distribution</h3>
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(150px,190px)_minmax(0,1fr)] items-center">
        <div className="mx-auto w-full max-w-[190px] rounded-full" style={donutStyle}>
          <div className="m-[54px] h-[calc(100%-108px)] rounded-full bg-slate-50" />
        </div>
        <div className="grid gap-3">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3 text-sm font-semibold text-slate-900">
              <span className="inline-flex h-3 w-3 rounded" style={{ background: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default StatusDistributionCard;
