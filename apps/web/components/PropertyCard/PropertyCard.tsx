"use client";

import { memo, useRef, useState, type TouchEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CheckboxControl } from "@/components/checkbox";
import { ChevronLeftIcon } from "@/components/ui/icons/chevron-left";
import { ChevronRightIcon } from "@/components/ui/icons/chevron-right";
import { HeartIcon } from "@/components/ui/icons/heart";
import { ImagePlaceholderIcon } from "@/components/ui/icons/image-placeholder";
import { PhoneIcon } from "@/components/ui/icons/phone";
import { WhatsAppIcon } from "@/components/ui/icons/whatsapp";
import type {
  PropertyCardProps,
  PropertyContactStatus,
  PropertyFeatures,
  PropertyImage,
  PropertyLocation,
  PropertyPrice,
} from "./PropertyCard.types";

const numberFormatter = new Intl.NumberFormat("es-AR");
const focusVisibleClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500";

const CONTACT_STATUS_LABELS: Record<PropertyContactStatus, string> = {
  contactado: "Contactado",
  leido: "Leído",
  "en-proceso": "En proceso",
  completado: "Completado",
};

function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

function formatPrice(price: PropertyPrice): string {
  return `${price.currency} ${numberFormatter.format(price.amount)}`;
}

function getAgentInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function toWhatsAppHref(whatsapp: string): string | null {
  const digits = whatsapp.replace(/\D/g, "");
  return digits.length > 0 ? `https://wa.me/${digits}` : null;
}

type GalleryImageProps = {
  image: PropertyImage | null;
};

function GalleryImage({ image }: Readonly<GalleryImageProps>) {
  if (image === null) {
    return (
      <div className="absolute inset-0 flex items-center justify-center text-zinc-300">
        <ImagePlaceholderIcon className="h-12 w-12" />
      </div>
    );
  }
  return (
    <Image
      key={image.id}
      src={image.url}
      alt={image.alt || ""}
      fill
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
    />
  );
}

