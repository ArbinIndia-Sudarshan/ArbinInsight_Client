import { useState } from "react";

type PressableIconButtonProps = {
  label: string;
  light?: boolean;
};

function PressableIconButton({ label, light = false }: PressableIconButtonProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    window.setTimeout(() => setPressed(false), 180);
  };

  return (
    <button
      className={`icon-button${light ? " icon-button--light" : ""}${pressed ? " is-pressed" : ""}`}
      aria-label={label}
      onClick={handleClick}
      type="button"
    >
      <span />
      <span />
      <span />
    </button>
  );
}

export default PressableIconButton;
