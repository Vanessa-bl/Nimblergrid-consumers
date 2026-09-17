"use client";

import { TextField } from "@/components/ui/form/TextField/TextField";
import type { CurrencyInputProps } from "./CurrencyInput.types";

export const MAX_CURRENCY_DIGITS = 9;

export function normalizeDigits(raw: string, maxLength = MAX_CURRENCY_DIGITS): string {
  return raw.replace(/\D/g, "").slice(0, maxLength);
}

export function groupDigits(digits: string): string {
  const cleaned = normalizeDigits(digits);
  if (cleaned === "") return "";
  return Number(cleaned).toLocaleString("en-US");
}

export function CurrencyInput({
  value,
  onValueChange,
  prefix = "$",
  suffix,
  ...rest
}: Readonly<CurrencyInputProps>) {
  return (
    <TextField
      {...rest}
      inputMode="numeric"
      autoComplete="off"
      value={groupDigits(value)}
      startAdornment={prefix}
      endAdornment={suffix}
      onChange={(event) => {
        onValueChange(normalizeDigits(event.currentTarget.value));
      }}
    />
  );
}
