import { useEffect, useMemo, useState } from "react";
import TopBar from "./components/TopBar";
import AppSidebar, { type SidebarItem } from "./components/AppSidebar";
import MachineDetailsPage from "./components/MachineDetailsPage";
import ExecutiveSummaryPage from "./components/dashboard/ExecutiveSummaryPage";
import MachineStatusPage from "./components/dashboard/MachineStatusPage";
import { PageShell } from "./components/dashboard/DashboardShared";
import { periods } from "./data/dashboardData";
import { useUdpBridge } from "./hooks/useUdpBridge";
import type { Machine, MachineChannel } from "./models/machine";

type AppView =
  | "overview"
  | "shift-performance"
  | "machine-status"
  | "yield"
  | "alarms"
  | "throughput"
  | "channels"
  | "reports"
  | "machine-details";

const sidebarItems: SidebarItem[] = [
  { id: "overview", label: "Executive Summary", section: "Overview", icon: "grid" },
  { id: "shift-performance", label: "Shift Performance", section: "Overview", icon: "clock" },
  { id: "machine-status", label: "Machine Status", section: "Overview", icon: "machine" },
  { id: "yield", label: "Yield & Pass Rate", section: "Quality", icon: "yield" },
  { id: "alarms", label: "Alarms & Faults", section: "Quality", icon: "alert" },
  { id: "throughput", label: "Throughput", section: "Operations", icon: "throughput" },
  { id: "channels", label: "Channel Utilization", section: "Operations", icon: "channels" },
  { id: "reports", label: "Reports", section: "Operations", icon: "report" },
];

