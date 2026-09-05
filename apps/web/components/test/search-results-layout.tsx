"use client";

import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/ui/icons/chevron-down";
import { MapView } from "@/components/MapView/MapView";
import { Pagination } from "@/components/Pagination/Pagination";
import { FiltersSidebar } from "@/components/filters/FiltersSidebar/FiltersSidebar";
import { FiltersSidebarButton } from "@/components/filters/FiltersSidebar/FiltersSidebar";
import type { FiltersSidebarState } from "@/components/filters/FiltersSidebar/FiltersSidebar.types";
import { MoveInByDropdown } from "@/components/filters/MoveInByDropdown/MoveInByDropdown";
import { PriceRangeDropdown } from "@/components/filters/PriceRangeDropdown/PriceRangeDropdown";
import { PropertySearchBar } from "@/components/filters/PropertySearchBar/PropertySearchBar";
import { PropertyTypeDropdown } from "@/components/filters/PropertyTypeDropdown/PropertyTypeDropdown";
import { RoomsFilterDropdown } from "@/components/filters/RoomsFilterDropdown/RoomsFilterDropdown";
import { ViewModeToggle } from "@/components/ui/view-mode-toggle";
import { PropertyCard } from "@/components/PropertyCard/PropertyCard";
import type { PriceRangeFilter } from "@/components/filters/PriceRangeDropdown/PriceRangeDropdown.types";
import type { RoomsSelection } from "@/components/filters/RoomsFilterDropdown/RoomsFilterDropdown.types";
import {
  getMockPropertyItems,
  toProperty,
  type MagentoPropertyItem,
} from "@/components/test/magento-properties";

const SLIDER_MIN = 500;
const SLIDER_MAX = 3000;
const SLIDER_STEP = 250;

const PAGE_SIZE = 8;

type SortOption = "relevance" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
] as const;

type AdvancedFilters = {
  priceReduced: boolean;
  builderPromotions: boolean;
  pets: boolean;
  parking: boolean;
  laundry: boolean;
  furnished: boolean;
  keyword: string;
};

const EMPTY_ADVANCED: AdvancedFilters = {
  priceReduced: false,
  builderPromotions: false,
  pets: false,
  parking: false,
  laundry: false,
  furnished: false,
  keyword: "",
};

function numericRank(value: string): number {
  return value === "5+" ? 5 : Number(value);
}

function matchesRooms(
  item: MagentoPropertyItem,
  selection: readonly string[],
): boolean {
  const numerals = selection.filter(
    (value) => value !== "Studio" && value !== "Any",
  );
  const max = numerals.reduce(
    (highest, value) => Math.max(highest, numericRank(value)),
    0,
  );
  const wantsStudio = selection.includes("Studio");
  if (max > 0 && item.bedrooms > 0 && item.bedrooms <= max) return true;
  if (wantsStudio && item.bedrooms === 0) return true;
  return false;
}

function matchesFilters(
  item: MagentoPropertyItem,
  query: string,
  price: PriceRangeFilter,
  rooms: RoomsSelection,
  types: readonly string[],
  moveInDate: string | null,
  advanced: AdvancedFilters,
): boolean {
  const haystack = [
    item.name,
    item.address,
    item.neighborhood,
    item.city,
    item.property_type,
  ]
    .join(" ")
    .toLowerCase();
  const needle = query.trim().toLowerCase();
  if (needle !== "" && !haystack.includes(needle)) return false;

  if (price.min !== null && item.price < price.min) return false;
  if (price.max !== null && item.price > price.max) return false;
  if (price.specials && item.rent_special !== true) return false;

  if (rooms.bedrooms.length > 0 && !matchesRooms(item, rooms.bedrooms)) {
    return false;
  }
  if (rooms.bathrooms.length > 0) {
    const maxBathrooms = rooms.bathrooms.reduce(
      (highest, value) => Math.max(highest, numericRank(value)),
      0,
    );
    if (maxBathrooms === 0 || item.bathrooms > maxBathrooms) return false;
  }

  const activeTypes = types.filter((type) => type !== "Any");
  if (activeTypes.length > 0 && !activeTypes.includes(item.property_type)) {
    return false;
  }

  if (advanced.keyword.trim() !== "") {
    const keyword = advanced.keyword.trim().toLowerCase();
    if (!haystack.includes(keyword)) return false;
  }
  if (advanced.priceReduced && item.price_reduced !== true) return false;
  if (advanced.builderPromotions && item.builder_promotion !== true) return false;
  if (advanced.pets && item.pets_allowed !== true) return false;
  if (advanced.parking && item.parking_included !== true) return false;
  if (advanced.laundry && item.in_unit_laundry !== true) return false;
  if (advanced.furnished && item.furnished !== true) return false;

  if (moveInDate !== null) {
    if (item.available_from !== null && item.available_from !== undefined) {
      if (item.available_from > moveInDate) return false;
    }
  }
  return true;
}

