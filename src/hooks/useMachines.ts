import { useEffect, useState } from "react";
import { fetchMachines } from "../services/machineService";
import type { Machine } from "../models/machine";

const POLLING_INTERVAL_MS = 5000;

type UseMachinesResult = {
  machines: Machine[];
  isLoading: boolean;
  error: string | null;
};

export function useMachines(): UseMachinesResult {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: number | undefined;

    const loadMachines = async (showLoadingState: boolean) => {
      if (showLoadingState) {
        setIsLoading(true);
      }

      try {
        const data = await fetchMachines();
        if (!isMounted) return;
        setMachines(data);
        setError(null);
      } catch {
        if (!isMounted) return;
        setError("Unable to load machines from the backend.");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    };

    setError(null);
    void loadMachines(true);
    intervalId = window.setInterval(() => {
      void loadMachines(false);
    }, POLLING_INTERVAL_MS);

    return () => {
      isMounted = false;
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, []);

  return { machines, isLoading, error };
}