type GalleryNavigationProps = {
  visible: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

function GalleryNavigation({
  visible,
  onPrevious,
  onNext,
}: Readonly<GalleryNavigationProps>) {
  if (!visible) return null;
  return (
    <>
      <button
        type="button"
        aria-label="Imagen anterior"
        onClick={onPrevious}
        className={`absolute left-2 top-1/2 z-10 flex h-9 w-9 cursor-pointer -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-zinc-900 ${focusVisibleClasses}`}
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Imagen siguiente"
        onClick={onNext}
        className={`absolute right-2 top-1/2 z-10 flex h-9 w-9 cursor-pointer -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-zinc-700 shadow-md backdrop-blur-sm transition-colors hover:bg-white hover:text-zinc-900 ${focusVisibleClasses}`}
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </>
  );
}

type GalleryDotsProps = {
  images: PropertyImage[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

function GalleryDots({
  images,
  activeIndex,
  onSelect,
}: Readonly<GalleryDotsProps>) {
  if (images.length < 2) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex items-end justify-center gap-1">
      {images.map((image, index) => {
        const active = index === activeIndex;
        const dotClass = active
          ? "w-4 bg-white"
          : "w-1.5 bg-white/60 group-hover/dot:bg-white/90";
        return (
          <button
            key={image.id}
            type="button"
            aria-label={`Ver imagen ${index + 1} de ${images.length}`}
            aria-current={active ? "true" : undefined}
            onClick={() => onSelect(index)}
            className="group/dot pointer-events-auto flex h-5 w-5 cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rose-500"
          >
            <span
              aria-hidden="true"
              className={`h-1.5 rounded-full transition-all duration-300 ${dotClass}`}
            />
          </button>
        );
      })}
    </div>
  );
}

type GalleryLiveRegionProps = {
  visible: boolean;
  current: number;
  total: number;
};

function GalleryLiveRegion({
  visible,
  current,
  total,
}: Readonly<GalleryLiveRegionProps>) {
  if (!visible) return null;
  return (
    <span className="sr-only" aria-live="polite">
      {`Imagen ${current} de ${total}`}
    </span>
  );
}

function BadgeTag({ badge }: Readonly<{ badge: string }>) {
  if (badge === "") return null;
  return (
    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-zinc-900 shadow-sm backdrop-blur-sm">
      {badge}
    </span>
  );
}

type FavoriteButtonProps = {
  isFavorite: boolean;
  propertyId: string;
  onToggle?: (propertyId: string) => void;
};

function FavoriteButton({
  isFavorite,
  propertyId,
  onToggle,
}: Readonly<FavoriteButtonProps>) {
  const label = isFavorite ? "Quitar de favoritos" : "Agregar a favoritos";
  const toneClass = isFavorite
    ? "text-rose-500"
    : "text-zinc-600 hover:text-rose-500";
  return (
    <button
      type="button"
      aria-pressed={isFavorite}
      aria-label={label}
      onClick={() => onToggle?.(propertyId)}
      className={`absolute right-3 top-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur-sm transition-colors ${toneClass} ${focusVisibleClasses}`}
    >
      <HeartIcon className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
    </button>
  );
}

type SelectionToggleProps = {
  enabled: boolean;
  selected: boolean;
  propertyId: string;
  onChange?: (propertyId: string, selected: boolean) => void;
};

function SelectionToggle({
  enabled,
  selected,
  propertyId,
  onChange,
}: Readonly<SelectionToggleProps>) {
  if (!enabled) return null;
  const label = selected
    ? "Quitar selección de la propiedad"
    : "Seleccionar propiedad";
  return (
    <div className="absolute bottom-3 left-3 z-10">
      <CheckboxControl
        checked={selected}
        aria-label={label}
        onChange={(event) => onChange?.(propertyId, event.target.checked)}
      />
    </div>
  );
}

type GalleryMediaProps = {
  images: PropertyImage[];
  badge: string;
  propertyId: string;
  isFavorite: boolean;
  selected: boolean;
  selectionEnabled: boolean;
  stacked: boolean;
  onFavoriteToggle?: (propertyId: string) => void;
  onSelectionChange?: (propertyId: string, selected: boolean) => void;
};

function GalleryMedia({
  images,
  badge,
  propertyId,
  isFavorite,
  selected,
  selectionEnabled,
  stacked,
  onFavoriteToggle,
  onSelectionChange,
}: Readonly<GalleryMediaProps>) {
  const imageCount = images.length;
  const hasGallery = imageCount > 1;

  const [currentIndex, setCurrentIndex] = useState(() => {
    const primaryIndex = images.findIndex((image) => image.isPrimary);
    return Math.max(primaryIndex, 0);
  });

  const safeIndex = imageCount > 0 ? Math.min(currentIndex, imageCount - 1) : 0;
  const currentImage = imageCount > 0 ? images[safeIndex] : null;

  const showPreviousImage = () =>
    setCurrentIndex((index) => (index - 1 + imageCount) % imageCount);
  const showNextImage = () =>
    setCurrentIndex((index) => (index + 1) % imageCount);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (!hasGallery || touchStart.current === null) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    if (deltaX < 0) showNextImage();
    else showPreviousImage();
  };

  const mediaClassName = stacked
    ? "relative aspect-[16/10] shrink-0 touch-pan-y overflow-hidden bg-zinc-100"
    : "relative aspect-[16/10] shrink-0 touch-pan-y overflow-hidden bg-zinc-100 md:aspect-auto md:h-full md:min-h-[280px]";

  return (
    <div
      className={mediaClassName}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <GalleryImage image={currentImage} />
      <GalleryNavigation
        visible={hasGallery}
        onPrevious={showPreviousImage}
        onNext={showNextImage}
      />
      <BadgeTag badge={badge} />
      <FavoriteButton
        isFavorite={isFavorite}
        propertyId={propertyId}
        onToggle={onFavoriteToggle}
      />
      <SelectionToggle
        enabled={selectionEnabled}
        selected={selected}
        propertyId={propertyId}
        onChange={onSelectionChange}
      />
      <GalleryDots
        images={images}
        activeIndex={safeIndex}
        onSelect={setCurrentIndex}
      />
      <GalleryLiveRegion
        visible={hasGallery}
        current={safeIndex + 1}
        total={imageCount}
      />
    </div>
  );
}

type PropertyHeaderProps = {
  propertyType: string;
  title: string;
  price: PropertyPrice;
};

function PropertyHeader({
  propertyType,
  title,
  price,
}: Readonly<PropertyHeaderProps>) {
  return (
    <>
      {propertyType !== "" ? (
        <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-rose-500">
          {propertyType}
        </span>
      ) : null}
      {title !== "" ? (
        <h3
          title={title}
          className="mt-1.5 line-clamp-2 font-sans text-[20px] font-semibold leading-tight tracking-tight text-zinc-900"
        >
          {title}
        </h3>
      ) : null}
      <p className="mt-2 text-[24px] font-bold leading-tight text-zinc-900 md:text-[28px]">
        {formatPrice(price)}
      </p>
    </>
  );
}

function PropertyFeatures({
  features,
}: Readonly<{ features: PropertyFeatures }>) {
  const areaUnit = features.totalArea.unit?.trim() || "m²";
  const bathroomLabel =
    features.bathrooms === 1 ? "baño" : "baños";
  const items = [
    {
      id: "total-area",
      label: `${formatNumber(features.totalArea.value)} ${areaUnit} total`,
    },
    { id: "rooms", label: `${formatNumber(features.rooms)} amb.` },
    { id: "bedrooms", label: `${formatNumber(features.bedrooms)} dorm.` },
    {
      id: "bathrooms",
      label: `${formatNumber(features.bathrooms)} ${bathroomLabel}`,
    },
  ];

  return (
    <ul className="mt-4 grid grid-cols-2 gap-y-2 md:flex md:items-center md:divide-x md:divide-zinc-200">
      {items.map((feature) => (
        <li
          key={feature.id}
          className="text-[13px] text-zinc-600 md:px-3 md:first:pl-0 md:last:pr-0"
        >
          {feature.label}
        </li>
      ))}
    </ul>
  );
}

function PropertyLocation({
  location,
}: Readonly<{ location: PropertyLocation }>) {
  const secondaryLocation = [
    location.neighborhood,
    location.city,
    location.country,
  ]
    .filter(Boolean)
    .join(", ");
  const hasAddress = location.address.trim() !== "";
  if (!hasAddress && secondaryLocation === "") return null;

  return (
    <div className="mt-3.5 min-w-0">
      {hasAddress ? (
        <p className="truncate text-sm font-medium text-zinc-900">
          {location.address}
        </p>
      ) : null}
      {secondaryLocation !== "" ? (
        <p className="mt-0.5 truncate text-[13px] text-zinc-500">
          {secondaryLocation}
        </p>
      ) : null}
    </div>
  );
}

function PropertyDescription({
  description,
}: Readonly<{ description: string }>) {
  if (description === "") return null;
  return (
    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-600">
      {description}
    </p>
  );
}

type PropertyFooterProps = {
  propertyId: string;
  agentName: string;
  agentLogo: string;
  agentLabel: string;
  phone: string;
  whatsappHref: string | null;
  onPhoneClick?: (propertyId: string) => void;
  onWhatsAppClick?: (propertyId: string) => void;
  onContact?: (propertyId: string) => void;
};

function PropertyFooter({
  propertyId,
  agentName,
  agentLogo,
  agentLabel,
  phone,
  whatsappHref,
  onPhoneClick,
  onWhatsAppClick,
  onContact,
}: Readonly<PropertyFooterProps>) {
  const showAgent = agentName !== "" || agentLogo !== "";
  const hasActions =
    phone !== "" || whatsappHref !== null || onContact !== undefined;
  if (!showAgent && !hasActions) return null;

  return (
    <footer className="mt-4 flex flex-col gap-3.5 border-t border-zinc-100 pt-4 md:flex-row md:items-center md:justify-between">
      {showAgent ? (
        <div className="flex min-w-0 items-center gap-3">
          {agentLogo !== "" ? (
            <Image
              src={agentLogo}
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-[13px] font-semibold text-zinc-600"
            >
              {getAgentInitials(agentName)}
            </span>
          )}
          <div className="min-w-0">
            {agentLabel !== "" ? (
              <p className="text-[11px] font-medium text-zinc-500">
                {agentLabel}
              </p>
            ) : null}
            {agentName !== "" ? (
              <p className="truncate text-sm font-semibold text-zinc-900">
                {agentName}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {phone !== "" ? (
          <a
            href={`tel:${phone}`}
            aria-label="Llamar"
            onClick={() => onPhoneClick?.(propertyId)}
            className={`inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 text-zinc-700 transition-colors hover:bg-zinc-50 ${focusVisibleClasses}`}
          >
            <PhoneIcon className="h-5 w-5" />
          </a>
        ) : null}

        {whatsappHref !== null ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onWhatsAppClick?.(propertyId)}
            className={`inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 ${focusVisibleClasses}`}
          >
            <WhatsAppIcon className="h-[18px] w-[18px]" />
            WhatsApp
          </a>
        ) : null}

        {onContact !== undefined ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            className="h-11 cursor-pointer px-6"
            onClick={() => onContact(propertyId)}
          >
            Contactar
          </Button>
        ) : null}
      </div>
    </footer>
  );
}

export const PropertyCard = memo(function PropertyCard(
  props: Readonly<PropertyCardProps>,
) {
  const {
    property,
    onFavoriteToggle,
    onContact,
    onPhoneClick,
    onWhatsAppClick,
    selected = false,
    onSelectionChange,
    stacked = false,
    contactStatus,
  } = props;

  const selectionEnabled = onSelectionChange !== undefined;
  const isSelected = selectionEnabled && selected;
  const layoutClass = stacked
    ? ""
    : "md:grid md:grid-cols-[3fr_7fr]";
  const badge = property.badge?.trim() ?? "";
  const propertyType = property.propertyType.trim();
  const title = property.title.trim();
  const description = property.description?.trim() ?? "";
  const agentName = property.agent?.name.trim() ?? "";
  const agentLogo = property.agent?.logo?.trim() ?? "";
  const agentLabel = property.agent?.label?.trim() ?? "";
  const phone = property.contact?.phone?.trim() ?? "";
  const whatsappHref = property.contact?.whatsapp
    ? toWhatsAppHref(property.contact.whatsapp)
    : null;

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-[20px] border bg-white shadow-[0_2px_10px_-6px_rgba(24,24,27,0.10)] transition-shadow duration-300 hover:shadow-[0_12px_32px_-14px_rgba(24,24,27,0.22)] ${layoutClass} ${
        isSelected ? "border-[#ff2056] ring-2 ring-[#ff2056]/20" : "border-zinc-200"
      }`}
    >
      <GalleryMedia
        images={property.images}
        badge={badge}
        propertyId={property.id}
        isFavorite={property.actions.isFavorite}
        selected={selected}
        selectionEnabled={selectionEnabled}
        stacked={stacked}
        onFavoriteToggle={onFavoriteToggle}
        onSelectionChange={onSelectionChange}
      />
      <div className="flex min-w-0 flex-1 flex-col p-5 md:p-6">
        <PropertyHeader
          propertyType={propertyType}
          title={title}
          price={property.price}
        />
        <PropertyFeatures features={property.features} />
        <PropertyLocation location={property.location} />
        <PropertyDescription description={description} />
        <PropertyFooter
          propertyId={property.id}
          agentName={agentName}
          agentLogo={agentLogo}
          agentLabel={agentLabel}
          phone={phone}
          whatsappHref={whatsappHref}
          onPhoneClick={onPhoneClick}
          onWhatsAppClick={onWhatsAppClick}
          onContact={onContact}
        />
      </div>
      {contactStatus !== undefined ? (
        <div className="flex items-center justify-center gap-2 bg-zinc-900 px-4 py-2.5 md:col-span-2">
          <span className="text-[13px] font-semibold tracking-wide text-white">
            {CONTACT_STATUS_LABELS[contactStatus]}
          </span>
        </div>
      ) : null}
    </article>
  );
});
