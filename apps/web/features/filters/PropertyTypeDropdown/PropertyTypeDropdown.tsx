import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PropertyAnyIcon } from "@/components/ui/icons/property-any";
import { PropertyApartmentIcon } from "@/components/ui/icons/property-apartment";
import { PropertyCondoIcon } from "@/components/ui/icons/property-condo";
import { PropertySingleIcon } from "@/components/ui/icons/property-single";
import { PropertyTownhomeIcon } from "@/components/ui/icons/property-townhome";
import { FilterChipButton } from "@/features/filters/FilterChipButton/FilterChipButton";
import { usePopover } from "@/features/filters/shared/use-popover";
import type { PropertyTypeDropdownProps } from "./PropertyTypeDropdown.types";

const TYPE_OPTIONS = [
  { id: "Any", Icon: PropertyAnyIcon },
  { id: "Apartment", Icon: PropertyApartmentIcon },
  { id: "Townhome", Icon: PropertyTownhomeIcon },
  { id: "Condo", Icon: PropertyCondoIcon },
  { id: "Single family", Icon: PropertySingleIcon },
] as const;

function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

function isTypeSelected(id: string, draft: readonly string[]): boolean {
  if (id === "Any") {
    return draft.length === 0 || draft.includes("Any");
  }
  return draft.includes(id);
}

function nextDraft(draft: readonly string[], type: string): string[] {
  if (type === "Any") return ["Any"];
  const withoutAny = draft.filter((item) => item !== "Any");
  if (withoutAny.includes(type)) {
    return withoutAny.filter((item) => item !== type);
  }
  return [...withoutAny, type];
}

export function PropertyTypeGrid({
  selected,
  onSelect,
}: Readonly<{ selected: readonly string[]; onSelect: (type: string) => void }>) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {TYPE_OPTIONS.map(({ id, Icon }) => {
        const isSelected = isTypeSelected(id, selected);
        return (
          <button
            key={id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(id)}
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-3 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
              isSelected
                ? "border-neutral-900 bg-neutral-50 text-neutral-900"
                : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-400 hover:text-neutral-700"
            }`}
          >
            <Icon className="h-7 w-7" />
            {id}
          </button>
        );
      })}
    </div>
  );
}

export function PropertyTypeDropdown(
  props: Readonly<PropertyTypeDropdownProps>,
) {
  const { label = "Property type", selectedTypes, totalResults, onApply, onClear } = props;
  const { open, toggle, close, wrapperRef, triggerRef, panelRef, panelStyle } =
    usePopover();
  const [draft, setDraft] = useState<string[]>(selectedTypes);

  const openPanel = () => {
    setDraft(selectedTypes);
    toggle();
  };

  const activeTypes = draft.filter((type) => type !== "Any");
  const hasValue = activeTypes.length > 0;
  const typeCount = activeTypes.length;
  const typeWord = typeCount === 1 ? "type" : "types";
  const chipLabel = typeCount > 0 ? `${typeCount} ${typeWord}` : label;

  const handleSelect = (type: string) => {
    setDraft((current) => nextDraft(current, type));
  };

  const handleApply = () => {
    onApply(activeTypes);
    close();
  };

  const handleClear = () => {
    setDraft([]);
    onClear();
    close();
  };

  return (
    <div ref={wrapperRef} className="relative">
      <FilterChipButton
        label={chipLabel}
        isOpen={open}
        hasValue={hasValue}
        buttonRef={triggerRef}
        onClick={openPanel}
      />
      {open ? (
        <div
          ref={panelRef}
          style={panelStyle}
          role="dialog"
          aria-label="Property type filter"
          className="fixed left-1/2 top-36 z-40 w-[min(360px,90vw)] -translate-x-1/2 rounded-2xl border border-neutral-200 bg-white p-5 shadow-popover md:absolute md:left-0 md:top-full md:mt-2 md:w-[360px] md:translate-x-0"
        >
          <h2 className="text-base font-semibold text-neutral-900">Property type</h2>

          <div className="mt-4">
            <PropertyTypeGrid selected={draft} onSelect={handleSelect} />
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
            <button
              type="button"
              onClick={handleClear}
              className="cursor-pointer rounded-full px-3 py-2 text-sm font-semibold text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              Clear all
            </button>
            <Button type="button" variant="primary" size="md" onClick={handleApply}>
              View {formatCount(totalResults)} homes
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
