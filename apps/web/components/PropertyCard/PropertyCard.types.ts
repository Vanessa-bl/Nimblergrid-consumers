export type Currency = "USD" | "ARS" | "EUR";

export type PropertyStatus = "available" | "reserved" | "sold" | "rented";

export type PropertyImage = {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
};

export type PropertyPrice = {
  amount: number;
  currency: Currency;
};

export type PropertyLocation = {
  address: string;
  neighborhood: string;
  city: string;
  country: string;
};

export type PropertyFeatures = {
  totalArea: { value: number; unit?: string };
  rooms: number;
  bedrooms: number;
  bathrooms: number;
};

export type PropertyAgent = {
  name: string;
  phone: string;
  logo?: string;
  label?: string;
};

export type PropertyContact = {
  phone?: string;
  whatsapp?: string;
  email?: string;
};

export type PropertyActions = {
  isFavorite: boolean;
};

export type PropertyContactStatus = "contactado" | "leido" | "en-proceso" | "completado";

export type Property = {
  id: string;
  status: PropertyStatus;
  badge?: string;
  propertyType: string;
  title: string;
  price: PropertyPrice;
  location: PropertyLocation;
  features: PropertyFeatures;
  description?: string;
  images: PropertyImage[];
  agent?: PropertyAgent;
  contact?: PropertyContact;
  actions: PropertyActions;
};

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
