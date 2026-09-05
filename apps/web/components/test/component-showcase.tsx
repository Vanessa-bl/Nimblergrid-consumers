"use client";

import { useState, type ReactNode } from "react";
import { Checkbox, CheckboxControl } from "@/components/checkbox";
import { Avatar } from "@/components/avatar/Avatar";
import type { AvatarSize, AvatarTone } from "@/components/avatar/Avatar.types";
import { UserProfileCardExample } from "@/components/UserProfileCard/UserProfileCard.example";
import { DatePicker } from "@/components/ui/date-picker";
import { Pagination } from "@/components/Pagination/Pagination";
import { ViewModeToggle } from "@/components/ui/view-mode-toggle";
import { PropertyCard } from "@/components/PropertyCard/PropertyCard";
import {
  DEMO_PROPERTIES,
  PROPERTY_CARD_PROPS,
} from "@/components/test/property-card-fixtures";
import {
  AVATAR_PROPS,
  USER_PROFILE_CARD_PROPS,
  USER_PROFILE_CARD_USAGE,
} from "@/components/test/user-profile-fixtures";
import { TextField } from "@/components/form/TextField/TextField";
import { CurrencyInput } from "@/components/form/CurrencyInput/CurrencyInput";
import { PillSelect } from "@/components/form/PillSelect/PillSelect";
import { InfoTooltip } from "@/components/form/InfoTooltip/InfoTooltip";
import {
  CREDIT_OPTIONS,
  CURRENCY_INPUT_PROPS,
  HOUSEHOLD_OPTIONS,
  INFO_TOOLTIP_PROPS,
  PETS_OPTIONS,
  PILL_SELECT_PROPS,
  TEXT_FIELD_PROPS,
} from "@/components/test/form-fixtures";
import { FilterChipButton } from "@/components/filters/FilterChipButton/FilterChipButton";
import { MoveInByDropdown } from "@/components/filters/MoveInByDropdown/MoveInByDropdown";
import { PriceRangeDropdown } from "@/components/filters/PriceRangeDropdown/PriceRangeDropdown";
import { PropertySearchBar } from "@/components/filters/PropertySearchBar/PropertySearchBar";
import { PropertyTypeDropdown } from "@/components/filters/PropertyTypeDropdown/PropertyTypeDropdown";
import { RoomsFilterDropdown } from "@/components/filters/RoomsFilterDropdown/RoomsFilterDropdown";
import { PropsTable, type DocProp } from "@/components/test/props-table";
import type { PriceRangeFilter } from "@/components/filters/PriceRangeDropdown/PriceRangeDropdown.types";
import type { RoomsSelection } from "@/components/filters/RoomsFilterDropdown/RoomsFilterDropdown.types";

const SEARCH_PROPS: readonly DocProp[] = [
  {
    name: "placeholder?",
    description: "Texto sugerido cuando el campo está vacío.",
  },
  {
    name: "value",
    required: true,
    description: "Valor actual del texto. Controlado por el padre.",
  },
  {
    name: "onValueChange",
    required: true,
    description: "Se dispara en cada cambio de texto con el nuevo valor.",
  },
  {
    name: "onSearchSubmit?",
    description: "Se dispara al presionar Enter o la lupa con el valor actual.",
  },
];

const CHIP_PROPS: readonly DocProp[] = [
  {
    name: "label",
    required: true,
    description: "Texto visible del chip.",
  },
  {
    name: "isOpen?",
    description: "Estado 'abierto': estilo activo y chevron girado 180°.",
  },
  {
    name: "hasValue?",
    description: "Filtro aplicado: acento rosa en texto y borde.",
  },
  {
    name: "hasIcon?",
    description: "Muestra u oculta el chevron (default: true).",
  },
  {
    name: "selected?",
    description:
      "Modo toggle standalone: al activarse muestra una X adentro y aria-pressed. Si no se pasa, el chip es un trigger de dropdown.",
  },
  {
    name: "buttonRef?",
    description:
      "Ref al botón para restaurar el foco al cerrar el popover (lo usan los dropdowns).",
  },
  {
    name: "onClick?",
    description: "Callback al presionar el chip.",
  },
];

