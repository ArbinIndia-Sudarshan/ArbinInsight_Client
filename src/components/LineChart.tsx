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
    <div className="line-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Testing trends chart">
        {yGrid.map((tick) => {
          const y = margin.top + innerHeight - (tick / maxValue) * innerHeight;
          return (
            <g key={tick}>
              <line className="grid-line" x1={margin.left} x2={width - margin.right} y1={y} y2={y} />
              <text x={margin.left - 20} y={y + 4}>
                {tick}
              </text>
            </g>
          );
        })}

        {labels.map((label, index) => {
          const x = margin.left + (innerWidth / denominator) * index;
          return (
            <text key={`${label}-${index}`} x={x} y={height - 10} textAnchor="middle">
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
              <polygon className="line-area" fill={series.fill} points={areaPoints} />
              <polyline className="line-path" stroke={series.color} points={points.join(" ")} />
              {series.values.map((value, index) => {
                const x = margin.left + (innerWidth / denominator) * index;
                const y = margin.top + innerHeight - (value / maxValue) * innerHeight;
                return <circle key={`${series.label}-${index}`} cx={x} cy={y} r="3.2" fill={series.color} />;
              })}
            </g>
          );
        })}
      </svg>

      <div className="chart-legend">
        {trendSeries.map((series) => (
          <span key={series.label}>
            <i className="swatch" style={{ background: series.color }} />
            {series.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default LineChart;
