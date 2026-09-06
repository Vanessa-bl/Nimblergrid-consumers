"use client";

import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/PropertyCard/PropertyCard";
import { Pagination } from "@/components/Pagination/Pagination";
import { PropertySearchBar } from "@/components/filters/PropertySearchBar/PropertySearchBar";
import { PriceRangeDropdown } from "@/components/filters/PriceRangeDropdown/PriceRangeDropdown";
import { RoomsFilterDropdown } from "@/components/filters/RoomsFilterDropdown/RoomsFilterDropdown";
import { PropertyTypeDropdown } from "@/components/filters/PropertyTypeDropdown/PropertyTypeDropdown";
import { FilterChipButton } from "@/components/filters/FilterChipButton/FilterChipButton";
import type { PriceRangeFilter } from "@/components/filters/PriceRangeDropdown/PriceRangeDropdown.types";
import type { RoomsSelection } from "@/components/filters/RoomsFilterDropdown/RoomsFilterDropdown.types";
import { DEMO_PROPERTIES } from "@/components/test/property-card-fixtures";
import type { Property, PropertyContactStatus } from "@/components/PropertyCard/PropertyCard.types";

const SLIDER_MIN = 500;
const SLIDER_MAX = 3000;
const SLIDER_STEP = 250;

const PAGE_SIZE = 4;

const DEMO_CONTACT_STATUSES: readonly PropertyContactStatus[] = [
  "contactado",
  "leido",
  "en-proceso",
  "completado",
];

const STATUS_FILTER_OPTIONS: readonly { value: PropertyContactStatus; label: string }[] = [
  { value: "contactado", label: "Contactado" },
  { value: "leido", label: "Leído" },
  { value: "en-proceso", label: "En proceso" },
  { value: "completado", label: "Completado" },
];

const PROPERTY_TYPE_KEYS: Record<string, string> = {
  Departamento: "Apartment",
  Casa: "Single family",
  PH: "Condo",
  Loft: "Apartment",
};

function numericRank(value: string): number {
  return value === "5+" ? 5 : Number(value);
}

function propertyTypeKey(propertyType: string): string {
  return PROPERTY_TYPE_KEYS[propertyType] ?? propertyType;
}

function matchesBedrooms(property: Property, selected: readonly string[]): boolean {
  if (selected.length === 0) return true;
  const numerals = selected.filter(
    (value) => value !== "Studio" && value !== "Any",
  );
  const max = numerals.reduce(
    (highest, value) => Math.max(highest, numericRank(value)),
    0,
  );
  const wantsStudio = selected.includes("Studio");
  if (max > 0 && property.features.bedrooms > 0 && property.features.bedrooms <= max) {
    return true;
  }
  return wantsStudio && property.features.bedrooms === 0;
}

function matchesBathrooms(property: Property, selected: readonly string[]): boolean {
  if (selected.length === 0) return true;
  const max = selected.reduce(
    (highest, value) => Math.max(highest, numericRank(value)),
    0,
  );
  return max > 0 && property.features.bathrooms <= max;
}

function matchesFilters(
  property: Property,
  query: string,
  price: PriceRangeFilter,
  rooms: RoomsSelection,
  types: readonly string[],
): boolean {
  const haystack = [
    property.title,
    property.location.address,
    property.location.neighborhood,
    property.location.city,
    property.propertyType,
    property.description ?? "",
  ]
    .join(" ")
    .toLowerCase();
  const needle = query.trim().toLowerCase();
  if (needle !== "" && !haystack.includes(needle)) return false;

  if (price.min !== null && property.price.amount < price.min) return false;
  if (price.max !== null && property.price.amount > price.max) return false;

  if (!matchesBedrooms(property, rooms.bedrooms)) return false;
  if (!matchesBathrooms(property, rooms.bathrooms)) return false;

  if (types.length > 0 && !types.includes(propertyTypeKey(property.propertyType))) {
    return false;
  }
  return true;
}

function buildPriceDistribution(items: readonly Property[]): number[] {
  const buckets = new Array((SLIDER_MAX - SLIDER_MIN) / SLIDER_STEP).fill(0);
  for (const item of items) {
    if (item.price.amount < SLIDER_MIN || item.price.amount > SLIDER_MAX) continue;
    const index = Math.min(
      buckets.length - 1,
      Math.floor((item.price.amount - SLIDER_MIN) / SLIDER_STEP),
    );
    buckets[index] += 1;
  }
  return buckets;
}

