import { useState } from "react";

type PressableIconButtonProps = {
  label: string;
  light?: boolean;
};

function PressableIconButton({
  label,
  light = false,
}: PressableIconButtonProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    window.setTimeout(() => setPressed(false), 180);
  };

  return (
    <button
      className={`flex gap-1 h-10 w-10 items-center justify-center rounded-2xl border border-white/20 bg-slate-950/20 text-white transition-all duration-150 ease-out hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
        light ? "border-slate-300/40 text-slate-700 hover:bg-gray-500" : ""
      } ${pressed ? "scale-[0.98]" : ""}`}
      aria-label={label}
      onClick={handleClick}
      type="button"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
    </button>
  );
}

export default PressableIconButton;
