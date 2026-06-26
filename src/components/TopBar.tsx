import type { Period } from "../models/dashboard";
import PressableIconButton from "./PressableIconButton";
import UserProfileMenu from "./UserProfileMenu";
import ArbinLogo from "../assets/ArbinLogo.png";

type TopBarProps = {
  periods: Period[];
  activePeriod: Period;
  onPeriodChange: (period: Period) => void;
};

function TopBar({ periods, activePeriod, onPeriodChange }: TopBarProps) {
  return (
    <header className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-lg shadow-slate-200/60 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <img
            src={ArbinLogo}
            width={56}
            height={56}
            alt="Arbin logo"
            className="h-14 w-14 rounded-2xl bg-slate-100 object-contain"
          />
          <div>
            <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              ArbinInsight Client
            </h1>
            <p className="text-sm text-slate-500">Battery testing dashboard</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1">
            {periods.map((period) => (
              <button
                key={period}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activePeriod === period
                    ? "bg-sky-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
                onClick={() => onPeriodChange(period)}
                type="button"
              >
                {period}
              </button>
            ))}
          </div>
          {/* <PressableIconButton label="More options" /> */}
          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}

export default TopBar;