const PRICE_PROPS: readonly DocProp[] = [
  {
    name: "label?",
    description: "Texto base del chip cuando no hay filtro (default 'Price').",
  },
  {
    name: "minPrice",
    required: true,
    description: "Mínimo aplicado actualmente (null = sin límite).",
  },
  {
    name: "maxPrice",
    required: true,
    description: "Máximo aplicado actualmente (null = sin límite).",
  },
  {
    name: "onlySpecials",
    required: true,
    description: "Indica si el checkbox 'rent specials' está aplicado.",
  },
  {
    name: "totalResults",
    required: true,
    description: "Cantidad que muestra el botón 'View X homes'.",
  },
  {
    name: "distribution?",
    description:
      "Histograma: conteo de propiedades por tramo de precio. Sin datos no se dibujan barras.",
  },
  {
    name: "onApply",
    required: true,
    description: "Se dispara con { min, max, specials } al presionar View.",
  },
  {
    name: "onClear",
    required: true,
    description: "Se dispara al presionar 'Clear all'.",
  },
];

const ROOMS_PROPS: readonly DocProp[] = [
  {
    name: "label?",
    description: "Texto del chip sin filtro (default 'Rooms').",
  },
  {
    name: "selectedBedrooms",
    required: true,
    description:
      "Conjunto seleccionado de dormitorios (ej: ['Studio','1','2','3']). Marcar un número auto-selecciona el prefijo 1..N.",
  },
  {
    name: "selectedBathrooms",
    required: true,
    description: "Conjunto seleccionado de baños con la misma regla de prefijo.",
  },
  {
    name: "onChange",
    required: true,
    description: "Se dispara en cada cambio con el nuevo { bedrooms, bathrooms }.",
  },
  {
    name: "onDone",
    required: true,
    description: "Se dispara al presionar 'Done'.",
  },
];

const TYPE_PROPS: readonly DocProp[] = [
  {
    name: "label?",
    description: "Texto del chip sin filtro (default 'Property type').",
  },
  {
    name: "selectedTypes",
    required: true,
    description: "Tipos seleccionados actualmente (controlado por el padre).",
  },
  {
    name: "totalResults",
    required: true,
    description: "Cantidad del botón 'View X homes'.",
  },
  {
    name: "onApply",
    required: true,
    description: "Se dispara con el array de tipos al presionar View.",
  },
  {
    name: "onClear",
    required: true,
    description: "Se dispara al presionar 'Clear all'.",
  },
];

const MOVE_IN_PROPS: readonly DocProp[] = [
  {
    name: "label?",
    description: "Texto del chip sin fecha (default 'Move-in by').",
  },
  {
    name: "selectedDate",
    required: true,
    description: "Fecha ISO (yyyy-mm-dd) o null. Controlado por el padre.",
  },
  {
    name: "onDateChange",
    required: true,
    description: "Se dispara al elegir o limpiar la fecha.",
  },
  {
    name: "onDone",
    required: true,
    description: "Se dispara al presionar 'Done'.",
  },
];

const TOGGLE_PROPS: readonly DocProp[] = [
  {
    name: "options",
    required: true,
    description:
      "Opciones { label, value, icon? }. Soporta 2 o más y cualquier tipo de value.",
  },
  {
    name: "value?",
    description: "Modo controlado: la selección la decide el padre.",
  },
  {
    name: "defaultValue?",
    description: "Selección inicial en modo no controlado.",
  },
  {
    name: "onChange?",
    description: "Se dispara al cambiar la selección.",
  },
  {
    name: "size?",
    description: "sm | md | lg (default md).",
  },
  {
    name: "className?",
    description: "Clases extra para el contenedor (ej: ancho).",
  },
  {
    name: "ariaLabel?",
    description: "Label accesible del tablist (default 'View options').",
  },
];

const CHECKBOX_PROPS: readonly DocProp[] = [
  {
    name: "label?",
    description: "Texto principal al lado del control.",
  },
  {
    name: "description?",
    description: "Texto secundario debajo del label.",
  },
  {
    name: "checked?",
    description: "Modo controlado: el estado lo decide el padre.",
  },
  {
    name: "defaultChecked?",
    description: "Estado inicial en modo no controlado (default: false).",
  },
  {
    name: "disabled?",
    description: "Bloquea la interacción y atenúa el texto.",
  },
  {
    name: "onChange?",
    description:
      "Se dispara al alternar (siempre, incluso en modo controlado). En la molécula todas las props son opcionales; sin label usá CheckboxControl con aria-label.",
  },
  {
    name: "checkIcon?",
    description:
      "Reemplaza la tilde por defecto (debe respetar currentColor blanco).",
  },
  {
    name: "containerProps?",
    description: "Props extra para la celda clickeable.",
  },
  {
    name: "…props de input nativo",
    description:
      "id, name, value, aria-*, onBlur, onFocus y demás InputHTMLAttributes se propagan al input real (compatible con react-hook-form).",
  },
];

