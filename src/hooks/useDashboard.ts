import { useEffect, useState } from "react";
import type { DashboardResponse } from "../models/api";
import type { Period } from "../models/dashboard";
import { fetchDashboard } from "../services/dashboardService";

const POLLING_INTERVAL_MS = 5000;

type UseDashboardResult = {
  dashboard: DashboardResponse | null;
  isLoading: boolean;
  error: string | null;
};

export function useDashboard(period: Period): UseDashboardResult {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: number | undefined;

    const loadDashboard = async (showLoadingState: boolean) => {
      if (showLoadingState) {
        setIsLoading(true);
      }

      try {
        const data = await fetchDashboard(period);
        if (!isMounted) return;
        setDashboard(data);
        setError(null);
      } catch {
        if (!isMounted) return;
        setError("Unable to load dashboard data from the backend.");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    setError(null);
    void loadDashboard(true);
    intervalId = window.setInterval(() => {
      void loadDashboard(false);
    }, POLLING_INTERVAL_MS);

    return () => {
      isMounted = false;
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [period]);

  return { dashboard, isLoading, error };
}
