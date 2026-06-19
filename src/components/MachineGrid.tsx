import type { Machine } from "../models/machine";

type MachineGridProps = {
  machines: Machine[];
  selectedMachineId: string | null;
  onSelectMachine: (machine: Machine) => void;
};

function MachineGrid({ machines, selectedMachineId, onSelectMachine }: MachineGridProps) {
  const toneClasses: Record<string, string> = {
    blue: "from-sky-500 to-slate-700",
    green: "from-emerald-500 to-green-700",
    red: "from-rose-500 to-red-700",
    orange: "from-orange-400 to-orange-600",
    slate: "from-slate-500 to-slate-700",
  };

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {machines.map((machine) => {
        const selected = selectedMachineId === machine.id;
        return (
          <button
            key={machine.id}
            onClick={() => onSelectMachine(machine)}
            type="button"
            className={`group w-full overflow-hidden rounded-[22px] border px-4 py-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-400 ${
              selected ? "border-sky-300 bg-sky-50" : "border-slate-200 bg-white"
            }`}
          >
            <div className={`rounded-[18px] bg-gradient-to-br px-4 py-4 text-white ${toneClasses[machine.tone] ?? toneClasses.slate}`}>
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-lg font-semibold">{machine.name}</h4>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/90">
                  {machine.status}
                </span>
              </div>
            </div>
            <div className="mt-4 grid gap-4">
              <div className="grid gap-2">
                <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                  <span>Channels {machine.channelsLabel}</span>
                  <span className="font-semibold text-slate-900">{machine.percent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-600"
                    style={{ width: `${Math.max(12, machine.percent)}%` }}
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Current</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{machine.currentLabel}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Voltage</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{machine.voltageLabel}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                  <span>{machine.capacityLabel}</span>
                  <strong className="text-slate-900">{machine.capacityValue}</strong>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-600"
                    style={{ width: `${machine.percent}%` }}
                  />
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </section>
  );
}

export default MachineGrid;
