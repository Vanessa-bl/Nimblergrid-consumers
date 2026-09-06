"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import type { PillOption, PillSelectProps } from "./PillSelect.types";

const basePillClasses =
  "inline-flex h-9 cursor-pointer select-none items-center rounded-full border px-3.5 text-sm font-medium transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-rose-500";

const pillStateClasses: Record<"idle" | "selected" | "disabled", string> = {
  idle: "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400 hover:text-zinc-900",
  selected: "border-transparent bg-zinc-900 font-semibold text-white",
  disabled: "cursor-not-allowed border-zinc-200 bg-white text-zinc-400 opacity-60",
};

const ARROW_DIRECTION: Record<string, 1 | -1> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

function resolvePillState(
  selected: boolean,
  optionDisabled: boolean,
): "idle" | "selected" | "disabled" {
  if (optionDisabled) return "disabled";
  if (selected) return "selected";
  return "idle";
}

function resolveTabIndex(
  selected: boolean,
  optionDisabled: boolean,
  groupHasSelection: boolean,
  isFirstEnabled: boolean,
): number {
  if (optionDisabled) return -1;
  if (selected) return 0;
  if (!groupHasSelection && isFirstEnabled) return 0;
  return -1;
}

export function PillSelect({
  label,
  labelHint,
  name,
  options,
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  helper,
  className,
}: Readonly<PillSelectProps>) {
  const groupId = useId();
  const groupName = name ?? groupId;
  const labelId = `${groupId}-label`;
  const messageId = `${groupId}-message`;
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const hasError = error !== undefined && error.trim() !== "";
  const hasHelper = helper !== undefined && helper.trim() !== "";
  let message: string | undefined;
  if (hasError) {
    message = error;
  } else if (hasHelper) {
    message = helper;
  }
  const groupHasSelection = options.some((option) => option.value === value);
  const firstEnabledIndex = options.findIndex(
    (option) => !(disabled || option.disabled === true),
  );

  const handleGroupKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const direction = ARROW_DIRECTION[event.key];
    if (direction === undefined) return;
    const enabledIndexes = options.reduce<number[]>((acc, option, index) => {
      if (!(disabled || option.disabled === true)) {
        acc.push(index);
      }
      return acc;
    }, []);
    if (enabledIndexes.length === 0) return;
    event.preventDefault();
    const focusedIndex = inputRefs.current.findIndex(
      (node) => node === document.activeElement,
    );
    let basePosition: number;
    if (focusedIndex >= 0) {
      basePosition = enabledIndexes.indexOf(focusedIndex);
    } else {
      const optionValues = options.map((option) => option.value);
      const selectedIndex = optionValues.indexOf(value ?? "");
      basePosition = enabledIndexes.indexOf(selectedIndex);
      if (basePosition < 0) {
        basePosition = direction === 1 ? -1 : 0;
      }
    }
    const nextPosition =
      (basePosition + direction + enabledIndexes.length) % enabledIndexes.length;
    const nextOptionIndex = enabledIndexes[nextPosition];
    const nextOption = options[nextOptionIndex];
    if (nextOption !== undefined) {
      inputRefs.current[nextOptionIndex]?.focus();
      onChange(nextOption.value);
    }
  };

  return (
    <div className={className}>
      {label !== undefined ? (
        <div className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-zinc-900">
          <span id={labelId} className="flex items-center gap-1">
            <span>{label}</span>
            {required ? (
              <>
                <span aria-hidden="true" className="text-rose-600">
                  *
                </span>
                <span className="sr-only">(obligatorio)</span>
              </>
            ) : null}
          </span>
          {labelHint}
        </div>
      ) : null}
      <div
        role="radiogroup"
        aria-labelledby={label !== undefined ? labelId : undefined}
        aria-required={required ? true : undefined}
        aria-describedby={message !== undefined ? messageId : undefined}
        onKeyDown={handleGroupKeyDown}
        tabIndex={-1}
        className="flex flex-wrap gap-2"
      >
        {options.map((option: PillOption, index: number) => {
          const selected = option.value === value;
          const optionDisabled = disabled || option.disabled === true;
          const pillState = resolvePillState(selected, optionDisabled);
          const tabIndex = resolveTabIndex(
            selected,
            optionDisabled,
            groupHasSelection,
            index === firstEnabledIndex,
          );
          return (
            <label
              key={option.value}
              className={`${basePillClasses} ${pillStateClasses[pillState]}`}
            >
              <input
                type="radio"
                name={groupName}
                value={option.value}
                checked={selected}
                disabled={optionDisabled}
                tabIndex={tabIndex}
                onChange={() => {
                  onChange(option.value);
                }}
                ref={(node) => {
                  inputRefs.current[index] = node;
                }}
                className="sr-only"
              />
              <span>{option.label}</span>
            </label>
          );
        })}
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
}
