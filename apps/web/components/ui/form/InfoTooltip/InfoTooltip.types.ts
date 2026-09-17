import type { ReactNode } from "react";

export type InfoTooltipProps = {
  content: ReactNode;
  label?: string;
  placement?: "left" | "right";
  className?: string;
};
