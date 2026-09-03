export type FiltersSidebarState = {
  priceMin: number | null;
  priceMax: number | null;
  rentSpecials: boolean;
  priceReduced: boolean;
  builderPromotions: boolean;
  bedrooms: string[];
  bathrooms: string[];
  homeTypes: string[];
  pets: boolean;
  parking: boolean;
  laundry: boolean;
  furnished: boolean;
  keyword: string;
};

export const EMPTY_FILTERS_STATE: FiltersSidebarState = {
  priceMin: null,
  priceMax: null,
  rentSpecials: false,
  priceReduced: false,
  builderPromotions: false,
  bedrooms: [],
  bathrooms: [],
  homeTypes: [],
  pets: false,
  parking: false,
  laundry: false,
  furnished: false,
  keyword: "",
};

export type FiltersSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  totalResults: number;
  onApplyFilters: (filters: FiltersSidebarState) => void;
  onClearAll: () => void;
};

export type FiltersSidebarButtonProps = {
  label?: string;
  isOpen?: boolean;
  hasValue?: boolean;
  onClick?: () => void;
};
