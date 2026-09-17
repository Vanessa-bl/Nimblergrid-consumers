"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";

export type SearchMode = {
  key: string;
  label: string;
  action: string;
};

type SearchBarProps = {
  modes: readonly SearchMode[];
  defaultMode?: string;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
};

export const SearchBar = ({
  modes,
  defaultMode,
  placeholder,
  ariaLabel,
  className = "",
}: SearchBarProps) => {
  const [activeKey, setActiveKey] = useState(defaultMode ?? modes[0]?.key);
  const active = modes.find((m) => m.key === activeKey) ?? modes[0];

  if (!active) return null;

  return (
    <div className={className}>
      <div role="tablist" aria-label="Search type" className="mb-3 flex gap-2">
        {modes.map((mode) => {
          const selected = mode.key === activeKey;
          return (
            <button
              key={mode.key}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="search-input-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveKey(mode.key)}
              className={
                selected
                  ? "rounded-full bg-neutral-900 px-5 py-2 text-sm font-semibold text-white transition-colors"
                  : "rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-700 ring-1 ring-neutral-200 transition-colors hover:bg-neutral-100"
              }
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      <div id="search-input-panel" role="tabpanel">
        <SearchInput
          action={active.action}
          placeholder={placeholder}
          ariaLabel={ariaLabel}
        />
      </div>
    </div>
  );
};
