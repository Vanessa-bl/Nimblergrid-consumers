import type { ComponentPropsWithRef, ReactNode } from "react";

export type TextFieldProps = {
  label?: string;
  labelHint?: ReactNode;
  required?: boolean;
  error?: string;
  helper?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  className?: string;
} & Omit<ComponentPropsWithRef<"input">, "size">;