function buildPriceDistribution(items: readonly MagentoPropertyItem[]): number[] {
  const buckets = new Array((SLIDER_MAX - SLIDER_MIN) / SLIDER_STEP).fill(0);
  for (const item of items) {
    if (item.price < SLIDER_MIN || item.price > SLIDER_MAX) continue;
    const index = Math.min(
      buckets.length - 1,
      Math.floor((item.price - SLIDER_MIN) / SLIDER_STEP),
    );
    buckets[index] += 1;
  }
  return buckets;
}

function sortItems(
  items: readonly MagentoPropertyItem[],
  sort: SortOption,
): MagentoPropertyItem[] {
  const next = [...items];
  if (sort === "price-asc") {
    next.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    next.sort((a, b) => b.price - a.price);
  } else if (sort === "newest") {
    next.sort((a, b) => b.listed_at.localeCompare(a.listed_at));
  }
  return next;
}

export function SearchResultsLayout() {
  const allItems = useMemo(() => getMockPropertyItems(), []);
  const distribution = useMemo(() => buildPriceDistribution(allItems), [allItems]);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [price, setPrice] = useState<PriceRangeFilter>({
    min: null,
    max: null,
    specials: false,
  });
  const [rooms, setRooms] = useState<RoomsSelection>({
    bedrooms: [],
    bathrooms: [],
  });
  const [types, setTypes] = useState<string[]>([]);
  const [moveInDate, setMoveInDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [sort, setSort] = useState<SortOption>("relevance");
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [advanced, setAdvanced] = useState<AdvancedFilters>(EMPTY_ADVANCED);
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const selectedCount = selectedIds.size;

  const visibleItems = useMemo(() => {
    const matched = allItems.filter((item) =>
      matchesFilters(item, query, price, rooms, types, moveInDate, advanced),
    );
    return sortItems(matched, sort);
  }, [allItems, query, price, rooms, types, moveInDate, advanced, sort]);

  const visibleCount = visibleItems.length;

  const propertiesById = useMemo(() => {
    return new Map(allItems.map((item) => [item.id, toProperty(item)]));
  }, [allItems]);

  const favoriteCards = useMemo(() => {
    return visibleItems.map((item) => {
      const base = propertiesById.get(item.id) ?? toProperty(item);
      const favorite = favoriteIds.has(item.id);
      if (base.actions.isFavorite === favorite) return base;
      return { ...base, actions: { isFavorite: favorite } };
    });
  }, [visibleItems, propertiesById, favoriteIds]);

  const pageCount = Math.max(1, Math.ceil(favoriteCards.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginatedCards = favoriteCards.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleFavoriteToggle = useCallback((propertyId: string) => {
    setFavoriteIds((previous) => {
      const next = new Set(previous);
      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      return next;
    });
  }, []);

  const handleSelectionChange = useCallback(
    (propertyId: string, selected: boolean) => {
      setSelectedIds((previous) => {
        const next = new Set(previous);
        if (selected) {
          next.add(propertyId);
        } else {
          next.delete(propertyId);
        }
        return next;
      });
    },
    [],
  );

  const showMap = viewMode === "map";

  const hasSidebarValue = [
    price.min !== null,
    price.max !== null,
    price.specials,
    rooms.bedrooms.length > 0,
    rooms.bathrooms.length > 0,
    types.length > 0,
    advanced.priceReduced,
    advanced.builderPromotions,
    advanced.pets,
    advanced.parking,
    advanced.laundry,
    advanced.furnished,
    advanced.keyword.trim() !== "",
  ].some(Boolean);

  const handleSidebarApply = (filters: FiltersSidebarState) => {
    setPrice({
      min: filters.priceMin,
      max: filters.priceMax,
      specials: filters.rentSpecials,
    });
    setRooms({ bedrooms: filters.bedrooms, bathrooms: filters.bathrooms });
    setTypes(filters.homeTypes);
    setAdvanced({
      priceReduced: filters.priceReduced,
      builderPromotions: filters.builderPromotions,
      pets: filters.pets,
      parking: filters.parking,
      laundry: filters.laundry,
      furnished: filters.furnished,
      keyword: filters.keyword,
    });
    setPage(1);
  };

  const handleSidebarClearAll = () => {
    setPrice({ min: null, max: null, specials: false });
    setRooms({ bedrooms: [], bathrooms: [] });
    setTypes([]);
    setAdvanced(EMPTY_ADVANCED);
    setMoveInDate(null);
    setPage(1);
  };

  return (
    <div>
      <div className="sticky top-0 z-30 border-b border-zinc-200 bg-white px-4 py-3 shadow-[0_4px_16px_-12px_rgba(24,24,27,0.2)] sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="min-w-0 flex-1">
            <PropertySearchBar
              value={query}
              onValueChange={(value) => {
                setQuery(value);
                setPage(1);
              }}
              onSearchSubmit={() => undefined}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <FiltersSidebarButton
              isOpen={sidebarOpen}
              hasValue={hasSidebarValue}
              onClick={() => setSidebarOpen((current) => !current)}
            />
            <PriceRangeDropdown
              label="Price"
              minPrice={price.min}
              maxPrice={price.max}
              onlySpecials={price.specials}
              totalResults={visibleCount}
              distribution={distribution}
              onApply={(value) => {
                setPrice(value);
                setPage(1);
              }}
              onClear={() => {
                setPrice({ min: null, max: null, specials: false });
                setPage(1);
              }}
            />
            <RoomsFilterDropdown
              label="Rooms"
              selectedBedrooms={rooms.bedrooms}
              selectedBathrooms={rooms.bathrooms}
              onChange={(value) => {
                setRooms(value);
                setPage(1);
              }}
              onDone={() => undefined}
            />
            <PropertyTypeDropdown
              label="Property type"
              selectedTypes={types}
              totalResults={visibleCount}
              onApply={(value) => {
                setTypes(value);
                setPage(1);
              }}
              onClear={() => {
                setTypes([]);
                setPage(1);
              }}
            />
            <MoveInByDropdown
              label="Move-in by"
              selectedDate={moveInDate}
              onDateChange={(value) => {
                setMoveInDate(value);
                setPage(1);
              }}
              onDone={() => undefined}
            />
          </div>
        </div>
      </div>

      <div className={showMap ? "lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]" : ""}>
        <div className={showMap ? "hidden lg:block" : ""}>
          <div className="px-4 pb-14 pt-4 sm:px-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
                  Southlake, TX Rentals
                </h1>
                <p className="mt-1 text-sm text-zinc-500">
                  {visibleCount} {visibleCount === 1 ? "home" : "homes"}
                  {visibleCount !== allItems.length
                    ? ` of ${allItems.length}`
                    : ""}
                </p>
                {selectedCount > 0 ? (
                  <div className="mt-2 flex items-center gap-3 text-sm">
                    <span className="font-semibold text-[#ff2056]">
                      {selectedCount} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedIds(new Set())}
                      className="cursor-pointer font-medium text-zinc-500 underline-offset-2 hover:text-zinc-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                    >
                      Clear selection
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="relative block">
                  <span className="sr-only">Sort by</span>
                  <select
                    aria-label="Sort by"
                    value={sort}
                    onChange={(event) => {
                      setSort(event.target.value as SortOption);
                      setPage(1);
                    }}
                    className="h-10 cursor-pointer appearance-none rounded-full border border-zinc-200 bg-white pl-4 pr-9 text-sm font-medium text-zinc-800 outline-none transition-colors hover:border-zinc-400 focus:border-zinc-900"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                </label>
                <div className="w-[170px] shrink-0">
                  <ViewModeToggle
                    ariaLabel="Results view mode"
                    options={[
                      { label: "List", value: "list" },
                      { label: "Map", value: "map" },
                    ]}
                    value={viewMode}
                    onChange={setViewMode}
                  />
                </div>
              </div>
            </div>

            {visibleCount > 0 ? (
              <>
                <div
                  className={
                    showMap
                      ? "grid grid-cols-1 gap-5"
                      : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  }
                >
                  {paginatedCards.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      stacked={!showMap}
                      selected={selectedIds.has(property.id)}
                      onFavoriteToggle={handleFavoriteToggle}
                      onSelectionChange={handleSelectionChange}
                    />
                  ))}
                </div>
                {pageCount > 1 ? (
                  <div className="mt-10 flex justify-center">
                    <Pagination
                      page={currentPage}
                      pageCount={pageCount}
                      onPageChange={setPage}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500">
                No homes match the current filters.
              </p>
            )}
          </div>
        </div>

        <div className={showMap ? "block" : "hidden"}>
          <div className="px-4 pt-4 lg:sticky lg:top-[8.5rem] lg:h-[calc(100dvh-10rem)] lg:px-0 lg:pb-0 lg:pt-0">
            <div className="h-[70dvh] min-h-[420px] overflow-hidden rounded-2xl border border-zinc-200 lg:h-full lg:rounded-none lg:border-0">
              <MapView
                markers={visibleItems.map((item) => ({
                  id: item.id,
                  lat: item.coordinates.lat,
                  lng: item.coordinates.lng,
                }))}
              />
            </div>
          </div>
        </div>
      </div>

      <FiltersSidebar
        isOpen={sidebarOpen}
        totalResults={visibleCount}
        onApplyFilters={handleSidebarApply}
        onClearAll={handleSidebarClearAll}
        onClose={() => setSidebarOpen(false)}
      />

      {selectedCount > 0 ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
          <div className="pointer-events-auto flex items-center gap-5 rounded-2xl border border-zinc-200 bg-white py-3 pl-5 pr-3 shadow-[0_16px_40px_-16px_rgba(24,24,27,0.35)]">
            <div>
              <p className="text-sm font-semibold text-zinc-900">
                Consultar por varias
              </p>
              <p className="text-xs text-zinc-500">
                {selectedCount}{" "}
                {selectedCount === 1
                  ? "propiedad seleccionada"
                  : "propiedades seleccionadas"}
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => undefined}
            >
              Consultar
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
