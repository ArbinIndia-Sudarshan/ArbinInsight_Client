import DetailSidebar from "./DetailSidebar";
import MachineDetailPanel from "./MachineDetailPanel";
import type { Machine } from "../models/machine";

type MachineDetailsPageProps = {
  machine: Machine | null;
  onBack: () => void;
};

function MachineDetailsPage({ machine, onBack }: MachineDetailsPageProps) {
  return (
    <section className="mt-5 grid gap-4">
      <button
        className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-sky-700"
        onClick={onBack}
        type="button"
      >
        <span aria-hidden="true">&larr;</span>
        <span>Back to Overview</span>
      </button>
      <div className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Machine Details
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {machine ? `${machine.name} Channel Overview` : "Machine Details"}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Review per-channel test data in a dedicated page and return to the
              dashboard whenever you are done.
            </p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.8fr_minmax(300px,0.95fr)]">
          <div className="flex flex-col gap-4">
            <MachineDetailPanel machine={machine} />
          </div>
          <DetailSidebar machine={machine} />
        </div>
      </div>
    </section>
  );
}

export default MachineDetailsPage;
