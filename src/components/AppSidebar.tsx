export type SidebarItem = {
  id: string;
  label: string;
  section: string;
  icon: "grid" | "clock" | "machine" | "yield" | "alert" | "throughput" | "channels" | "report";
};

type AppSidebarProps = {
  items: SidebarItem[];
  activePage: string;
  onSelectPage: (page: string) => void;
};

function AppSidebar({ items, activePage, onSelectPage }: AppSidebarProps) {
  return (
    <aside className="border-r border-slate-200 bg-white px-4 py-5">
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectPage(item.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
              activePage === item.id
                ? "bg-sky-50 text-sky-700 ring-1 ring-sky-200"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-sm text-sky-700">
              {iconFor(item.icon)}
            </span>
            <span className="grid gap-0.5">
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{item.section}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}

function iconFor(icon: SidebarItem["icon"]) {
  return {
    grid: "▣",
    clock: "◔",
    machine: "▤",
    yield: "∿",
    alert: "!",
    throughput: "⇄",
    channels: "()",
    report: "↗",
  }[icon];
}

export default AppSidebar;
