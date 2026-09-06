"use client";

import { forwardRef, useId } from "react";
import type { TextFieldProps } from "./TextField.types";

type FieldChrome = "default" | "readOnly" | "disabled" | "error";

const chromeClasses: Record<FieldChrome, string> = {
  default: "border-zinc-300 bg-white hover:border-zinc-400",
  readOnly: "cursor-default border-zinc-200 bg-zinc-50",
  disabled: "cursor-not-allowed border-zinc-200 bg-zinc-100",
  error: "border-rose-500",
};

const textClasses: Record<FieldChrome, string> = {
  default: "text-zinc-900",
  readOnly: "text-zinc-600",
  disabled: "text-zinc-400",
  error: "text-zinc-900",
};

function resolveChrome(hasError: boolean, readOnly: boolean, disabled: boolean): FieldChrome {
  if (disabled) return "disabled";
  if (readOnly) return "readOnly";
  if (hasError) return "error";
  return "default";
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    {
      label,
      labelHint,
      required = false,
      error,
      helper,
      startAdornment,
      endAdornment,
      className,
      id,
      disabled = false,
      readOnly = false,
      ...inputProps
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const messageId = `${inputId}-message`;
    const hasError = error !== undefined && error.trim() !== "";
    const hasHelper = helper !== undefined && helper.trim() !== "";
    const chrome = resolveChrome(hasError, readOnly, disabled);
    let message: string | undefined;
    if (hasError) {
      message = error;
    } else if (hasHelper) {
      message = helper;
    }

    return (
      <div className={className}>
        {label !== undefined ? (
          <div className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-900">
            <label htmlFor={inputId} className="flex items-center gap-1">
              <span>{label}</span>
              {required ? (
                <>
                  <span aria-hidden="true" className="text-rose-600">
                    *
                  </span>
                  <span className="sr-only">(obligatorio)</span>
                </>
              ) : null}
            </label>
            {labelHint}
          </div>
        ) : null}
        <div
          className={`flex h-11 w-full items-center gap-2 rounded-xl border px-3.5 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-rose-500 ${chromeClasses[chrome]}`}
        >
          {startAdornment !== undefined ? (
            <span
              aria-hidden="true"
              className="pointer-events-none shrink-0 text-sm font-medium text-zinc-400"
            >
              {startAdornment}
            </span>
          ) : null}
          <input
            {...inputProps}
            ref={ref}
            id={inputId}
            required={required}
            aria-required={required ? true : undefined}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={hasError ? true : undefined}
            aria-describedby={message !== undefined ? messageId : undefined}
            className={`min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400 ${textClasses[chrome]}`}
          />
          {endAdornment !== undefined ? (
            <span
              aria-hidden="true"
              className="pointer-events-none shrink-0 text-sm font-medium text-zinc-400"
            >
              {endAdornment}
            </span>
          ) : null}
        </div>
        {message !== undefined ? (
          <p
            id={messageId}
            className={`mt-1.5 text-xs ${hasError ? "text-rose-600" : "text-zinc-500"}`}
          >
            {message}
          </p>
        ) : null}
      </div>
    );
  },
);
