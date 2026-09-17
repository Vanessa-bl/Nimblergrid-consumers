import { DatePicker } from "@/components/ui/date-picker";
import { FilterChipButton } from "@/features/filters/FilterChipButton/FilterChipButton";
import { usePopover } from "@/features/filters/shared/use-popover";
import type { MoveInByDropdownProps } from "./MoveInByDropdown.types";

const shortDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "2-digit",
});

function formatShortDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return shortDateFormatter.format(date);
}

export function MoveInByDropdown(props: Readonly<MoveInByDropdownProps>) {
  const { label = "Move-in by", selectedDate, onDateChange, onDone } = props;
  const { open, toggle, close, wrapperRef, triggerRef, panelRef, panelStyle } =
    usePopover();
  const hasValue = selectedDate !== null;
  const chipLabel = hasValue
    ? `Move-in by ${formatShortDate(selectedDate)}`
    : label;

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
          aria-label="Move-in by filter"
          className="fixed left-1/2 top-36 z-40 w-[min(340px,90vw)] -translate-x-1/2 rounded-2xl border border-neutral-200 bg-white p-5 shadow-popover md:absolute md:left-0 md:top-full md:mt-2 md:w-[340px] md:translate-x-0"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">Move-in by</h2>
            <button
              type="button"
              onClick={handleDone}
              className="cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              Done
            </button>
          </div>

          <p className="mt-2 text-sm text-neutral-500">
            Show listings available by this date.
          </p>

          <div className="mt-4">
            <DatePicker
              aria-label="Move-in date"
              value={selectedDate}
              onChange={onDateChange}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
