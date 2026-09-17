import type { Property, PropertyContactStatus } from "@/domain/property";

export type PropertyCardProps = {
  property: Property;
  onFavoriteToggle?: (propertyId: string) => void;
  onContact?: (propertyId: string) => void;
  onPhoneClick?: (propertyId: string) => void;
  onWhatsAppClick?: (propertyId: string) => void;
  selected?: boolean;
  onSelectionChange?: (propertyId: string, selected: boolean) => void;
  stacked?: boolean;
  contactStatus?: PropertyContactStatus;
};
