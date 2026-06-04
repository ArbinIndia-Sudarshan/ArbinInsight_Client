import type { Period } from "../models/dashboard";
import type { DashboardResponse } from "../models/api";

export async function fetchDashboard(
  period: Period,
): Promise<DashboardResponse> {
  const response = await fetch(
    `/api/dashboard/ui?period=${encodeURIComponent(period)}`,
  );

  if (!response.ok) {
    throw new Error(`Dashboard request failed with status ${response.status}`);
  }

  return (await response.json()) as DashboardResponse;
}
