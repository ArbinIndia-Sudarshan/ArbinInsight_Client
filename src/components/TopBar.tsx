import type { Period } from "../models/dashboard";
import PressableIconButton from "./PressableIconButton";
import ArbinLogo from "../assets/ArbinLogo.png";

type TopBarProps = {
  periods: Period[];
  activePeriod: Period;
  onPeriodChange: (period: Period) => void;
};

function TopBar({ periods, activePeriod, onPeriodChange }: TopBarProps) {
  return (
    <header className="topbar panel">
      <div className="topbar__brand">
        <img src={ArbinLogo} width={56} height={56} alt="Arbin logo" />
        <div>
          <h1>ArbinInsight Client</h1>
        </div>
      </div>
      <div className="topbar__controls">
        <div className="segmented-control">
          {periods.map((period) => (
            <button
              key={period}
              className={activePeriod === period ? "is-active" : ""}
              onClick={() => onPeriodChange(period)}
              type="button"
            >
              {period}
            </button>
          ))}
        </div>
        <PressableIconButton label="More options" />
      </div>
    </header>
  );
}

export default TopBar;
