"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { CloseIcon } from "@/components/ui/icons/close";
import { FilterIcon } from "@/components/ui/icons/filter";
import {
  Histogram,
  RangeSelect,
  SliderTrack,
  formatPriceOption,
  getStepOptions,
} from "@/features/filters/PriceRangeDropdown/PriceRangeDropdown";
import {
  BATHROOM_OPTIONS,
  BEDROOM_OPTIONS,
  SegmentedGroup,
  numericOptionsUpTo,
} from "@/features/filters/RoomsFilterDropdown/RoomsFilterDropdown";
import { PropertyTypeGrid } from "@/features/filters/PropertyTypeDropdown/PropertyTypeDropdown";
import {
  EMPTY_FILTERS_STATE,
  type FiltersSidebarButtonProps,
  type FiltersSidebarProps,
  type FiltersSidebarState,
} from "./FiltersSidebar.types";

const DEFAULT_TONE =
  "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-900 hover:text-neutral-900";
const OPEN_TONE = "border-neutral-900 bg-neutral-50 text-neutral-900";
const VALUE_TONE =
  "border-brand-300 bg-white text-brand-600 hover:border-brand-500";
const ACTIVE_TONE = "border-brand-500 bg-brand-50 text-brand-600";

function resolveSidebarTone(hasValue: boolean, isOpen: boolean): string {
  if (hasValue) return isOpen ? ACTIVE_TONE : VALUE_TONE;
  return isOpen ? OPEN_TONE : DEFAULT_TONE;
}

function formatSidebarRange(
  min: number | null,
  max: number | null,
): string | null {
  if (min !== null && max !== null) {
    return `${formatPriceOption(min)}–${formatPriceOption(max)}`;
  }
  if (min !== null) return `${formatPriceOption(min)}+`;
  if (max !== null) return `Up to ${formatPriceOption(max)}`;
  return null;
}

export function FiltersSidebarButton({
  label = "Filters",
  isOpen = false,
  hasValue = false,
  onClick,
}: Readonly<FiltersSidebarButtonProps>) {
  const toneClass = resolveSidebarTone(hasValue, isOpen);

  return (
    <button
      type="button"
      aria-expanded={isOpen}
      onClick={onClick}
      className={`inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${toneClass}`}
    >
      <FilterIcon className="h-4 w-4 shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
      {hasValue ? <CloseIcon className="h-3.5 w-3.5 shrink-0" /> : null}
    </button>
  );
}

type CheckboxRowProps = {
  label: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
};

function CheckboxRow({ label, checked, onToggle }: Readonly<CheckboxRowProps>) {
  return (
    <Checkbox
      label={label}
      checked={checked}
      onChange={(event) => onToggle(event.target.checked)}
    />
  );
}

type AccordionProps = {
  title: string;
  defaultOpen: boolean;
  children: ReactNode;
};

