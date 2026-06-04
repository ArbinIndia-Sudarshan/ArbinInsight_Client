import type { Machine } from "../models/machine";

type MachineGridProps = {
  machines: Machine[];
  selectedMachineId: string | null;
  onSelectMachine: (machine: Machine) => void;
};

function MachineGrid({ machines, selectedMachineId, onSelectMachine }: MachineGridProps) {
  return (
    <section className="machine-grid">
      {machines.map((machine) => (
        <button
          className={`machine-card machine-card--interactive${selectedMachineId === machine.id ? " is-selected" : ""}`}
          key={machine.id}
          onClick={() => onSelectMachine(machine)}
          type="button"
        >
          <div className={`machine-card__header bg-${machine.tone}`}>
            <h4>{machine.name}</h4>
            <span className="machine-card__status">{machine.status}</span>
          </div>
          <div className="machine-card__body">
            <div className="machine-card__channels">
              <span>Channels {machine.channelsLabel}</span>
              <div className="machine-card__battery">
                <div className="machine-card__battery-fill" style={{ width: `${Math.max(12, machine.percent)}%` }} />
              </div>
            </div>

            <div className="machine-card__readings">
              <div className="reading">
                <strong>{machine.currentLabel}</strong>
                <span>Current</span>
              </div>
              <div className="reading">
                <strong>{machine.voltageLabel}</strong>
                <span>Voltage</span>
              </div>
            </div>

            <div className="machine-card__progress">
              <div className="machine-card__capacity">
                <span>{machine.capacityLabel}</span>
                <strong>{machine.capacityValue}</strong>
              </div>
              <div className="progress-bar">
                <i style={{ width: `${machine.percent}%` }} />
              </div>
              <div className="machine-card__percent">{machine.percent}%</div>
            </div>
          </div>
        </button>
      ))}
    </section>
  );
}

export default MachineGrid;