function App() {
  const { beacon, isConnected } = useUdpBridge();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<AppView>("overview");
  const [activePeriod, setActivePeriod] = useState<(typeof periods)[number]>("Weekly");

  useEffect(() => {
    if (!beacon) return;
    const machine = createMachineFromBeacon(beacon);
    setMachines((currentMachines) => {
      const next = [...currentMachines];
      const idx = next.findIndex((item) => item.id === machine.id);
      if (idx >= 0) {
        next[idx] = machine;
        return next;
      }
      return [machine, ...next];
    });
    setSelectedMachineId((current) => current ?? machine.id);
  }, [beacon]);

  const selectedMachine = useMemo(
    () =>
      machines.find((machine) => machine.id === (selectedMachineId ?? machines[0]?.id)) ??
      machines[0] ??
      null,
    [machines, selectedMachineId],
  );

  const onlineMachines = useMemo(
    () => machines.filter((machine) => machine.status === "Running"),
    [machines],
  );

  const summary = useMemo(() => buildSummary(machines), [machines]);

  const onSelectView = (view: string) => setCurrentView(view as AppView);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="w-full px-0">
        <TopBar periods={periods} activePeriod={activePeriod} onPeriodChange={setActivePeriod} />
        <div className="grid min-h-[calc(100vh-92px)] grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]">
          <AppSidebar items={sidebarItems} activePage={currentView} onSelectPage={onSelectView} />

          <main className="min-w-0 bg-slate-100 px-4 py-5 lg:px-6">
            {currentView === "machine-details" ? (
              <section className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60">
                <MachineDetailsPage machine={selectedMachine} onBack={() => setCurrentView("overview")} />
              </section>
            ) : currentView === "overview" ? (
              <ExecutiveSummaryPage
                machines={machines}
                onlineMachines={onlineMachines}
                summary={summary}
                machine={selectedMachine}
                isConnected={isConnected}
                onSelectMachine={(machine) => {
                  setSelectedMachineId(machine.id);
                  setCurrentView("machine-details");
                }}
              />
            ) : (
              <PageShell title={titleFor(currentView)} subtitle={subtitleFor(currentView)}>
                {pageBody(currentView, machines, (machine) => {
                  setSelectedMachineId(machine.id);
                  setCurrentView("machine-details");
                })}
              </PageShell>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function pageBody(view: AppView, machines: Machine[], onSelectMachine: (machine: Machine) => void) {
  if (view === "overview") return null;
  if (view === "shift-performance") {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {["Batteries Tested", "Uptime Hours", "Utilization", "Online Machines"].map((label) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-700 shadow-lg shadow-slate-200/60">
            {label}
          </div>
        ))}
      </div>
    );
  }
  if (view === "machine-status") {
    return <MachineStatusPage machines={machines} onSelectMachine={onSelectMachine} />;
  }
  if (view === "yield") return <div className="text-slate-700">Yield page.</div>;
  if (view === "alarms") return <div className="text-slate-700">Alarms page.</div>;
  if (view === "throughput") return <div className="text-slate-700">Throughput page.</div>;
  if (view === "channels") return <div className="text-slate-700">Channel utilization page.</div>;
  if (view === "machine-details") return <MachineDetailsPage machine={machines[0] ?? null} onBack={() => void 0} />;
  return <div className="text-slate-700">Reports page.</div>;
}

function buildSummary(machines: Machine[]) {
  const online = machines.filter((m) => m.status === "Running").length;
  const offline = machines.length - online;
  return {
    kpis: [
      { label: "Batteries Tested Today", value: String(sum(machines, "batteriesTested")), subtext: `Target 60 · <span class="text-rose-400">-${Math.max(0, 60 - sum(machines, "batteriesTested"))}</span>`, accent: "green" as const },
      { label: "First-Pass Yield", value: `${yieldPct(machines)}%`, subtext: `Prev shift 89.2% · <span class="text-emerald-400">+2.3pp</span>`, accent: "blue" as const },
      { label: "Machines Online", value: `${online} / ${Math.max(machines.length, 1)}`, subtext: `Uptime avg 98.4% today`, accent: "amber" as const },
      { label: "Channel Utilization", value: `${utilPct(machines)}%`, subtext: `2 of 2 channels active`, accent: "teal" as const },
      { label: "Open Faults", value: String(offline), subtext: `Ch 8 · ARBIN-RITESH · <span class="text-rose-400">Unresolved</span>`, accent: "red" as const },
    ],
  };
}

function sum(machines: Machine[], key: "batteriesTested" | "passed" | "failed" | "channelsInUse" | "totalChannels" | "uptimeHours") {
  return machines.reduce((acc, machine) => acc + machine.metrics[key], 0);
}

function yieldPct(machines: Machine[]) {
  const passed = sum(machines, "passed");
  const failed = sum(machines, "failed");
  return Math.round((passed / Math.max(passed + failed, 1)) * 1000) / 10;
}

function utilPct(machines: Machine[]) {
  const inUse = sum(machines, "channelsInUse");
  const total = sum(machines, "totalChannels");
  return Math.round((inUse / Math.max(total, 1)) * 100);
}

function titleFor(view: AppView) {
  const titles: Record<AppView, string> = {
    overview: "Executive Production Summary",
    "shift-performance": "Shift Performance",
    "machine-status": "Machine Status",
    yield: "Yield & Pass Rate",
    alarms: "Alarms & Faults",
    throughput: "Throughput",
    channels: "Channel Utilization",
    reports: "Reports",
    "machine-details": "Machine Details",
  };
  return titles[view];
}

function subtitleFor(view: AppView) {
  const subtitles: Record<AppView, string> = {
    overview: "Live production posture, faults, and machine health.",
    "shift-performance": "Production pace and uptime snapshot.",
    "machine-status": "Machine registry and live bridge state.",
    yield: "Pass/fail overview for the current shift.",
    alarms: "Fault conditions requiring attention.",
    throughput: "Testing volume versus target.",
    channels: "Channel occupancy and spare capacity.",
    reports: "Audit-oriented list of tracked machines.",
    "machine-details": "Per-machine channel and test breakdown.",
  };
  return subtitles[view];
}

function createMachineFromBeacon(beacon: import("./models/bridge").BeaconPayload): Machine {
  const channel: MachineChannel = {
    id: `${beacon.machineName}-chan-1`,
    name: "Channel 1",
    testName: "Beacon Monitor",
    slot: 1,
    status: beacon.isOnline ? "Running" : "Idle",
    result: beacon.isOnline ? "In Progress" : "Failed",
    progress: beacon.isOnline ? 100 : 0,
    voltage: 48,
    current: 1.2,
    capacityAh: 12.5,
    energyWh: 600,
    durationMinutes: 0,
    details: {
      batteryId: beacon.appId,
      chemistry: "N/A",
      cycleCount: 0,
      temperatureC: 0,
      internalResistanceMOhm: 0,
      stateOfHealth: beacon.isOnline ? 100 : 0,
      startedAt: beacon.timestampUtc,
      updatedAt: beacon.timestampUtc,
      notes: `WebSocket message received from ${beacon.stationName} (${beacon.apiBaseUrl}:${beacon.apiPort}).`,
      measurements: [],
    },
  };

  return {
    id: beacon.apiBaseUrl,
    name: beacon.machineName,
    status: beacon.isOnline ? "Running" : "Offline",
    tone: beacon.isOnline ? "running" : "offline",
    operator: beacon.stationName,
    ipAddress: `${beacon.apiBaseUrl}:${beacon.apiPort}`,
    lastSeenUtc: beacon.timestampUtc,
    channelsLabel: "1/1",
    currentLabel: `${beacon.isOnline ? "1.2" : "0.0"} A`,
    voltageLabel: "48 V",
    capacityLabel: "Capacity",
    capacityValue: beacon.isOnline ? "12.5 Ah" : "0 Ah",
    percent: beacon.isOnline ? 100 : 0,
    metrics: {
      uptimeHours: beacon.isOnline ? 1 : 0,
      downtimeHours: beacon.isOnline ? 0 : 1,
      runningHours: beacon.isOnline ? 1 : 0,
      batteriesTested: 1,
      passed: beacon.isOnline ? 1 : 0,
      failed: beacon.isOnline ? 0 : 1,
      usagePercent: beacon.isOnline ? 100 : 0,
      channelsInUse: 1,
      totalChannels: 1,
    },
    channels: [channel],
  };
}

export default App;