function Accordion({ title, defaultOpen, children }: Readonly<AccordionProps>) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <section>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full cursor-pointer items-center justify-between py-4 text-left text-[15px] font-semibold text-neutral-900 transition-colors hover:text-brand-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {title}
          <ChevronDownIcon
            className={`h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>
      <div
        id={contentId}
        className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </section>
  );
}

function toggleType(current: readonly string[], type: string): string[] {
  if (type === "Any") return [];
  const withoutAny = current.filter((item) => item !== "Any");
  if (withoutAny.includes(type)) {
    return withoutAny.filter((item) => item !== type);
  }
  return [...withoutAny, type];
}

type DraftProps = {
  filters: FiltersSidebarState;
  patch: (partial: Partial<FiltersSidebarState>) => void;
};

function SidebarSections({ filters, patch }: Readonly<DraftProps>) {
  const stepOptions = getStepOptions();
  const range = formatSidebarRange(filters.priceMin, filters.priceMax);

  return (
    <>
      <Accordion title={range !== null ? `Price: ${range}` : "Price"} defaultOpen={true}>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm font-medium text-neutral-900">
            <span>
              {filters.priceMin !== null
                ? formatPriceOption(filters.priceMin)
                : "No min"}
            </span>
            <span className="text-neutral-400">–</span>
            <span>
              {filters.priceMax !== null
                ? formatPriceOption(filters.priceMax)
                : "No max"}
            </span>
          </div>
          <Histogram
            distribution={[4, 9, 14, 22, 30, 26, 18, 12, 7, 5, 3]}
            min={filters.priceMin}
            max={filters.priceMax}
          />
          <SliderTrack
            minValue={filters.priceMin}
            maxValue={filters.priceMax}
            onMinChange={(priceMin) => patch({ priceMin })}
            onMaxChange={(priceMax) => patch({ priceMax })}
          />
          <div className="grid grid-cols-2 gap-3">
            <RangeSelect
              label="Min"
              ariaLabel="Sidebar minimum price"
              value={filters.priceMin}
              options={stepOptions}
              onChange={(priceMin) => patch({ priceMin })}
            />
            <RangeSelect
              label="Max"
              ariaLabel="Sidebar maximum price"
              value={filters.priceMax}
              options={stepOptions}
              onChange={(priceMax) => patch({ priceMax })}
            />
          </div>
        </div>
      </Accordion>

      <Accordion title="Rooms" defaultOpen={true}>
        <div className="space-y-5">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-neutral-900">Bedrooms</h4>
            <SegmentedGroup
              groupLabel="Bedrooms"
              options={BEDROOM_OPTIONS}
              selected={filters.bedrooms}
              onSelect={(option) => {
                if (option === "Any") {
                  patch({ bedrooms: [] });
                  return;
                }
                if (option === "Studio") {
                  const studio = filters.bedrooms.includes("Studio");
                  patch({
                    bedrooms: studio
                      ? filters.bedrooms.filter((value) => value !== "Studio")
                      : ["Studio", ...filters.bedrooms],
                  });
                  return;
                }
                const studio = filters.bedrooms.includes("Studio");
                patch({
                  bedrooms: [
                    ...(studio ? ["Studio"] : []),
                    ...numericOptionsUpTo(option),
                  ],
                });
              }}
            />
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-neutral-900">Bathrooms</h4>
            <SegmentedGroup
              groupLabel="Bathrooms"
              options={BATHROOM_OPTIONS}
              selected={filters.bathrooms}
              onSelect={(option) => {
                if (option === "Any") {
                  patch({ bathrooms: [] });
                  return;
                }
                patch({ bathrooms: numericOptionsUpTo(option) });
              }}
            />
          </div>
        </div>
      </Accordion>

      <Accordion title="Home type" defaultOpen={true}>
        <PropertyTypeGrid
          selected={filters.homeTypes}
          onSelect={(type) => patch({ homeTypes: toggleType(filters.homeTypes, type) })}
        />
      </Accordion>

      <Accordion title="Listing details" defaultOpen={false}>
        <div className="space-y-2">
          <CheckboxRow
            label="Rent specials"
            checked={filters.rentSpecials}
            onToggle={(rentSpecials) => patch({ rentSpecials })}
          />
          <CheckboxRow
            label="Price reduced"
            checked={filters.priceReduced}
            onToggle={(priceReduced) => patch({ priceReduced })}
          />
          <CheckboxRow
            label="Builder promotions"
            checked={filters.builderPromotions}
            onToggle={(builderPromotions) => patch({ builderPromotions })}
          />
        </div>
      </Accordion>

      <Accordion title="Home details" defaultOpen={false}>
        <div className="space-y-2">
          <CheckboxRow
            label="Pet friendly"
            checked={filters.pets}
            onToggle={(pets) => patch({ pets })}
          />
          <CheckboxRow
            label="Parking included"
            checked={filters.parking}
            onToggle={(parking) => patch({ parking })}
          />
          <CheckboxRow
            label="In-unit laundry"
            checked={filters.laundry}
            onToggle={(laundry) => patch({ laundry })}
          />
        </div>
      </Accordion>

      <Accordion title="Home features" defaultOpen={false}>
        <div className="space-y-2">
          <CheckboxRow
            label="Furnished"
            checked={filters.furnished}
            onToggle={(furnished) => patch({ furnished })}
          />
          <p className="pt-1 text-xs text-neutral-400">
            More feature flags will land here as listing data grows.
          </p>
        </div>
      </Accordion>

      <Accordion title="Expanded search" defaultOpen={false}>
        <label className="block">
          <span className="sr-only">Keyword</span>
          <input
            type="search"
            aria-label="Keyword"
            placeholder="Search by keyword"
            value={filters.keyword}
            onChange={(event) => patch({ keyword: event.target.value })}
            className="h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors hover:border-neutral-400 focus:border-neutral-900"
          />
        </label>
      </Accordion>
    </>
  );
}

export function FiltersSidebar(props: Readonly<FiltersSidebarProps>) {
  const { isOpen, onClose, totalResults, onApplyFilters, onClearAll } = props;
  const [filters, setFilters] = useState<FiltersSidebarState>(EMPTY_FILTERS_STATE);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const patch = (partial: Partial<FiltersSidebarState>) => {
    setFilters((current) => ({ ...current, ...partial }));
  };

  const handleClearAll = () => {
    setFilters(EMPTY_FILTERS_STATE);
    onClearAll();
    onClose();
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={`relative z-10 flex h-full w-full max-w-md transform flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex shrink-0 items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 divide-y divide-neutral-200 overflow-y-auto px-6">
          <SidebarSections filters={filters} patch={patch} />
        </div>

        <footer className="flex shrink-0 items-center justify-between border-t border-neutral-200 bg-white p-4 px-6">
          <Button
            type="button"
            variant="outline-dark"
            size="md"
            onClick={handleClearAll}
          >
            Clear all
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleApply}
          >
            View {totalResults} homes
          </Button>
        </footer>
      </div>
    </div>
  );
}
