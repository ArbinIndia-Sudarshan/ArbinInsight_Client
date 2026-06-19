import type { TrendSeries } from "../models/dashboard";

type LineChartProps = {
  labels: string[];
  trendSeries: TrendSeries[];
};

function LineChart({ labels, trendSeries }: LineChartProps) {
  const width = 720;
  const height = 245;
  const margin = { top: 20, right: 16, bottom: 34, left: 30 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const maxSeriesValue = trendSeries.flatMap((series) => series.values).reduce((max, value) => Math.max(max, value), 0);
  const maxValue = Math.max(10, Math.ceil(maxSeriesValue / 10) * 10);
  const yGrid = Array.from({ length: 6 }, (_, index) => Math.round((maxValue / 5) * index));
  const denominator = Math.max(labels.length - 1, 1);

  return (
    <div className="rounded-[18px] border border-slate-200 bg-white/95 p-4 shadow-panel">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Testing trends chart" className="w-full overflow-visible">
        {yGrid.map((tick) => {
          const y = margin.top + innerHeight - (tick / maxValue) * innerHeight;
          return (
            <g key={tick}>
              <line x1={margin.left} x2={width - margin.right} y1={y} y2={y} stroke="rgba(148, 163, 184, 0.28)" strokeWidth="1" />
              <text x={margin.left - 22} y={y + 4} fill="#64748b" fontSize="12" textAnchor="end">
                {tick}
              </text>
            </g>
          );
        })}

        {labels.map((label, index) => {
          const x = margin.left + (innerWidth / denominator) * index;
          return (
            <text key={`${label}-${index}`} x={x} y={height - 10} fill="#64748b" fontSize="12" textAnchor="middle">
              {label}
            </text>
          );
        })}

        {trendSeries.map((series) => {
          const points = series.values.map((value, index) => {
            const x = margin.left + (innerWidth / denominator) * index;
            const y = margin.top + innerHeight - (value / maxValue) * innerHeight;
            return `${x},${y}`;
          });

          const areaPoints = [
            `${margin.left},${margin.top + innerHeight}`,
            ...points,
            `${margin.left + innerWidth},${margin.top + innerHeight}`,
          ].join(" ");

          return (
            <g key={series.label}>
              <polygon fill={series.fill} points={areaPoints} />
              <polyline fill="none" stroke={series.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points.join(" ")} />
              {series.values.map((value, index) => {
                const x = margin.left + (innerWidth / denominator) * index;
                const y = margin.top + innerHeight - (value / maxValue) * innerHeight;
                return <circle key={`${series.label}-${index}`} cx={x} cy={y} r="3.2" fill={series.color} />;
              })}
            </g>
          );
        })}
      </svg>

      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-700">
        {trendSeries.map((series) => (
          <span key={series.label} className="inline-flex items-center gap-2">
            <span className="inline-flex h-3 w-3 rounded-full" style={{ background: series.color }} />
            {series.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default LineChart;
