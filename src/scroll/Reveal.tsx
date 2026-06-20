import { useRef, type CSSProperties, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { createReveal } from "./reveal-core";

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

export function Reveal({ children, className, style, id }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return undefined;
    const mm = createReveal(ref.current, ref.current);
    return () => mm.revert();
  }, []);

  return (
    <div ref={ref} id={id} className={className} style={style}>
      {children}
    </div>
  );
}
