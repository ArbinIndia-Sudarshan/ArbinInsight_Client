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
    <aside className="content-side">
      <section className="panel detail-card">
        <div className="section-heading section-heading--spaced">
          <h3>{selectedMachine?.name ?? "Machine"} Details</h3>
          <PressableIconButton label="Panel options" light />
        </div>

        <dl className="detail-list">
          <div>
            <dt>IP Address</dt>
            <dd>{selectedMachine?.ipAddress ?? "--"}</dd>
          </div>
          <div>
            <dt>Operator</dt>
            <dd>{selectedMachine?.operator ?? "--"}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <span className={`status-pill status-pill--${selectedMachine?.tone ?? "idle"}`}>{selectedMachine?.status ?? "Unknown"}</span>
            </dd>
          </div>
        </dl>

        <div className="mini-metrics">
          {[
            { title: "Uptime", value: String(metrics?.uptimeHours ?? 0), unit: "hrs" },
            { title: "Downtime", value: String(metrics?.downtimeHours ?? 0), unit: "hrs" },
            { title: "Running Hours", value: String(metrics?.runningHours ?? 0), unit: "hrs" },
          ].map((card) => (
            <div className="mini-metric" key={card.title}>
              <h4>{card.title}</h4>
              <strong>
                {card.value} <span>{card.unit}</span>
              </strong>
            </div>
          ))}
        </div>

        <div className="side-stat-row">
          {[
            { title: "Batteries Tested", value: String(metrics?.batteriesTested ?? 0), tone: "green" },
            { title: "Passed", value: String(metrics?.passed ?? 0), tone: "green" },
            { title: "Failed", value: String(metrics?.failed ?? 0), tone: "slate" },
          ].map((card) => (
            <div className={`side-stat side-stat--${card.tone}`} key={card.title}>
              <h4>{card.title}</h4>
              <strong>{card.value}</strong>
            </div>
          ))}
        </div>

        <div className="panel inset-panel channel-panel">
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
            <div className="channel-row" key={row.label}>
              <span>{row.label}</span>
              <div
                className={`channel-blocks palette-${row.palette}`}
                style={{ gridTemplateColumns: `repeat(${Math.min(row.count, 16)}, 1fr)` }}
              >
                {Array.from({ length: row.count }, (_, index) => (
                  <i className={index < row.active ? "is-active" : undefined} key={`${row.label}-${index}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="side-bottom">
        <article className="panel heatmap-card">
          <div className="section-heading">
            <h3>Channel Status</h3>
          </div>
          <div className="heatmap">
            {heatmapColors.map((color, index) => (
              <i key={index} style={{ background: color }} />
            ))}
          </div>
          <div className="legend legend--small">
            <span><i className="dot dot--green" />Active</span>
            <span><i className="dot dot--yellow" />Idle</span>
            <span><i className="dot dot--red" />Fault</span>
          </div>
        </article>

        <article className="panel activity-card">
          <div className="section-heading section-heading--spaced">
            <h3>Recent Activity</h3>
            <PressableIconButton label="Activity options" light />
          </div>
          <div className="activity-list">
            {activity.map((item) => (
              <div className="activity-item" key={`${item.time}-${item.text}`}>
                <div className="activity-time">{item.time}</div>
                <div className="activity-text">{item.text}</div>
                <div className="activity-arrow">&#8250;</div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </aside>
  );
}

export default DetailSidebar;
