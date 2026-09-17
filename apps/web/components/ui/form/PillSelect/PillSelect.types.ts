import type { ReactNode } from "react";

export type PillOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type PillSelectProps = {
  label?: string;
  labelHint?: ReactNode;
  name?: string;
  options: readonly PillOption[];
  value: string | null;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helper?: string;
  className?: string;
};
