import { useRef, type CSSProperties, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { createReveal } from "./reveal-core";

interface RevealGroupProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
  /** Delay between each direct child's reveal, in seconds (~0.04–0.06 per the plan). */
  stagger?: number;
}

export function RevealGroup({ children, className, style, id, stagger = 0.05 }: RevealGroupProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return undefined;
    const mm = createReveal(Array.from(ref.current.children), ref.current, { stagger });
    return () => mm.revert();
  }, [stagger]);

  return (
    <div ref={ref} id={id} className={className} style={style}>
      {children}
    </div>
  );
}
