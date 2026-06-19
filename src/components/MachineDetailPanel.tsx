import { useMemo, useState } from "react";
import type { Machine, MachineChannel } from "../models/machine";

type MachineDetailPanelProps = {
  machine: Machine | null;
};

function MachineDetailPanel({ machine }: MachineDetailPanelProps) {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  const selectedChannel = useMemo(() => {
    if (!machine) return null;
    return (
      machine.channels.find((channel) => channel.id === (selectedChannelId ?? machine.channels[0]?.id)) ??
      machine.channels[0] ??
      null
    );
  }, [machine, selectedChannelId]);

  const toneStyles: Record<string, string> = {
    running: "from-emerald-500 to-emerald-700 text-white",
    idle: "from-amber-400 to-orange-600 text-white",
    down: "from-slate-500 to-slate-700 text-white",
    offline: "from-rose-500 to-red-600 text-white",
  };

  if (!machine) {
    return (
      <section className="rounded-[18px] border border-slate-200 bg-white/95 p-8 text-center shadow-panel">
        <h3 className="mb-3 text-xl font-semibold text-slate-900">Select a Machine</h3>
        <p className="text-sm leading-6 text-slate-600">
          Choose a BTM card to inspect its channels and battery testing details.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-6 rounded-[22px] border border-slate-200 bg-white/95 p-6 shadow-panel">
      <div className="flex flex-col gap-4 rounded-[18px] bg-slate-50/90 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Machine Inspector</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{machine.name} Expanded View</h3>
        </div>
        <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-bold ${toneStyles[machine.tone] ?? toneStyles.offline}`}>
          {machine.status}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[18px] bg-slate-50 p-4 shadow-sm">
          <span className="text-sm font-medium text-slate-500">IP Address</span>
          <strong className="mt-2 block text-lg text-slate-900">{machine.ipAddress}</strong>
        </div>
        <div className="rounded-[18px] bg-slate-50 p-4 shadow-sm">
          <span className="text-sm font-medium text-slate-500">Operator</span>
          <strong className="mt-2 block text-lg text-slate-900">{machine.operator}</strong>
        </div>
        <div className="rounded-[18px] bg-slate-50 p-4 shadow-sm">
          <span className="text-sm font-medium text-slate-500">Channels In Use</span>
          <strong className="mt-2 block text-lg text-slate-900">
            {machine.metrics.channelsInUse}/{machine.metrics.totalChannels}
          </strong>
        </div>
        <div className="rounded-[18px] bg-slate-50 p-4 shadow-sm">
          <span className="text-sm font-medium text-slate-500">Usage</span>
          <strong className="mt-2 block text-lg text-slate-900">{machine.metrics.usagePercent}%</strong>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(260px,320px)_minmax(0,1fr)]">
        <div className="rounded-[18px] border border-slate-200 bg-slate-50/90 p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="text-lg font-semibold text-slate-900">Machine Channels</h3>
          </div>
          <div className="grid gap-3">
            {machine.channels.map((channel) => {
              const isSelected = selectedChannel?.id === channel.id;
              const channelToneColor =
                mapChannelTone(channel) === "running"
                  ? "bg-emerald-500"
                  : mapChannelTone(channel) === "idle"
                  ? "bg-amber-400"
                  : mapChannelTone(channel) === "offline"
                  ? "bg-rose-500"
                  : "bg-slate-500";

              return (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannelId(channel.id)}
                  type="button"
                  className={`flex w-full items-center justify-between gap-4 rounded-3xl border px-4 py-4 text-left transition ${
                    isSelected
                      ? "border-sky-300 bg-sky-50/80"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <div>
                    <strong className="block text-sm font-semibold text-slate-900">{channel.name}</strong>
                    <span className="text-sm text-slate-500">{channel.status}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                    <span className={`inline-flex h-3 w-3 rounded-full ${channelToneColor}`} />
                    <span>{channel.result}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[18px] border border-slate-200 bg-white/95 p-4 shadow-sm">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{selectedChannel?.name ?? "Channel Details"}</h3>
              {selectedChannel && (
                <div className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
                  mapChannelTone(selectedChannel) === "running"
                    ? "bg-emerald-500 text-white"
                    : mapChannelTone(selectedChannel) === "idle"
                    ? "bg-amber-400 text-slate-900"
                    : mapChannelTone(selectedChannel) === "offline"
                    ? "bg-rose-500 text-white"
                    : "bg-slate-500 text-white"
                }`}>
                  {selectedChannel.status}
                </div>
              )}
            </div>

            {selectedChannel ? (
              <>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Stat label="Battery ID" value={selectedChannel.details.batteryId} />
                  <Stat label="Test Name" value={selectedChannel.testName || "N/A"} />
                  <Stat label="Chemistry" value={selectedChannel.details.chemistry} />
                  <Stat label="Cycle Count" value={String(selectedChannel.details.cycleCount)} />
                  <Stat label="State Of Health" value={`${selectedChannel.details.stateOfHealth}%`} />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <Metric label="Voltage" value={`${selectedChannel.voltage} V`} />
                  <Metric label="Current" value={`${selectedChannel.current} A`} />
                  <Metric label="Capacity" value={`${selectedChannel.capacityAh} Ah`} />
                  <Metric label="Energy" value={`${selectedChannel.energyWh} Wh`} />
                  <Metric label="Duration" value={`${selectedChannel.durationMinutes} min`} />
                  <Metric label="Temperature" value={`${selectedChannel.details.temperatureC} C`} />
                </div>

                <div className="rounded-[18px] border border-slate-200 bg-slate-50/90 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="text-base font-semibold text-slate-900">Measurements</h4>
                    <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold text-slate-700">
                      {selectedChannel.details.measurements.length} fields
                    </span>
                  </div>

                  {selectedChannel.details.measurements.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {selectedChannel.details.measurements.map((measurement) => (
                        <div key={measurement.name} className="rounded-2xl bg-white p-4 shadow-sm">
                          <span className="block text-sm text-slate-500">{measurement.name}</span>
                          <strong className="mt-2 block text-base text-slate-900">
                            {formatMeasurementValue(measurement.value)} <em className="font-normal text-slate-500">{measurement.unit}</em>
                          </strong>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm leading-6 text-slate-600">No measurement fields are available for this channel.</p>
                  )}
                </div>

                <div className="rounded-[18px] border border-slate-200 bg-slate-50/90 p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Test Progress</p>
                      <strong className="text-xl font-semibold text-slate-900">{selectedChannel.progress}%</strong>
                    </div>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-600"
                      style={{ width: `${selectedChannel.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Stat label="Internal Resistance" value={`${selectedChannel.details.internalResistanceMOhm} mOhm`} />
                  <Stat label="Started At" value={selectedChannel.details.startedAt} />
                  <Stat label="Updated At" value={selectedChannel.details.updatedAt} />
                </div>

                <div className="rounded-[18px] bg-slate-50/90 p-4 text-slate-700">
                  <span className="text-sm font-semibold text-slate-900">Observations</span>
                  <p className="mt-2 text-sm leading-6">{selectedChannel.details.notes}</p>
                </div>
              </>
            ) : (
              <p className="text-sm leading-6 text-slate-600">No channel data available for this machine.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <strong className="mt-2 block text-base text-slate-900">{value}</strong>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 shadow-sm">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <strong className="mt-2 block text-base text-slate-900">{value}</strong>
    </div>
  );
}

function formatMeasurementValue(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function mapChannelTone(channel: MachineChannel): "running" | "idle" | "down" | "offline" {
  if (channel.status === "Running" || channel.status === "Active" || channel.result === "In Progress") return "running";
  if (channel.status === "Unsafe" || channel.result === "Failed" || channel.result === "Unsafe" || channel.status === "Failed") return "offline";
  return "down";
}

export default MachineDetailPanel;
