import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-rose-500">
      {children}
    </span>
  );
}
