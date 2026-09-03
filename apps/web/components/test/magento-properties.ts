import type { Property, PropertyStatus } from "@/components/PropertyCard/PropertyCard.types";
import magentoMock from "@/data/mock-properties.json";

export type MagentoPropertyItem = {
  id: string;
  name: string;
  status: PropertyStatus;
  property_type: string;
  price: number;
  address: string;
  neighborhood: string;
  city: string;
  country: string;
  area_m2: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  description?: string;
  images: { url: string; alt: string; is_primary: boolean }[];
  agent?: { name: string; phone: string };
  contact?: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  coordinates: { lat: number; lng: number };
  rent_special?: boolean;
  price_reduced?: boolean;
  builder_promotion?: boolean;
  pets_allowed?: boolean;
  parking_included?: boolean;
  in_unit_laundry?: boolean;
  furnished?: boolean;
  available_from?: string | null;
  listed_at: string;
};

export type MagentoPropertyResponse = {
  store_code: string;
  search_criteria: { page_size: number; current_page: number };
  total_count: number;
  items: MagentoPropertyItem[];
};

const response = magentoMock as MagentoPropertyResponse;

export function getMockPropertyItems(): MagentoPropertyItem[] {
  return response.items;
}

export function toProperty(item: MagentoPropertyItem): Property {
  return {
    id: item.id,
    status: item.status,
    propertyType: item.property_type,
    title: item.name,
    price: { amount: item.price, currency: "USD" },
    location: {
      address: item.address,
      neighborhood: item.neighborhood,
      city: item.city,
      country: item.country,
    },
    features: {
      totalArea: { value: item.area_m2, unit: "m²" },
      rooms: item.rooms,
      bedrooms: item.bedrooms,
      bathrooms: item.bathrooms,
    },
    description: item.description,
    images: item.images.map((image, index) => ({
      id: `${item.id}-img-${index + 1}`,
      url: image.url,
      alt: image.alt,
      isPrimary: image.is_primary,
    })),
    agent: item.agent
      ? { name: item.agent.name, phone: item.agent.phone }
      : undefined,
    contact: item.contact
      ? {
          phone: item.contact.phone,
          whatsapp: item.contact.whatsapp,
          email: item.contact.email,
        }
      : undefined,
    actions: { isFavorite: false },
  };
}
