import { useEffect, useMemo, useState } from "react";
import { periods } from "./data/dashboardData";
import type { Period, StatusDistribution } from "./models/dashboard";
import type { Machine } from "./models/machine";
import DetailSidebar from "./components/DetailSidebar";
import LineChart from "./components/LineChart";
import MachineDetailsPage from "./components/MachineDetailsPage";
import MachineGrid from "./components/MachineGrid";
import MetricStrip from "./components/MetricStrip";
import StatusDistributionCard from "./components/StatusDistributionCard";
import SummaryPanel from "./components/SummaryPanel";
import TopBar from "./components/TopBar";
import { useDashboard } from "./hooks/useDashboard";

type AppView = "overview" | "machine-details";

function App() {
  const [activePeriod, setActivePeriod] = useState<Period>("Weekly");
  const { dashboard, isLoading, error } = useDashboard(activePeriod);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AppView>("overview");
  const machines = dashboard?.machines ?? [];
  const currentDashboard = dashboard?.dashboardPeriodData ?? { summaryStats: [], metricCards: [], trendSeries: [] };
  const selectedMachine = useMemo(
    () => machines.find((machine) => machine.id === (selectedMachineId ?? machines[0]?.id)) ?? machines[0] ?? null,
    [machines, selectedMachineId]
  );
  const statusDistribution = useMemo<StatusDistribution[]>(
    () => buildStatusDistribution(machines),
    [machines]
  );
  const trendLabels = useMemo(
    () => buildTrendLabels(activePeriod, currentDashboard.trendSeries[0]?.values.length ?? 0),
    [activePeriod, currentDashboard.trendSeries]
  );

  useEffect(() => {
    window.history.replaceState({ view: "overview" satisfies AppView }, "", window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      const nextView = (event.state?.view as AppView | undefined) ?? "overview";
      setCurrentView(nextView);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleOpenMachine = (machine: Machine) => {
    setSelectedMachineId(machine.id);
    setCurrentView("machine-details");
    window.history.pushState({ view: "machine-details" satisfies AppView, machineId: machine.id }, "", window.location.href);
  };

  const handleBackToOverview = () => {
    if (window.history.state?.view === "machine-details") {
      window.history.back();
      return;
    }

    setCurrentView("overview");
    window.history.replaceState({ view: "overview" satisfies AppView }, "", window.location.href);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-[1700px] overflow-x-hidden px-[clamp(12px,2vw,22px)] py-6">
        <TopBar periods={periods} activePeriod={activePeriod} onPeriodChange={setActivePeriod} />

        {currentView === "machine-details" ? (
          <MachineDetailsPage machine={selectedMachine} onBack={handleBackToOverview} />
        ) : (
          <section className="mt-5 grid gap-4 xl:grid-cols-[1.8fr_minmax(300px,0.95fr)]">
            <div className="flex flex-col gap-4">
              <SummaryPanel activePeriod={activePeriod} summaryStats={currentDashboard.summaryStats} />
              <MetricStrip metricCards={currentDashboard.metricCards} />

              <section className="grid gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(280px,1fr)]">
                <article className="rounded-[18px] border border-slate-200 bg-white/95 p-4 shadow-panel">
                  <div className="mb-3 flex items-center gap-3">
                    <h3 className="text-[1.45rem] font-semibold text-slate-900">Testing Trends</h3>
                  </div>
                  <LineChart labels={trendLabels} trendSeries={currentDashboard.trendSeries} />
                </article>

                <StatusDistributionCard items={statusDistribution} />
              </section>

              {error ? (
                <div className="rounded-[18px] border border-rose-200 bg-rose-50/80 p-4 text-slate-700 font-semibold shadow-sm">
                  Error: {error}
                </div>
              ) : null}
              {isLoading ? (
                <div className="rounded-[18px] border border-slate-200 bg-white/95 p-4 text-slate-700 font-semibold shadow-panel">
                  Loading machine data...
                </div>
              ) : (
                <MachineGrid
                  machines={machines}
                  selectedMachineId={selectedMachine?.id ?? null}
                  onSelectMachine={handleOpenMachine}
                />
              )}
            </div>

            <DetailSidebar machine={selectedMachine} />
          </section>
        )}
      </main>
    </div>
  );
}

function buildStatusDistribution(machines: Machine[]): StatusDistribution[] {
  const totals = machines.reduce(
    (accumulator, machine) => {
      accumulator[machine.status] += 1;
      return accumulator;
    },
    { Running: 0, Idle: 0, Unsafe: 0, Down: 0, Offline: 0 }
  );

  return [
    { label: "Running", value: totals.Running, color: "#3da556" },
    { label: "Idle", value: totals.Idle, color: "#f3bb3d" },
    { label: "Unsafe", value: totals.Unsafe, color: "#df4b43" },
    { label: "Down", value: totals.Down, color: "#2a74d8" },
    { label: "Offline", value: totals.Offline, color: "#344f72" },
  ];
}

function buildTrendLabels(period: Period, pointCount: number): string[] {
  const now = new Date();

  return Array.from({ length: pointCount }, (_, index) => {
    const reverseIndex = pointCount - index - 1;
    const date = new Date(now);

    if (period === "Daily") {
      date.setHours(now.getHours() - reverseIndex);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    if (period === "Weekly") {
      date.setDate(now.getDate() - reverseIndex);
      return date.toLocaleDateString([], { weekday: "short" });
    }

    if (period === "Monthly") {
      date.setDate(now.getDate() - reverseIndex * 7);
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    date.setMonth(now.getMonth() - reverseIndex);
    return date.toLocaleDateString([], { month: "short" });
  });
}

export default App;
