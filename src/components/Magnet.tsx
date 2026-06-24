import { useState, type MouseEvent, type ReactNode } from "react";

export function Magnet({
  children,
  className,
  disabled = false,
  strength = 5,
}: {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  strength?: number;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0, active: false });

  function handleMove(event: MouseEvent<HTMLDivElement>) {
    if (disabled) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - (bounds.left + bounds.width / 2)) / strength;
    const y = (event.clientY - (bounds.top + bounds.height / 2)) / strength;
    setOffset({ x, y, active: true });
  }

  return (
    <div
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0, active: false })}
      style={{
        transform: disabled ? undefined : `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: disabled
          ? undefined
          : offset.active
            ? "transform 0.3s ease-out"
            : "transform 0.6s ease-in-out",
      }}
    >
      {children}
    </div>
  );
}
