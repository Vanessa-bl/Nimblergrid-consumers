import type { TextFieldProps } from "@/components/ui/form/TextField/TextField.types";

export type CurrencyInputProps = {
  value: string;
  onValueChange: (digits: string) => void;
  prefix?: string;
  suffix?: string;
} & Omit<
  TextFieldProps,
  | "value"
  | "onChange"
  | "startAdornment"
  | "endAdornment"
  | "type"
  | "inputMode"
  | "maxLength"
>;
