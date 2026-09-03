import type { ReactNode } from "react";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { CloseIcon } from "@/components/ui/icons/close";
import type { FilterChipButtonProps } from "./FilterChipButton.types";

const DEFAULT_TONE =
  "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-900 hover:text-zinc-900";
const OPEN_TONE = "border-zinc-900 bg-zinc-50 text-zinc-900";
const VALUE_TONE =
  "border-rose-300 bg-white text-rose-600 hover:border-rose-500";
const ACTIVE_TONE = "border-rose-500 bg-rose-50 text-rose-600";

type ChipToneState = {
  selected: boolean | undefined;
  hasValue: boolean;
  isOpen: boolean;
};

function resolveToneClass(state: Readonly<ChipToneState>): string {
  if (state.selected !== undefined) {
    return state.selected ? ACTIVE_TONE : DEFAULT_TONE;
  }
  if (state.hasValue) {
    return state.isOpen ? ACTIVE_TONE : VALUE_TONE;
  }
  return state.isOpen ? OPEN_TONE : DEFAULT_TONE;
}

function resolveTrailingIcon(
  selected: boolean | undefined,
  hasIcon: boolean,
  isOpen: boolean,
): ReactNode {
  if (selected !== undefined) {
    return selected ? <CloseIcon className="h-3.5 w-3.5 shrink-0" /> : null;
  }
  if (!hasIcon) return null;
  return (
    <ChevronDownIcon
      className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
        isOpen ? "rotate-180" : ""
      }`}
    />
  );
}

export function FilterChipButton(props: Readonly<FilterChipButtonProps>) {
  const {
    label,
    isOpen = false,
    hasValue = false,
    hasIcon = true,
    selected,
    buttonRef,
    onClick,
  } = props;

  const isToggle = selected !== undefined;
  const toneClass = resolveToneClass({ selected, hasValue, isOpen });
  const trailingIcon = resolveTrailingIcon(selected, hasIcon, isOpen);

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-expanded={isToggle ? undefined : isOpen}
      aria-pressed={isToggle ? selected : undefined}
      onClick={onClick}
      className={`inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${toneClass}`}
    >
      <span className="whitespace-nowrap">{label}</span>
      {trailingIcon}
    </button>
  );
}
