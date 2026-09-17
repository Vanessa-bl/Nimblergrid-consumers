export type PriceRangeFilter = {
  min: number | null;
  max: number | null;
  specials: boolean;
};

export type PriceRangeDropdownProps = {
  label?: string;
  minPrice: number | null;
  maxPrice: number | null;
  onlySpecials: boolean;
  totalResults: number;
  distribution?: number[];
  onApply: (filter: PriceRangeFilter) => void;
  onClear: () => void;
};
