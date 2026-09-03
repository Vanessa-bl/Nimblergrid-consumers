import {
  useCallback,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type ViewModeOption<T extends string | number = string> = {
  label: string;
  value: T;
  icon?: ReactNode;
};

export type ViewModeToggleProps<T extends string | number = string> = {
  options: readonly ViewModeOption<T>[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
};

const TRACK_PADDING = 4;

const sizeClasses: Record<NonNullable<ViewModeToggleProps["size"]>, string> = {
  sm: "h-8 px-2.5 text-[13px]",
  md: "h-10 px-3.5 text-sm",
  lg: "h-12 px-5 text-[15px]",
};

export function ViewModeToggle<T extends string | number>(
  props: Readonly<ViewModeToggleProps<T>>,
) {
  const {
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    size = "md",
    className,
    ariaLabel = "View options",
  } = props;
  const isControlled = controlledValue !== undefined;
  const [innerValue, setInnerValue] = useState<T | undefined>(
    defaultValue ?? options[0]?.value,
  );

  const activeValue = isControlled ? controlledValue : innerValue;
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === activeValue),
  );
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectOption = useCallback(
    (option: ViewModeOption<T>) => {
      if (!isControlled) setInnerValue(option.value);
      onChange?.(option.value);
    },
    [isControlled, onChange],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const count = options.length;
      if (count === 0) return;
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (activeIndex + direction + count) % count;
      const nextOption = options[nextIndex];
      if (nextOption !== undefined) {
        tabRefs.current[nextIndex]?.focus();
        selectOption(nextOption);
      }
    },
    [options, activeIndex, selectOption],
  );

  if (options.length === 0) return null;

  const pillWidth = `calc((100% - ${TRACK_PADDING * 2}px) / ${options.length})`;

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex w-full items-center rounded-full bg-stone-100 p-1 ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="absolute bottom-1 left-1 top-1 rounded-full border border-gray-200/60 bg-white shadow-md transition-transform duration-200 ease-in-out"
        style={{
          width: pillWidth,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((option, index) => {
        const selected = option.value === activeValue;
        return (
          <button
            key={String(option.value)}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            tabIndex={selected ? 0 : -1}
            aria-selected={selected}
            onClick={() => selectOption(option)}
            className={`relative z-10 flex flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 ${
              sizeClasses[size]
            } ${selected ? "font-semibold text-zinc-900" : "text-zinc-500 hover:text-zinc-800"}`}
          >
            {option.icon}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
