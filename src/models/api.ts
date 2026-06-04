import type { DashboardPeriodData, Period } from "./dashboard";
import type { Machine } from "./machine";

export type DashboardResponse = {
  period: Period;
  generatedAtUtc: string;
  machines: Machine[];
  dashboardPeriodData: DashboardPeriodData;
};
