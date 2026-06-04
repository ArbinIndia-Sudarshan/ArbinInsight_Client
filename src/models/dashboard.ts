export type SummaryStat = {
  value: number;
  label: string;
  color: "blue" | "green" | "red";
};

export type Tone = "blue" | "green" | "red" | "orange" | "slate";
export type MachineTone = "running" | "idle" | "down" | "offline";
export type Period = "Daily" | "Weekly" | "Monthly" | "Yearly";

export type MetricCard = {
  title: string;
  value: string;
  tone: Tone;
};

export type MiniMetric = {
  title: string;
  value: string;
  unit: string;
};

export type MachineCard = {
  name: string;
  status: string;
  channels: string;
  current: string;
  voltage: string;
  capacityLabel: string;
  capacity: string;
  percent: number;
  tone: MachineTone;
};

export type TrendSeries = {
  label: string;
  color: string;
  fill: string;
  values: number[];
};

export type StatusDistribution = {
  label: string;
  value: number;
  color: string;
};

export type ActivityItem = {
  time: string;
  text: string;
};

export type ChannelRow = {
  label: string;
  palette: "green" | "mixed" | "warm";
  count: number;
  active: number;
};

export type DashboardPeriodData = {
  summaryStats: SummaryStat[];
  metricCards: MetricCard[];
  trendSeries: TrendSeries[];
};
