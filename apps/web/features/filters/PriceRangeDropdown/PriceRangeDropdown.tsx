import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { FilterChipButton } from "@/features/filters/FilterChipButton/FilterChipButton";
import { usePopover } from "@/features/filters/shared/use-popover";
import type { PriceRangeDropdownProps } from "./PriceRangeDropdown.types";
import sliderStyles from "./price-range-slider.module.css";

const SLIDER_MIN = 500;
const SLIDER_MAX = 3000;
const SLIDER_STEP = 250;
const MONEY_FORMATTER = new Intl.NumberFormat("en-US");

function formatMoney(value: number): string {
  return MONEY_FORMATTER.format(value);
}

function formatPriceOption(value: number): string {
  return `$${formatMoney(value)}`;
}

function getStepOptions(): number[] {
  const options: number[] = [];
  for (let value = SLIDER_MIN; value <= SLIDER_MAX; value += SLIDER_STEP) {
    options.push(value);
  }
  return options;
}

function toPercent(value: number): number {
  return ((value - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;
}

function normalizeRange(
  min: number | null,
  max: number | null,
): { min: number | null; max: number | null } {
  if (min !== null && max !== null && max < min) {
    return { min: max, max: min };
  }
  return { min, max };
}

function formatChipRange(min: number | null, max: number | null): string | null {
  if (min !== null && max !== null) {
    return `${formatPriceOption(min)}–${formatPriceOption(max)}`;
  }
  if (min !== null) return `${formatPriceOption(min)}+`;
  if (max !== null) return `Up to ${formatPriceOption(max)}`;
  return null;
}

type HistogramProps = {
  distribution: readonly number[];
  min: number | null;
  max: number | null;
};

function Histogram(props: Readonly<HistogramProps>) {
  const { distribution, min, max } = props;
  const peak = Math.max(...distribution);
  const bucketWidth = (SLIDER_MAX - SLIDER_MIN) / distribution.length;
  const rangeStart = min ?? SLIDER_MIN;
  const rangeEnd = max ?? SLIDER_MAX;

  return (
    <div className="mt-4 flex h-16 items-end gap-[3px]" aria-hidden="true">
      {distribution.map((value, index) => {
        const height = peak > 0 ? (value / peak) * 100 : 0;
        const bucketStart = SLIDER_MIN + index * bucketWidth;
        const bucketEnd = bucketStart + bucketWidth;
        const inRange = bucketEnd > rangeStart && bucketStart < rangeEnd;
        return (
          <div
            key={index}
            className={`flex-1 rounded-t-sm ${inRange ? "bg-brand-500/80" : "bg-neutral-200"}`}
            style={{ height: `${height}%` }}
          />
        );
      })}
    </div>
  );
}

type SliderTrackProps = {
  minValue: number | null;
  maxValue: number | null;
  onMinChange: (value: number | null) => void;
  onMaxChange: (value: number | null) => void;
};

function SliderTrack(props: Readonly<SliderTrackProps>) {
  const { minValue, maxValue, onMinChange, onMaxChange } = props;
  const left = minValue ?? SLIDER_MIN;
  const right = maxValue ?? SLIDER_MAX;
  const leftPercent = toPercent(left);
  const rightPercent = toPercent(right);

  return (
    <div className="relative mt-2 h-6">
      <div className="absolute left-1 right-1 top-1/2 h-1 -translate-y-1/2 rounded-full bg-neutral-200" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-500"
        style={{ left: `${leftPercent}%`, right: `${100 - rightPercent}%` }}
      />
      <input
        type="range"
        aria-label="Minimum price"
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        step={SLIDER_STEP}
        value={left}
        onChange={(event) => onMinChange(Number(event.target.value))}
        className={sliderStyles.rangeInput}
      />
      <input
        type="range"
        aria-label="Maximum price"
        min={SLIDER_MIN}
        max={SLIDER_MAX}
        step={SLIDER_STEP}
        value={right}
        onChange={(event) => onMaxChange(Number(event.target.value))}
        className={sliderStyles.rangeInput}
      />
    </div>
  );
}

type RangeSelectProps = {
  label: string;
  ariaLabel: string;
  value: number | null;
  options: readonly number[];
  onChange: (value: number | null) => void;
};

function RangeSelect(props: Readonly<RangeSelectProps>) {
  const { label, ariaLabel, value, options, onChange } = props;
  const selectValue = value === null ? "" : String(value);

  return (
    <label className="block">
      <span className="text-xs font-semibold text-neutral-500">{label}</span>
      <span className="relative mt-1 block">
        <select
          aria-label={ariaLabel}
          value={selectValue}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(nextValue === "" ? null : Number(nextValue));
          }}
          className="h-11 w-full cursor-pointer appearance-none rounded-xl border border-neutral-300 bg-white px-3 pr-8 text-sm text-neutral-900 outline-none transition-colors hover:border-neutral-400 focus:border-neutral-900"
        >
          <option value="">No {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {formatPriceOption(option)}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
      </span>
    </label>
  );
}

export function PriceRangeDropdown(props: Readonly<PriceRangeDropdownProps>) {
  const {
    label = "Price",
    minPrice,
    maxPrice,
    onlySpecials,
    totalResults,
    distribution = [],
    onApply,
    onClear,
  } = props;
  const { open, toggle, close, wrapperRef, triggerRef, panelRef, panelStyle } =
    usePopover();
  const [min, setMin] = useState<number | null>(minPrice);
  const [max, setMax] = useState<number | null>(maxPrice);
  const [specials, setSpecials] = useState(onlySpecials);

  const openPanel = () => {
    setMin(minPrice);
    setMax(maxPrice);
    setSpecials(onlySpecials);
    toggle();
  };

  const stepOptions = getStepOptions();
  const hasValue = min !== null || max !== null || specials;
  const chipLabel = formatChipRange(min, max) ?? label;

  const handleApply = () => {
    const normalized = normalizeRange(min, max);
    onApply({ ...normalized, specials });
    close();
  };

  const handleClear = () => {
    setMin(null);
    setMax(null);
    setSpecials(false);
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
          aria-label={`${label} filter`}
          className="fixed left-1/2 top-36 z-40 w-[min(360px,90vw)] -translate-x-1/2 rounded-2xl border border-neutral-200 bg-white p-5 shadow-popover md:absolute md:left-0 md:top-full md:mt-2 md:w-[360px] md:translate-x-0"
        >
          <h2 className="text-base font-semibold text-neutral-900">{label}</h2>

          {distribution.length > 0 ? (
            <Histogram distribution={distribution} min={min} max={max} />
          ) : null}

          <div className="mt-1 flex items-center justify-between text-sm font-medium text-neutral-900">
            <span>{min !== null ? formatPriceOption(min) : "No min"}</span>
            <span className="text-neutral-400">–</span>
            <span>{max !== null ? formatPriceOption(max) : "No max"}</span>
          </div>

          <SliderTrack
            minValue={min}
            maxValue={max}
            onMinChange={setMin}
            onMaxChange={setMax}
          />

          <div className="mt-5 grid grid-cols-2 gap-3">
            <RangeSelect
              label="Min"
              ariaLabel="Minimum price"
              value={min}
              options={stepOptions}
              onChange={setMin}
            />
            <RangeSelect
              label="Max"
              ariaLabel="Maximum price"
              value={max}
              options={stepOptions}
              onChange={setMax}
            />
          </div>

          <div className="mt-4">
            <Checkbox
              label="Only show listings with rent specials"
              checked={specials}
              onChange={(event) => setSpecials(event.target.checked)}
            />
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
              View {formatMoney(totalResults)} homes
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export {
  SLIDER_MIN,
  SLIDER_MAX,
  SLIDER_STEP,
  formatMoney,
  formatPriceOption,
  getStepOptions,
  Histogram,
  SliderTrack,
  RangeSelect,
};
