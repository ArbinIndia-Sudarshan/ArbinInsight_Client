import {
  activity,
  heatmapColors,
} from "../data/dashboardData";
import type { Machine } from "../models/machine";
import PressableIconButton from "./PressableIconButton";

type DetailSidebarProps = {
  machine: Machine | null;
};

function DetailSidebar({ machine }: DetailSidebarProps) {
  const selectedMachine = machine;
  const metrics = selectedMachine?.metrics;

  return (
    <aside className="flex flex-col gap-4">
      <section className="rounded-[18px] border border-slate-200 bg-white/95 p-4 shadow-panel">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xl font-semibold text-slate-900">{selectedMachine?.name ?? "Machine"} Details</h3>
          <PressableIconButton label="Panel options" light />
        </div>

        <dl className="grid gap-4 border-b border-slate-200 pb-4">
          <div className="grid grid-cols-[96px_1fr] items-center gap-4">
            <dt className="text-sm font-semibold text-slate-600">IP Address</dt>
            <dd className="text-base font-semibold text-slate-900">{selectedMachine?.ipAddress ?? "--"}</dd>
          </div>
          <div className="grid grid-cols-[96px_1fr] items-center gap-4">
            <dt className="text-sm font-semibold text-slate-600">Operator</dt>
            <dd className="text-base font-semibold text-slate-900">{selectedMachine?.operator ?? "--"}</dd>
          </div>
          <div className="grid grid-cols-[96px_1fr] items-center gap-4">
            <dt className="text-sm font-semibold text-slate-600">Status</dt>
            <dd>
              <span className={`inline-flex items-center rounded-xl px-4 py-2 text-sm font-bold text-white ${
                selectedMachine?.tone === "running"
                  ? "bg-gradient-to-b from-emerald-500 to-emerald-700"
                  : selectedMachine?.tone === "idle"
                  ? "bg-gradient-to-b from-amber-400 to-orange-600"
                  : selectedMachine?.tone === "down"
                  ? "bg-gradient-to-b from-slate-500 to-slate-700"
                  : "bg-gradient-to-b from-rose-500 to-red-600"
              }`}>{selectedMachine?.status ?? "Unknown"}</span>
            </dd>
          </div>
        </dl>

        <div className="grid gap-3 pt-4 sm:grid-cols-3">
          {[
            { title: "Uptime", value: String(metrics?.uptimeHours ?? 0), unit: "hrs" },
            { title: "Downtime", value: String(metrics?.downtimeHours ?? 0), unit: "hrs" },
            { title: "Running Hours", value: String(metrics?.runningHours ?? 0), unit: "hrs" },
          ].map((card) => (
            <div key={card.title} className="rounded-xl bg-slate-950/5 p-4 shadow-sm">
              <h4 className="text-sm font-medium text-slate-500">{card.title}</h4>
              <strong className="mt-2 block text-2xl font-semibold text-slate-900">
                {card.value} <span className="text-sm font-medium text-slate-500">{card.unit}</span>
              </strong>
            </div>
          ))}
        </div>

        <div className="grid gap-3 pt-4 sm:grid-cols-3">
          {[
            { title: "Batteries Tested", value: String(metrics?.batteriesTested ?? 0), tone: "green" },
            { title: "Passed", value: String(metrics?.passed ?? 0), tone: "green" },
            { title: "Failed", value: String(metrics?.failed ?? 0), tone: "slate" },
          ].map((card) => (
            <div
              className={`rounded-xl p-4 text-white shadow-sm ${
                card.tone === "green"
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-700"
                  : "bg-gradient-to-br from-slate-500 to-slate-700"
              }`}
              key={card.title}
            >
              <h4 className="text-sm font-medium">{card.title}</h4>
              <strong className="mt-2 block text-2xl font-semibold">{card.value}</strong>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-slate-950/5 p-4 text-slate-900 shadow-sm">
          {[
            {
              label: "Total Channels",
              palette: "green",
              count: Math.max(selectedMachine?.metrics.totalChannels ?? 0, 1),
              active: selectedMachine?.metrics.channelsInUse ?? 0,
            },
            {
              label: "Channels in Use",
              palette: "mixed",
              count: Math.max(selectedMachine?.metrics.totalChannels ?? 0, 1),
              active: selectedMachine?.metrics.channelsInUse ?? 0,
            },
            {
              label: `Usage: ${selectedMachine?.metrics.usagePercent ?? 0}%`,
              palette: "warm",
              count: Math.max(selectedMachine?.metrics.totalChannels ?? 0, 1),
              active: Math.round(((selectedMachine?.metrics.usagePercent ?? 0) / 100) * Math.max(selectedMachine?.metrics.totalChannels ?? 0, 1)),
            },
          ].map((row) => (
            <div key={row.label} className="mb-4 last:mb-0">
              <div className="mb-2 text-sm font-semibold text-slate-600">{row.label}</div>
              <div className="grid gap-2 sm:grid-cols-[120px_1fr] items-center">
                <div className="grid gap-1 grid-cols-[repeat(16,minmax(0,1fr))] overflow-hidden rounded-xl bg-slate-200/70 p-1">
                  {Array.from({ length: Math.min(row.count, 16) }, (_, index) => (
                    <span
                      key={`${row.label}-${index}`}
                      className={`h-2 rounded-sm ${
                        index < row.active
                          ? row.palette === "warm"
                            ? "bg-gradient-to-b from-orange-400 to-rose-500"
                            : row.palette === "mixed"
                            ? index < 5
                              ? "bg-gradient-to-b from-amber-400 to-orange-600"
                              : "bg-gradient-to-b from-emerald-500 to-emerald-700"
                            : "bg-gradient-to-b from-emerald-500 to-emerald-700"
                          : "bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-700">{row.active}/{row.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="rounded-[18px] border border-slate-200 bg-white/95 p-4 shadow-panel">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Channel Status</h3>
          </div>
          <div className="grid grid-cols-[repeat(11,minmax(0,1fr))] gap-2 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 p-2 border border-slate-200">
            {heatmapColors.map((color, index) => (
              <span key={index} className="aspect-square rounded-sm" style={{ background: color }} />
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold text-slate-900">
            <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-emerald-500" />Active</span>
            <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-amber-400" />Idle</span>
            <span className="inline-flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-full bg-rose-500" />Fault</span>
          </div>
        </article>

        <article className="rounded-[18px] border border-slate-200 bg-white/95 p-4 shadow-panel">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-900">Recent Activity</h3>
            <PressableIconButton label="Activity options" light />
          </div>
          <div className="space-y-3">
            {activity.map((item) => (
              <div key={`${item.time}-${item.text}`} className="grid grid-cols-[54px_1fr_20px] items-center gap-3 border-b border-slate-200 pb-3 last:border-b-0 last:pb-0">
                <div className="font-semibold text-slate-700">{item.time}</div>
                <div className="text-slate-600 font-medium">{item.text}</div>
                <div className="text-right text-lg text-slate-400">&#8250;</div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </aside>
  );
}

export default DetailSidebar;