const DATE_PROPS: readonly DocProp[] = [
  {
    name: "value",
    required: true,
    description: "Fecha ISO (yyyy-mm-dd) o null. Controlada por el padre.",
  },
  {
    name: "onChange",
    required: true,
    description: "Se dispara al elegir una fecha o limpiarla (null).",
  },
  {
    name: "id?",
    description: "Id del input (para asociar un label externo).",
  },
  {
    name: "min?",
    description: "Fecha mínima permitida en formato ISO.",
  },
  {
    name: "max?",
    description: "Fecha máxima permitida en formato ISO.",
  },
  {
    name: "className?",
    description: "Clases extra para el input.",
  },
  {
    name: "…props de input nativo",
    description:
      "aria-label, disabled y demás props nativas de input se propagan al elemento date.",
  },
];

const PROPERTY_CARD_USAGE = `<PropertyCard
  property={property}
  onFavoriteToggle={(propertyId) => toggleFavorite(propertyId)}
  onSelectionChange={(propertyId, selected) => updateSelection(propertyId, selected)}
/>;`;

type ShowcaseSectionProps = {
  title: string;
  description: string;
  props: readonly DocProp[];
  example: ReactNode;
  usage?: string;
};

function ShowcaseSection({
  title,
  description,
  props,
  example,
  usage,
}: Readonly<ShowcaseSectionProps>) {
  return (
    <section className="grid gap-8 border-t border-zinc-200 py-14 lg:grid-cols-[minmax(0,1fr)_440px]">
      <div className="min-w-0">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[28px]">
          {title}
        </h2>
        <p className="mt-2 max-w-[64ch] text-sm leading-relaxed text-zinc-600">
          {description}
        </p>
        <PropsTable props={props} />
        {usage !== undefined ? (
          <>
            <h3 className="mt-8 text-sm font-semibold text-zinc-900">Uso</h3>
            <pre className="mt-2 overflow-x-auto rounded-xl bg-zinc-900 p-4 font-mono text-[12.5px] leading-relaxed text-zinc-100">
              {usage}
            </pre>
          </>
        ) : null}
      </div>
      <div className="min-w-0 self-start rounded-2xl border border-zinc-200 bg-zinc-50/70 p-6">
        {example}
      </div>
    </section>
  );
}

