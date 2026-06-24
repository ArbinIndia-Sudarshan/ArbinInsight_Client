import { activity } from "../../data/dashboardData";
import type { Machine } from "../../models/machine";
import {
  Card,
  KpiCard,
  Legend,
  MetricRow,
  StatusPill,
} from "./DashboardShared";

type ExecutiveSummaryPageProps = {
  machines: Machine[];
  onlineMachines: Machine[];
  summary: {
    kpis: Array<{
      label: string;
      value: string;
      subtext: string;
      accent: "green" | "blue" | "amber" | "teal" | "red";
    }>;
  };
  machine: Machine | null;
  isConnected: boolean;
  onSelectMachine: (machine: Machine) => void;
};

function ExecutiveSummaryPage({
  machines,
  onlineMachines,
  summary,
  machine,
  isConnected,
  onSelectMachine,
}: ExecutiveSummaryPageProps) {
  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-bold text-slate-900">
          Executive Production Summary
        </h2>
        <p className="text-sm text-slate-600">
          {onlineMachines.length} machines online · Shift started 11:00 UTC ·
          Data refreshes every 30 s
        </p>
      </header>

      <section className="grid gap-3 xl:grid-cols-5">
        {summary.kpis.map((kpi) => (
          <KpiCard key={kpi.label} {...kpi} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,0.92fr)]">
        <div className="space-y-4">
          <section className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[1.05rem] font-semibold uppercase tracking-[0.18em] text-slate-700">
                Machine & Channel Status
              </h3>
              <span
                className={`rounded-md px-2 py-1 text-xs font-semibold ${isConnected ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
              >
                {isConnected ? "LIVE" : "OFFLINE"}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[900px] w-full text-sm">
                <thead className="border-b border-slate-200 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
                  <tr>
                    <th className="pb-4">Machine</th>
                    <th className="pb-4">Status</th>
                    <th className="pb-4">Uptime</th>
                    <th className="pb-4">Ch In Use</th>
                    <th className="pb-4">Curr. Test</th>
                    <th className="pb-4">Progress</th>
                    <th className="pb-4">Last Seen</th>
                  </tr>
                </thead>
                <tbody className="text-slate-800">
                  {machines.map((machine) => (
                    <tr
                      key={machine.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-4">
                        <button
                          type="button"
                          onClick={() => onSelectMachine(machine)}
                          className="text-left font-semibold text-slate-900 hover:text-sky-700"
                        >
                          {machine.name}
                        </button>
                        <div className="font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
                          {machine.operator}
                        </div>
                      </td>
                      <td className="py-4">
                        <StatusPill status={machine.status} />
                      </td>
                      <td className="py-4 font-semibold text-slate-700">
                        {machine.metrics.uptimeHours} hr
                      </td>
                      <td className="py-4 font-semibold text-slate-700">
                        {machine.metrics.channelsInUse} /{" "}
                        {machine.metrics.totalChannels}
                      </td>
                      <td className="py-4 font-semibold text-slate-700">
                        {machine.channels[0]?.testName ?? "--"}
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-emerald-400"
                              style={{ width: `${machine.percent}%` }}
                            />
                          </div>
                          <span className="font-semibold text-slate-700">
                            {machine.percent}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 font-mono text-xs font-semibold text-slate-600">
                        {machine.lastSeenUtc?.split("T")[1]?.replace("Z", "") ??
                          "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-1">
            <Card title="First-Pass Yield — Today">
              <div className="flex items-center gap-6">
                <div className="grid h-28 w-28 place-items-center rounded-full border-[12px] border-emerald-300 text-center">
                  <div>
                    <div className="text-xl font-bold text-slate-900">
                      91.5%
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      Yield
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <Legend color="bg-emerald-400" label="Passed: 43 batteries" />
                  <Legend color="bg-rose-400" label="Failed: 4 batteries" />
                  <Legend color="bg-slate-500" label="In Progress: 0" />
                </div>
              </div>
            </Card>
          </section>

          <Card title="Shift Throughput">
            <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
              <MetricRow
                label="Tested this shift"
                value={String(summary.kpis[0]?.value ?? 0)}
              />
              <MetricRow label="Daily target" value="60" />
              <MetricRow
                label="At current rate"
                value="~54 projected"
                accent="amber"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Online Machines">
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-[10px] uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Machine</th>
                    <th className="px-4 py-3">Bridge Status</th>
                    <th className="px-4 py-3">API Base URL</th>
                  </tr>
                </thead>
                <tbody>
                  {onlineMachines.length > 0 ? (
                    onlineMachines.map((m) => (
                      <tr key={m.id} className="border-t border-slate-200">
                        <td className="px-4 py-3 text-slate-900">{m.name}</td>
                        <td className="px-4 py-3">
                          <StatusPill status={m.status} compact />
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600">
                          {m.id}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-4 text-slate-500" colSpan={3}>
                        No online machines detected.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card title="Required Parameters — Scan Order">
            <div className="space-y-4 text-sm">
              {[
                {
                  title: "Electrical",
                  items: [
                    "Voltage",
                    "Current",
                    "Capacity",
                    "Energy",
                    "Internal Resistance",
                  ],
                },
                {
                  title: "Quality / Health",
                  items: [
                    "State of Health",
                    "First-Pass Yield",
                    "Pass / Fail Count",
                    "Cycle Count",
                    "Chemistry Type",
                  ],
                },
                {
                  title: "Operations",
                  items: [
                    "Machine Uptime / Downtime",
                    "Channel Utilization %",
                    "Test Progress %",
                    "Throughput vs Target",
                  ],
                },
                {
                  title: "Traceability",
                  items: [
                    "Temperature",
                    "Battery ID",
                    "Test Name",
                    "Operator",
                    "Timestamp",
                  ],
                },
              ].map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {group.title}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Recent Activity">
            <div className="space-y-3">
              {activity.map((item) => (
                <div
                  key={`${item.time}-${item.text}`}
                  className="flex items-center gap-3 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="w-16 font-mono text-xs text-slate-500">
                    {item.time}
                  </div>
                  <div className="min-w-0 flex-1 text-sm text-slate-700">
                    {item.text}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Machine Snapshot">
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <MetricRow label="Machine" value={machine?.name ?? "--"} />
                <MetricRow label="Operator" value={machine?.operator ?? "--"} />
                <MetricRow
                  label="IP Address"
                  value={machine?.ipAddress ?? "--"}
                />
                <MetricRow
                  label="Last Seen"
                  value={machine?.lastSeenUtc ?? "--"}
                />
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default ExecutiveSummaryPage;
