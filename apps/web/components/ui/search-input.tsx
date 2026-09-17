import { SearchIcon } from "@/components/ui/icons/search";

type SearchInputProps = {
  action?: string;
  name?: string;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
};

export const SearchInput = ({
  action = "/search",
  name = "q",
  placeholder = "Lorem ipsum dolor sit",
  ariaLabel = "Search",
  className = "",
}: SearchInputProps) => (
  <form
    role="search"
    action={action}
    method="get"
    className={`relative flex w-full items-stretch rounded-full bg-white shadow-input ring-1 ring-neutral-200 transition-shadow focus-within:ring-2 focus-within:ring-neutral-400 ${className}`.trim()}
  >
    <input
      type="search"
      name={name}
      role="combobox"
      aria-label={ariaLabel}
      aria-autocomplete="list"
      aria-haspopup="listbox"
      aria-expanded="false"
      autoComplete="off"
      enterKeyHint="search"
      placeholder={placeholder}
      className="min-w-0 flex-1 rounded-full bg-transparent px-6 py-4 text-[15.5px] text-neutral-900 outline-none placeholder:text-neutral-500"
    />
    <button
      type="submit"
      className="my-1.5 mr-1.5 inline-flex h-12 flex-none items-center gap-2 rounded-full bg-neutral-900 px-5 text-[15.5px] font-semibold tracking-[0.02em] text-white transition-all hover:brightness-110"
    >
      Lorem
      <SearchIcon width={18} height={18} />
    </button>
  </form>
);
