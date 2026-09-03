import { FilterChipButton } from "@/components/filters/FilterChipButton/FilterChipButton";
import { usePopover } from "@/components/filters/shared/use-popover";
import type {
  RoomsFilterDropdownProps,
  SegmentedGroupProps,
} from "./RoomsFilterDropdown.types";

const BEDROOM_OPTIONS = ["Any", "Studio", "1", "2", "3", "4", "5+"] as const;
const BATHROOM_OPTIONS = ["Any", "1", "2", "3", "4", "5+"] as const;
const NUMERIC_OPTIONS = ["1", "2", "3", "4", "5+"] as const;

function numericRank(value: string): number {
  return value === "5+" ? 5 : Number(value);
}

function numericOptionsUpTo(limit: string): string[] {
  return NUMERIC_OPTIONS.filter(
    (option) => numericRank(option) <= numericRank(limit),
  );
}

function toggleStudio(current: readonly string[]): string[] {
  if (current.includes("Studio")) {
    return current.filter((value) => value !== "Studio");
  }
  return ["Studio", ...current];
}

function summarizeBedrooms(selected: readonly string[]): string {
  const studio = selected.includes("Studio");
  const numerals = selected.filter((value) => value !== "Studio");
  const max = numerals.at(-1);
  if (studio && max !== undefined) return `Studio + ${max} bds`;
  if (studio) return "Studio";
  if (max !== undefined) return max === "1" ? "1 bd" : `${max} bds`;
  return "";
}

function summarizeBathrooms(selected: readonly string[]): string {
  const max = selected.at(-1);
  if (max === undefined) return "";
  return `${max} ba`;
}

function SegmentedGroup(props: Readonly<SegmentedGroupProps>) {
  const { groupLabel, options, selected, onSelect } = props;
  return (
    <div role="group" aria-label={groupLabel} className="flex overflow-hidden rounded-lg border border-zinc-200 bg-white">
      {options.map((option, index) => {
        const isSelected =
          option === "Any" ? selected.length === 0 : selected.includes(option);
        const isLast = index === options.length - 1;
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(option)}
            className={`flex-1 cursor-pointer whitespace-nowrap border-r border-zinc-200 px-1 py-2 text-center text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-rose-500 ${
              isLast ? "border-r-0" : ""
            } ${isSelected ? "bg-zinc-900 text-white" : "bg-white text-zinc-700 hover:bg-zinc-100"}`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function RoomsFilterDropdown(props: Readonly<RoomsFilterDropdownProps>) {
  const {
    label = "Rooms",
    selectedBedrooms,
    selectedBathrooms,
    onChange,
    onDone,
  } = props;
  const { open, toggle, close, wrapperRef, triggerRef, panelRef, panelStyle } =
    usePopover();

  const bedroomSummary = summarizeBedrooms(selectedBedrooms);
  const bathroomSummary = summarizeBathrooms(selectedBathrooms);
  const summaryParts = [bedroomSummary, bathroomSummary].filter(Boolean);
  const hasValue = summaryParts.length > 0;
  const chipLabel = hasValue ? summaryParts.join(" · ") : label;

  const handleBedroomSelect = (option: string) => {
    if (option === "Any") {
      onChange({ bedrooms: [], bathrooms: selectedBathrooms });
      return;
    }
    if (option === "Studio") {
      onChange({
        bedrooms: toggleStudio(selectedBedrooms),
        bathrooms: selectedBathrooms,
      });
      return;
    }
    const studio = selectedBedrooms.includes("Studio");
    const nextBedrooms = [
      ...(studio ? ["Studio"] : []),
      ...numericOptionsUpTo(option),
    ];
    onChange({ bedrooms: nextBedrooms, bathrooms: selectedBathrooms });
  };

  const handleBathroomSelect = (option: string) => {
    if (option === "Any") {
      onChange({ bedrooms: selectedBedrooms, bathrooms: [] });
      return;
    }
    onChange({
      bedrooms: selectedBedrooms,
      bathrooms: numericOptionsUpTo(option),
    });
  };

  const handleDone = () => {
    close();
    onDone();
  };

  return (
    <div ref={wrapperRef} className="relative">
      <FilterChipButton
        label={chipLabel}
        isOpen={open}
        hasValue={hasValue}
        buttonRef={triggerRef}
        onClick={toggle}
      />
      {open ? (
        <div
          ref={panelRef}
          style={panelStyle}
          role="dialog"
          aria-label="Rooms filter"
          className="fixed left-1/2 top-36 z-40 w-[min(340px,90vw)] -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white p-5 shadow-[0_20px_50px_-20px_rgba(24,24,27,0.3)] md:absolute md:left-0 md:top-full md:mt-2 md:w-[340px] md:translate-x-0"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-zinc-900">Rooms</h2>
            <button
              type="button"
              onClick={handleDone}
              className="cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              Done
            </button>
          </div>

          <div className="mt-4 space-y-5">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-900">
                Bedrooms
              </h3>
              <SegmentedGroup
                groupLabel="Bedrooms"
                options={BEDROOM_OPTIONS}
                selected={selectedBedrooms}
                onSelect={handleBedroomSelect}
              />
            </div>
            <div>
              <h3 className="mb-2 text-sm font-semibold text-zinc-900">
                Bathrooms
              </h3>
              <SegmentedGroup
                groupLabel="Bathrooms"
                options={BATHROOM_OPTIONS}
                selected={selectedBathrooms}
                onSelect={handleBathroomSelect}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { BEDROOM_OPTIONS, BATHROOM_OPTIONS, SegmentedGroup, numericOptionsUpTo };
