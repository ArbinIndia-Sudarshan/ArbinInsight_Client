import DetailSidebar from "./DetailSidebar";
import MachineDetailPanel from "./MachineDetailPanel";
import type { Machine } from "../models/machine";

type MachineDetailsPageProps = {
  machine: Machine | null;
  onBack: () => void;
};

function MachineDetailsPage({ machine, onBack }: MachineDetailsPageProps) {
  return (
    <section className="details-page">
      <div className="panel details-page__hero">
        <button className="back-button" onClick={onBack} type="button">
          <span aria-hidden="true">&larr;</span>
          <span>Back to Overview</span>
        </button>
        <div>
          <p className="eyebrow eyebrow--dark">Machine Details</p>
          <h2>
            {machine ? `${machine.name} Channel Overview` : "Machine Details"}
          </h2>
          <p className="details-page__copy">
            Review per-channel test data in a dedicated page and return to the
            dashboard whenever you are done.
          </p>
        </div>
      </div>

      <div className="content-grid">
        <div className="content-main">
          <MachineDetailPanel machine={machine} />
        </div>
        <DetailSidebar machine={machine} />
      </div>
    </section>
  );
}

export default MachineDetailsPage;
