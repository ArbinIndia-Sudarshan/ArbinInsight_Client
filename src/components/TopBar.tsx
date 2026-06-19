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
    <header className="rounded-[18px] bg-gradient-to-r from-sky-500 via-cyan-500 to-slate-900 p-4 shadow-panel text-white sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img src={ArbinLogo} width={56} height={56} alt="Arbin logo" className="h-14 w-14 rounded-2xl bg-white/10 object-contain" />
          <div>
            <h1 className="text-xl font-semibold sm:text-2xl">ArbinInsight Client</h1>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="inline-flex rounded-full bg-slate-950/15 p-1 backdrop-blur-sm">
            {periods.map((period) => (
              <button
                key={period}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activePeriod === period
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-100 hover:bg-white/20"
                }`}
                onClick={() => onPeriodChange(period)}
                type="button"
              >
                {period}
              </button>
            ))}
          </div>
          <PressableIconButton label="More options" />
        </div>
      </div>
    </header>
  );
}

export default TopBar;