function PropertyCardExample() {
  const [favoriteIds, setFavoriteIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const property = DEMO_PROPERTIES[0];

  const cardProperty = {
    ...property,
    actions: { isFavorite: favoriteIds.has(property.id) },
  };
  const isSelected = selectedIds.has(property.id);

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

  const handleSelectionChange = (propertyId: string, selected: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (selected) {
        next.add(propertyId);
      } else {
        next.delete(propertyId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-3">
      <PropertyCard
        property={cardProperty}
        selected={isSelected}
        onFavoriteToggle={handleFavoriteToggle}
        onSelectionChange={handleSelectionChange}
      />
      <p className="min-h-5 text-sm text-zinc-500">
        {cardProperty.actions.isFavorite ? "Favorita" : "No favorita"}
        {" · "}
        {isSelected ? "Seleccionada" : "Sin seleccionar"}
        {" — el estado vive en esta pantalla, la card solo emite callbacks"}
      </p>
    </div>
  );
}

function SearchExample() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  return (
    <div className="space-y-3">
      <PropertySearchBar
        value={query}
        onValueChange={setQuery}
        onSearchSubmit={setSubmitted}
      />
      <p className="min-h-5 text-sm text-zinc-500">
        {submitted !== "" ? `Enviado: "${submitted}"` : "Enter o la lupa envían el texto"}
      </p>
    </div>
  );
}

function ChipsExample() {
  const [selected, setSelected] = useState(false);
  return (
    <div className="flex flex-wrap gap-2">
      <FilterChipButton label="Rooms" />
      <FilterChipButton label="Price" isOpen />
      <FilterChipButton label="$1,500+" hasValue />
      <FilterChipButton
        label="Demo toggle"
        selected={selected}
        onClick={() => setSelected((current) => !current)}
      />
    </div>
  );
}

function PriceExample() {
  const [filter, setFilter] = useState<PriceRangeFilter>({
    min: null,
    max: null,
    specials: false,
  });
  return (
    <PriceRangeDropdown
      minPrice={filter.min}
      maxPrice={filter.max}
      onlySpecials={filter.specials}
      totalResults={128}
      distribution={[4, 9, 14, 22, 30, 26, 18, 12, 7, 5, 3]}
      onApply={setFilter}
      onClear={() => setFilter({ min: null, max: null, specials: false })}
    />
  );
}

function RoomsExample() {
  const [rooms, setRooms] = useState<RoomsSelection>({
    bedrooms: [],
    bathrooms: [],
  });
  return (
    <RoomsFilterDropdown
      selectedBedrooms={rooms.bedrooms}
      selectedBathrooms={rooms.bathrooms}
      onChange={setRooms}
      onDone={() => undefined}
    />
  );
}

function TypesExample() {
  const [types, setTypes] = useState<string[]>([]);
  return (
    <PropertyTypeDropdown
      selectedTypes={types}
      totalResults={128}
      onApply={setTypes}
      onClear={() => setTypes([])}
    />
  );
}

function MoveInExample() {
  const [date, setDate] = useState<string | null>(null);
  return (
    <MoveInByDropdown
      selectedDate={date}
      onDateChange={setDate}
      onDone={() => undefined}
    />
  );
}

function ViewToggleExample() {
  const [view, setView] = useState<"list" | "map">("list");
  return (
    <div className="space-y-4">
      <ViewModeToggle
        ariaLabel="Results view mode"
        className="w-44"
        options={[
          { label: "List", value: "list" },
          { label: "Map", value: "map" },
        ]}
        value={view}
        onChange={setView}
      />
      <p className="text-sm text-zinc-500">
        Vista seleccionada: {view === "list" ? "List" : "Map"}
      </p>
    </div>
  );
}

function CheckboxExample() {
  return (
    <div className="space-y-5">
      <Checkbox
        label="Acepto los términos"
        description="Podés desmarcarlo con un click."
        defaultChecked
      />
      <Checkbox label="Opción deshabilitada" description="Sin interacción." disabled />
      <CheckboxControl
        aria-label="Seleccionar fila (CheckboxControl)"
        defaultChecked
      />
      <p className="text-xs text-zinc-400">
        CheckboxControl es la variante standalone sin texto, usada en tablas y
        en el modo selección de PropertyCard.
      </p>
    </div>
  );
}

function DateExample() {
  const [date, setDate] = useState<string | null>(null);
  return (
    <div className="max-w-60 space-y-3">
      <DatePicker
        aria-label="Fecha de ejemplo"
        value={date}
        onChange={setDate}
      />
      <p className="min-h-5 text-sm text-zinc-500">
        {date !== null ? `Elegida: ${date}` : "Sin fecha"}
      </p>
    </div>
  );
}

const AVATAR_SIZE_DEMOS: readonly { size: AvatarSize; label: string }[] = [
  { size: "xs", label: "24px" },
  { size: "sm", label: "32px" },
  { size: "md", label: "48px" },
  { size: "lg", label: "72px" },
  { size: "xl", label: "96px" },
];

const AVATAR_TONE_DEMOS: readonly { tone: AvatarTone; label: string }[] = [
  { tone: "rose", label: "rose" },
  { tone: "dark", label: "dark" },
  { tone: "light", label: "light" },
  { tone: "muted", label: "muted" },
];

function ExampleCaption({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
      {children}
    </p>
  );
}

function AvatarExample() {
  return (
    <div className="space-y-6">
      <div>
        <ExampleCaption>Tamaños</ExampleCaption>
        <div className="flex flex-wrap items-start gap-4">
          {AVATAR_SIZE_DEMOS.map(({ size, label }) => (
            <div key={size} className="flex flex-col items-center gap-1.5">
              <Avatar name="Iraima Hurtado" size={size} />
              <span className="text-[11px] text-zinc-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <ExampleCaption>Tonos del fallback</ExampleCaption>
        <div className="flex flex-wrap items-start gap-4">
          {AVATAR_TONE_DEMOS.map(({ tone, label }) => (
            <div key={tone} className="flex flex-col items-center gap-1.5">
              <Avatar name="Marta Rossi" size="lg" tone={tone} />
              <span className="font-mono text-[11px] text-zinc-500">{label}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 max-w-[38ch] text-xs leading-relaxed text-zinc-500">
          Rose es el tono por defecto; light y muted están pensados para
          superficies blancas (llevan borde sutil).
        </p>
      </div>
      <div>
        <ExampleCaption>Imagen con error</ExampleCaption>
        <div className="flex items-center gap-3">
          <Avatar
            name="Iraima Hurtado"
            size="lg"
            avatarUrl="https://avatars.invalid/hallo-avatar.jpg"
            alt="Foto de Iraima Hurtado"
          />
          <p className="text-xs leading-relaxed text-zinc-500">
            La URL no existe: al fallar la carga el avatar pasa solo a las
            iniciales del nombre.
          </p>
        </div>
      </div>
      <div>
        <ExampleCaption>Sin nombre</ExampleCaption>
        <div className="flex items-center gap-3">
          <Avatar size="lg" tone="muted" />
          <p className="text-xs leading-relaxed text-zinc-500">
            Sin nombre ni imagen se muestra una silueta neutral marcada como
            decorativa.
          </p>
        </div>
      </div>
    </div>
  );
}

function TextFieldExample() {
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);
  const error =
    touched && name.trim() === "" ? "Ingresá tu nombre para continuar." : undefined;

  return (
    <div className="space-y-5">
      <TextField
        label="Nombre completo"
        required
        value={name}
        placeholder="Iraima Hurtado"
        helper={error === undefined ? "Como figura en tu documento." : undefined}
        error={error}
        onChange={(event) => setName(event.target.value)}
        onBlur={() => setTouched(true)}
      />
      <div className="space-y-4 border-t border-zinc-200 pt-4">
        <TextField
          label="Email"
          readOnly
          value="iraima@hallo.one"
          helper="No editable: se usa para iniciar sesión."
        />
        <TextField
          label="Código postal"
          disabled
          value=""
          placeholder="Campo deshabilitado"
        />
      </div>
    </div>
  );
}

function CurrencyExample() {
  const [digits, setDigits] = useState("");
  return (
    <div className="space-y-3">
      <CurrencyInput
        label="Estimated household income"
        required
        value={digits}
        onValueChange={setDigits}
        suffix="/year"
        placeholder="90000"
        helper="Escribí solo números: los separadores se agregan solos."
      />
      <p className="min-h-5 text-sm text-zinc-500">
        Valor plano: {digits === "" ? "—" : digits}
      </p>
    </div>
  );
}

function PillSelectExample() {
  const [household, setHousehold] = useState<string | null>("2");
  const [pets, setPets] = useState<string | null>(null);
  const [credit, setCredit] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <PillSelect
        label="Total people in household"
        required
        options={HOUSEHOLD_OPTIONS}
        value={household}
        onChange={setHousehold}
        helper="Incluí a todas las personas que van a vivir ahí."
      />
      <PillSelect
        label="Pets"
        options={PETS_OPTIONS}
        value={pets}
        onChange={setPets}
      />
      <PillSelect
        label="Your credit score"
        options={CREDIT_OPTIONS}
        value={credit}
        onChange={setCredit}
      />
      <p className="min-h-5 border-t border-zinc-200 pt-3 text-sm text-zinc-500">
        Household: {household ?? "—"} · Pets: {pets ?? "—"} · Credit:{" "}
        {credit ?? "—"}
      </p>
    </div>
  );
}

const PAGINATION_PROPS: readonly DocProp[] = [
  {
    name: "page",
    required: true,
    description: "Página actual (1-based). Controlada por el padre.",
  },
  {
    name: "pageCount",
    required: true,
    description:
      "Total de páginas. Con 1 o menos el paginador no se renderiza.",
  },
  {
    name: "onPageChange",
    required: true,
    description:
      "Se dispara al elegir una página (número, anterior o siguiente) con la página nueva.",
  },
  {
    name: "siblingCount?",
    description:
      "Páginas visibles alrededor de la actual (default 1). Se muestran elipsis cuando hay saltos.",
  },
  {
    name: "boundaryCount?",
    description: "Páginas fijas al inicio y al final (default 1).",
  },
  {
    name: "disabled?",
    description: "Deshabilita todo el control.",
  },
  {
    name: "ariaLabel?",
    description: "Label accesible del nav (default 'Paginación').",
  },
  {
    name: "previousLabel? / nextLabel?",
    description:
      "aria-label de los botones de página anterior / siguiente (con chevrons).",
  },
  {
    name: "className?",
    description: "Clases extra para el contenedor nav.",
  },
];

function PaginationExample() {
  const [page, setPage] = useState(1);
  return (
    <div className="space-y-4">
      <Pagination page={page} pageCount={12} onPageChange={setPage} />
      <p className="text-center text-sm text-zinc-500">
        Página actual: {page} de 12
      </p>
    </div>
  );
}

function InfoTooltipExample() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-zinc-900">
          Total people in household
        </span>
        <InfoTooltip content="Sumá todas las personas que van a vivir en la propiedad, incluidos menores." />
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-zinc-900">
          Estimated household income
        </span>
        <InfoTooltip
          placement="left"
          content="Ingreso anual bruto combinado del hogar, antes de impuestos."
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-zinc-900">
          Your credit score
        </span>
        <InfoTooltip content="Rango de tu score crediticio según el último reporte." />
      </div>
      <p className="text-xs text-zinc-400">
        El tooltip abre con click y cierra con Escape o click afuera.
      </p>
    </div>
  );
}

export function ComponentShowcase() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6">
      <header className="max-w-[720px] pb-4">
        <h1 className="text-3xl font-semibold leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl">
          Test de componentes
        </h1>
        <p className="mt-3 text-base leading-relaxed text-zinc-600">
          Cada bloque documenta un componente del proyecto: qué recibe por
          props, qué hace cada prop y un ejemplo interactivo. Probá los
          dropdowns, el teclado (Escape, flechas, Tab) y los modos controlado /
          no controlado.
        </p>
      </header>

      <section className="border-t border-zinc-200 py-10">
        <div className="rounded-2xl border border-zinc-200 bg-white p-3 sm:p-6">
          <PropertyCardExample />
        </div>
        <div className="mt-8 max-w-[720px]">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-[28px]">
            PropertyCard
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600">
            Card inmobiliaria horizontal (imagen 30% / contenido 70%)
            totalmente prop-driven: sin datos propios, galería navegable,
            favorito y selección controlados por el padre. Arriba se ve la
            card en su ancho real; en /test-list está la lista completa con
            selección múltiple.
          </p>
          <PropsTable props={PROPERTY_CARD_PROPS} />
          <h3 className="mt-8 text-sm font-semibold text-zinc-900">Uso</h3>
          <pre className="mt-2 overflow-x-auto rounded-xl bg-zinc-900 p-4 font-mono text-[12.5px] leading-relaxed text-zinc-100">
            {PROPERTY_CARD_USAGE}
          </pre>
        </div>
      </section>

      <ShowcaseSection
        title="PropertySearchBar"
        description="Barra de búsqueda tipo píldora. El texto es controlado por el padre y el submit sale por callback (Enter o lupa)."
        props={SEARCH_PROPS}
        example={<SearchExample />}
      />

      <ShowcaseSection
        title="FilterChipButton"
        description="Chip base de la barra de filtros. Sirve como trigger de dropdown (chevron) o como toggle standalone con X (prop selected)."
        props={CHIP_PROPS}
        example={<ChipsExample />}
      />

      <ShowcaseSection
        title="PriceRangeDropdown"
        description="Filtro de precio con histograma data-driven, slider de doble handle y selects min/max. El checkbox de 'rent specials' es el Checkbox del proyecto."
        props={PRICE_PROPS}
        example={<PriceExample />}
      />

      <ShowcaseSection
        title="RoomsFilterDropdown"
        description="Dormitorios y baños con selección acumulativa: marcar un número auto-selecciona el prefijo y Studio se puede sumar."
        props={ROOMS_PROPS}
        example={<RoomsExample />}
      />

      <ShowcaseSection
        title="PropertyTypeDropdown"
        description="Grilla de tipos con iconos propios. 'Any' queda seleccionado cuando no hay filtro; los cambios salen al aplicar."
        props={TYPE_PROPS}
        example={<TypesExample />}
      />

      <ShowcaseSection
        title="MoveInByDropdown"
        description="Fecha límite de mudanza usando el DatePicker del proyecto. El chip muestra la fecha en formato mm/dd/yy."
        props={MOVE_IN_PROPS}
        example={<MoveInExample />}
      />

      <ShowcaseSection
        title="ViewModeToggle"
        description="Selector segmentado genérico (List/Map) con pill animada, soporte de N opciones y navegación por flechas."
        props={TOGGLE_PROPS}
        example={<ViewToggleExample />}
      />

      <ShowcaseSection
        title="Checkbox / CheckboxControl"
        description="Checkbox Croma-clon: controlado o no controlado, con aura, foco azul y estados disabled. Reutilizado por los filtros y la selección de cards."
        props={CHECKBOX_PROPS}
        example={<CheckboxExample />}
      />

      <ShowcaseSection
        title="DatePicker"
        description="Input de fecha nativo estilizado, controlado por el padre con formato ISO. Usado dentro de MoveInByDropdown."
        props={DATE_PROPS}
        example={<DateExample />}
      />

      <ShowcaseSection
        title="Avatar"
        description="Avatar circular reutilizable de la familia atómica components/avatar. Con avatarUrl renderiza la imagen (img plano, apto para URLs remotas) y ante cualquier error de carga cae a las iniciales del nombre; sin nombre muestra una silueta. Cada tamaño (xs–xl) y tono (rose, dark, light, muted) es una clase estática precomputada."
        props={AVATAR_PROPS}
        example={<AvatarExample />}
      />

      <ShowcaseSection
        title="UserProfileCard"
        description="Card de perfil Tus datos compuesta con el Avatar del proyecto. Prop-driven y sin props obligatorias: con data muestra nombre y filas de contacto no vacías, con isLoading el skeleton (aria-busy) y con data null el estado vacío informativo. El botón Editar datos solo existe si llega onEdit y recibe el objeto completo. Los adapters puros Supabase y Magento viven en UserProfileCard.types."
        props={USER_PROFILE_CARD_PROPS}
        example={<UserProfileCardExample />}
        usage={USER_PROFILE_CARD_USAGE}
      />

      <ShowcaseSection
        title="TextField"
        description="Input de texto de la familia form: label con asterisco para campos obligatorios, helper, error (aria-invalid + borde rose), adornos laterales, disabled y readOnly con estilo propio (enfocable pero sin edición). Todas las props nativas del input se propagan."
        props={TEXT_FIELD_PROPS}
        example={<TextFieldExample />}
      />

      <ShowcaseSection
        title="CurrencyInput"
        description="Campo de montos construido sobre TextField. El valor SIEMPRE son dígitos planos ('90000') y el display se formatea solo con separador de miles ('90,000'); el prefijo '$' y el sufijo '/year' llegan por props. Ideal para 'Estimated household income'."
        props={CURRENCY_INPUT_PROPS}
        example={<CurrencyExample />}
      />

      <ShowcaseSection
        title="PillSelect"
        description="Selector de píldoras single-select con semántica de radios reales: role radiogroup, navegación por flechas, un solo tab stop y aria-labelledby desde el título. La opción activa usa el patrón oscuro zinc-900 del proyecto. Sirve para household, pets, credit score, lease duration, bedrooms y parking."
        props={PILL_SELECT_PROPS}
        example={<PillSelectExample />}
      />

      <ShowcaseSection
        title="InfoTooltip"
        description="Icono '?' con panel de ayuda: abre con click (aria-expanded), cierra con Escape o click afuera y el contenido tiene role tooltip. Pensado para explicar campos como household income o credit score."
        props={INFO_TOOLTIP_PROPS}
        example={<InfoTooltipExample />}
      />

      <ShowcaseSection
        title="Pagination"
        description="Paginador de la familia atómica del proyecto: botones pill con la página actual en zinc-900, elipsis automáticas cuando hay saltos (sibling/boundary), y chevrons con aria-label. No se renderiza con una sola página. Se usa en test-list y en el tab Contactados de test-profile."
        props={PAGINATION_PROPS}
        example={<PaginationExample />}
      />
    </div>
  );
}
