import MachineGrid from "../MachineGrid";
import type { Machine } from "../../models/machine";
import { StatusPill } from "./DashboardShared";

type MachineStatusPageProps = {
  machines: Machine[];
  onSelectMachine: (machine: Machine) => void;
};

function MachineStatusPage({
  machines,
  onSelectMachine,
}: MachineStatusPageProps) {
  const liveMachines = machines;

  return (
    <div className="space-y-4">
      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Machines Detected
          </div>
          <div className="mt-2 text-3xl font-bold text-slate-900">
            {liveMachines.length}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Bridge Source
          </div>
          <div className="mt-2 text-sm font-semibold text-sky-700">
            udp-bridge.js → websocket
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60">
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
            View State
          </div>
          <div className="mt-2 text-sm font-semibold text-emerald-700">
            {liveMachines.length > 0
              ? "Live data received"
              : "Waiting for bridge data"}
          </div>
        </div>
      </section>

      <section className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[1.05rem] font-semibold uppercase tracking-[0.18em] text-slate-700">
            Machine Status
          </h3>
          <span
            className={`rounded-md px-2 py-1 text-xs font-semibold ${liveMachines.length > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
          >
            {liveMachines.length > 0 ? "LIVE" : "OFFLINE"}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[860px] w-full text-sm">
            <thead className="border-b border-slate-200 text-left text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="pb-4">Machine</th>
                <th className="pb-4">Bridge Status</th>
                <th className="pb-4">API Base URL</th>
                <th className="pb-4">Last Seen</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-800">
              {liveMachines.length > 0 ? (
                liveMachines.map((machine) => (
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
                    <td className="py-4 font-mono text-xs text-slate-600">
                      {machine.id}
                    </td>
                    <td className="py-4 font-mono text-xs text-slate-600">
                      {machine.lastSeenUtc?.split("T")[1]?.replace("Z", "") ??
                        "--"}
                    </td>
                    <td className="py-4">
                      <button
                        type="button"
                        onClick={() => onSelectMachine(machine)}
                        className="rounded-md border border-sky-600 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-50"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-6 text-slate-500" colSpan={5}>
                    Waiting for a payload from{" "}
                    <span className="font-mono text-slate-300">
                      udp-bridge.js
                    </span>
                    .
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <MachineGrid
        machines={machines}
        selectedMachineId={null}
        onSelectMachine={onSelectMachine}
      />
    </div>
  );
}

export default MachineStatusPage;
