import { SearchIcon } from "@/components/ui/icons/search";
import type { PropertySearchBarProps } from "./PropertySearchBar.types";

const focusVisibleClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

export function PropertySearchBar(props: Readonly<PropertySearchBarProps>) {
  const {
    placeholder = 'Try "Southlake, TX"',
    value,
    onValueChange,
    onSearchSubmit,
  } = props;

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSearchSubmit?.(value);
      }}
      className="flex w-full items-center gap-2 rounded-full border border-neutral-200 bg-white py-1.5 pl-4 pr-1.5 shadow-sm transition-colors focus-within:border-neutral-900"
    >
      <input
        type="search"
        aria-label="Search properties"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className="h-9 w-full min-w-0 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
      />
      <button
        type="submit"
        aria-label="Search"
        className={`grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full bg-brand-500 text-white transition-colors hover:bg-brand-600 ${focusVisibleClasses}`}
      >
        <SearchIcon className="h-4 w-4" />
      </button>
    </form>
  );
}