const EMPTY_PRICE: PriceRangeFilter = { min: null, max: null, specials: false };
const EMPTY_ROOMS: RoomsSelection = { bedrooms: [], bathrooms: [] };

export function ContactedCards() {
  const [query, setQuery] = useState("");
  const [price, setPrice] = useState<PriceRangeFilter>(EMPTY_PRICE);
  const [rooms, setRooms] = useState<RoomsSelection>(EMPTY_ROOMS);
  const [types, setTypes] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<PropertyContactStatus[]>([]);
  const [page, setPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(
    () =>
      new Set(
        DEMO_PROPERTIES.filter((item) => item.actions.isFavorite).map((item) => item.id),
      ),
  );

  const distribution = useMemo(() => buildPriceDistribution(DEMO_PROPERTIES), []);

  const statusedProperties = useMemo(
    () =>
      DEMO_PROPERTIES.map((property, index) => ({
        property,
        contactStatus: DEMO_CONTACT_STATUSES[index % DEMO_CONTACT_STATUSES.length],
      })),
    [],
  );

  const visibleProperties = useMemo(
    () =>
      statusedProperties.filter(
        ({ property, contactStatus }) =>
          (statuses.length === 0 || statuses.includes(contactStatus)) &&
          matchesFilters(property, query, price, rooms, types),
      ),
    [statusedProperties, statuses, query, price, rooms, types],
  );

  const visibleCount = visibleProperties.length;
  const pageCount = Math.max(1, Math.ceil(visibleCount / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paginatedProperties = visibleProperties.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const hasFilters =
    query.trim() !== "" ||
    price.min !== null ||
    price.max !== null ||
    rooms.bedrooms.length > 0 ||
    rooms.bathrooms.length > 0 ||
    types.length > 0 ||
    statuses.length > 0;

  const handleFavoriteToggle = (propertyId: string) => {
    setFavoriteIds((previous) => {
      const next = new Set(previous);
      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }
      return next;
    });
  };

  const handleStatusToggle = (status: PropertyContactStatus) => {
    setStatuses((previous) =>
      previous.includes(status)
        ? previous.filter((item) => item !== status)
        : [...previous, status],
    );
    setPage(1);
  };

  const handleClearFilters = () => {
    setQuery("");
    setPrice(EMPTY_PRICE);
    setRooms(EMPTY_ROOMS);
    setTypes([]);
    setStatuses([]);
    setPage(1);
  };

  return (
    <div>
      <div className="border-b border-zinc-200 bg-white px-4 py-3 shadow-[0_4px_16px_-12px_rgba(24,24,27,0.2)] sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
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
                setPrice(EMPTY_PRICE);
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
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">
            Estado
          </span>
          {STATUS_FILTER_OPTIONS.map((option) => (
            <FilterChipButton
              key={option.value}
              label={option.label}
              selected={statuses.includes(option.value)}
              onClick={() => handleStatusToggle(option.value)}
            />
          ))}
        </div>
      </div>

      <div className="px-4 pt-6 sm:px-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-zinc-600">
            {visibleCount}{" "}
            {visibleCount === 1 ? "propiedad contactada" : "propiedades contactadas"}
            {visibleCount !== DEMO_PROPERTIES.length
              ? ` de ${DEMO_PROPERTIES.length}`
              : ""}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={handleClearFilters}
              className="cursor-pointer rounded-full px-3 py-1.5 text-sm font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
            >
              Limpiar filtros
            </button>
          ) : null}
        </div>

        {visibleCount > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedProperties.map(({ property, contactStatus }) => (
                <PropertyCard
                  key={property.id}
                  stacked
                  contactStatus={contactStatus}
                  property={{
                    ...property,
                    actions: { isFavorite: favoriteIds.has(property.id) },
                  }}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                page={currentPage}
                pageCount={pageCount}
                onPageChange={setPage}
              />
            </div>
          </>
        ) : (
          <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500">
            No hay propiedades que coincidan con los filtros.
          </p>
        )}
      </div>
    </div>
  );
}
