import { useMemo, useState } from "react";
import type { Machine, MachineChannel } from "../models/machine";

type MachineDetailPanelProps = {
  machine: Machine | null;
};

function MachineDetailPanel({ machine }: MachineDetailPanelProps) {
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);

  const selectedChannel = useMemo(() => {
    if (!machine) return null;
    return machine.channels.find((channel) => channel.id === (selectedChannelId ?? machine.channels[0]?.id)) ?? machine.channels[0] ?? null;
  }, [machine, selectedChannelId]);

  if (!machine) {
    return (
      <section className="panel machine-detail-panel machine-detail-panel--empty">
        <h3>Select a Machine</h3>
        <p>Choose a BTM card to inspect its channels and battery testing details.</p>
      </section>
    );
  }

  return (
    <section className="panel machine-detail-panel">
      <div className="machine-detail-panel__header">
        <div>
          <p className="eyebrow eyebrow--dark">Machine Inspector</p>
          <h3>{machine.name} Expanded View</h3>
        </div>
        <div className={`machine-badge machine-badge--${machine.tone}`}>{machine.status}</div>
      </div>

      <div className="machine-detail-panel__summary">
        <div className="machine-summary-card">
          <span>IP Address</span>
          <strong>{machine.ipAddress}</strong>
        </div>
        <div className="machine-summary-card">
          <span>Operator</span>
          <strong>{machine.operator}</strong>
        </div>
        <div className="machine-summary-card">
          <span>Channels In Use</span>
          <strong>
            {machine.metrics.channelsInUse}/{machine.metrics.totalChannels}
          </strong>
        </div>
        <div className="machine-summary-card">
          <span>Usage</span>
          <strong>{machine.metrics.usagePercent}%</strong>
        </div>
      </div>

      <div className="machine-detail-panel__content">
        <div className="channel-list panel inset-panel">
          <div className="section-heading">
            <h3>Machine Channels</h3>
          </div>
          <div className="channel-list__items">
            {machine.channels.map((channel) => (
              <button
                key={channel.id}
                className={`channel-list-item${selectedChannel?.id === channel.id ? " is-selected" : ""}`}
                onClick={() => setSelectedChannelId(channel.id)}
                type="button"
              >
                <div>
                  <strong>{channel.name}</strong>
                  <span>{channel.status}</span>
                </div>
                <div className="channel-list-item__meta">
                  <i className={`status-dot status-dot--${mapChannelTone(channel)}`} />
                  <span>{channel.result}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="channel-detail panel inset-panel">
          <div className="section-heading section-heading--spaced">
            <h3>{selectedChannel?.name ?? "Channel Details"}</h3>
            {selectedChannel && <div className={`machine-badge machine-badge--${mapChannelTone(selectedChannel)}`}>{selectedChannel.status}</div>}
          </div>

          {selectedChannel ? (
            <>
              <div className="channel-detail__top">
                <Stat label="Battery ID" value={selectedChannel.details.batteryId} />
                <Stat label="Test Name" value={selectedChannel.testName || "N/A"} />
                <Stat label="Chemistry" value={selectedChannel.details.chemistry} />
                <Stat label="Cycle Count" value={String(selectedChannel.details.cycleCount)} />
                <Stat label="State Of Health" value={`${selectedChannel.details.stateOfHealth}%`} />
              </div>

              <div className="channel-detail__readings">
                <Metric label="Voltage" value={`${selectedChannel.voltage} V`} />
                <Metric label="Current" value={`${selectedChannel.current} A`} />
                <Metric label="Capacity" value={`${selectedChannel.capacityAh} Ah`} />
                <Metric label="Energy" value={`${selectedChannel.energyWh} Wh`} />
                <Metric label="Duration" value={`${selectedChannel.durationMinutes} min`} />
                <Metric label="Temperature" value={`${selectedChannel.details.temperatureC} C`} />
              </div>

              <div className="measurement-card">
                <div className="section-heading section-heading--spaced">
                  <h4>Measurements</h4>
                  <span className="measurement-card__count">
                    {selectedChannel.details.measurements.length} fields
                  </span>
                </div>

                {selectedChannel.details.measurements.length > 0 ? (
                  <div className="measurement-grid">
                    {selectedChannel.details.measurements.map((measurement) => (
                      <div className="measurement-item" key={measurement.name}>
                        <span>{measurement.name}</span>
                        <strong>
                          {formatMeasurementValue(measurement.value)} <em>{measurement.unit}</em>
                        </strong>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="measurement-empty">No measurement fields are available for this channel.</p>
                )}
              </div>

              <div className="channel-progress">
                <div className="machine-card__capacity">
                  <span>Test Progress</span>
                  <strong>{selectedChannel.progress}%</strong>
                </div>
                <div className="progress-bar">
                  <i style={{ width: `${selectedChannel.progress}%` }} />
                </div>
              </div>

              <div className="channel-detail__footer">
                <Stat label="Internal Resistance" value={`${selectedChannel.details.internalResistanceMOhm} mOhm`} />
                <Stat label="Started At" value={selectedChannel.details.startedAt} />
                <Stat label="Updated At" value={selectedChannel.details.updatedAt} />
              </div>

              <div className="channel-notes">
                <span>Observations</span>
                <p>{selectedChannel.details.notes}</p>
              </div>
            </>
          ) : (
            <p>No channel data available for this machine.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="channel-metric">
      <span>{label}</span>
      <strong>{value}</strong>
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
