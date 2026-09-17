import type { Property } from "@/domain/property";
import type { DocProp } from "@/components/test/props-table";

export const PROPERTY_CARD_PROPS: readonly DocProp[] = [
  {
    name: "property",
    required: true,
    description:
      "Objeto Property con todos los datos del inmueble (precio, ubicación, features, imágenes, agente, contacto, acciones). Fuente única de verdad: la card no contiene datos propios.",
  },
  {
    name: "onFavoriteToggle?",
    description:
      "Se dispara al tocar el corazón con el id de la propiedad. El estado visual del favorito lo controla el padre (property.actions.isFavorite).",
  },
  {
    name: "onContact?",
    description:
      "Se dispara al presionar 'Contactar'. Solo se renderiza el botón si este callback existe.",
  },
  {
    name: "onPhoneClick?",
    description:
      "Se dispara al tocar el botón de teléfono (además del enlace tel: nativo). Solo aparece si property.contact.phone existe.",
  },
  {
    name: "onWhatsAppClick?",
    description:
      "Se dispara al tocar el botón de WhatsApp (además del enlace wa.me nativo). Solo aparece si property.contact.whatsapp existe.",
  },
  {
    name: "selected?",
    description:
      "Activa el modo selección: renderiza el checkbox sobre la imagen y resalta la card cuando está seleccionada.",
  },
  {
    name: "onSelectionChange?",
    description:
      "Se dispara al alternar el checkbox de selección con (propertyId, selected). La presencia de este callback habilita el modo selección.",
  },
  {
    name: "stacked?",
    description:
      "Fuerza el layout vertical (imagen arriba) en desktop para grillas densas de cards; por defecto la card es horizontal (30/70).",
  },
  {
    name: "contactStatus?",
    description:
      "Franja inferior oscura integrada al radio de la card. Opciones: 'contactado', 'leido', 'en-proceso' o 'completado'. Si no se pasa, la franja no se renderiza.",
  },
];

export const DEMO_PROPERTIES: readonly Property[] = [
  {
    id: "demo-1",
    status: "available",
    badge: "Encargado",
    propertyType: "Departamento",
    title: "Departamento 3 ambientes con balcón en Villa Crespo",
    price: { amount: 189000, currency: "USD" },
    location: {
      address: "Av. Corrientes 4700",
      neighborhood: "Villa Crespo",
      city: "Capital Federal",
      country: "Argentina",
    },
    features: {
      totalArea: { value: 87, unit: "m²" },
      rooms: 3,
      bedrooms: 2,
      bathrooms: 2,
    },
    description:
      "Departamento luminoso a estrenar en pleno corazón de Villa Crespo. Living amplio con balcón corrido, cocina integrada con isla y dos dormitorios con placares a medida. A metros de la estación Malabia y de los bares de la avenida Corrientes.",
    images: [
      {
        id: "demo-1-img-1",
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70",
        alt: "Living luminoso",
        isPrimary: true,
      },
      {
        id: "demo-1-img-2",
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70",
        alt: "Cocina integrada",
      },
      {
        id: "demo-1-img-3",
        url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=70",
        alt: "Dormitorio principal",
      },
    ],
    agent: {
      name: "Marta Rossi",
      phone: "+54 11 4824 0900",
      label: "Super destacado",
    },
    contact: {
      phone: "+54 11 4824 0900",
      whatsapp: "+54 9 11 4824 0900",
    },
    actions: { isFavorite: false },
  },
  {
    id: "demo-2",
    status: "rented",
    propertyType: "Casa",
    title: "Casa con jardín en Palermo Soho",
    price: { amount: 1150000, currency: "ARS" },
    location: {
      address: "Gorriti 5120",
      neighborhood: "Palermo Soho",
      city: "Capital Federal",
      country: "Argentina",
    },
    features: {
      totalArea: { value: 210, unit: "m²" },
      rooms: 5,
      bedrooms: 3,
      bathrooms: 2,
    },
    description:
      "Casa de estilo clásico sobre línea municipal con jardín propio en una de las cuadras más verdes de Palermo Soho. Living con ventanales al frente, comedor diario, cocina con office, tres dormitorios con placares y jardín con parrilla a mitad de cuadra de los bares de Serrano.",
    images: [
      {
        id: "demo-2-img-1",
        url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70",
        alt: "Fachada de casa",
      },
      {
        id: "demo-2-img-2",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70",
        alt: "Patio interno",
      },
    ],
    contact: { phone: "+54 11 4772 3300" },
    actions: { isFavorite: true },
  },
  {
    id: "demo-3",
    status: "sold",
    badge: "Vendido",
    propertyType: "PH",
    title: "PH reciclado a estrenar en San Telmo",
    price: { amount: 320000, currency: "EUR" },
    location: {
      address: "Defensa 1175",
      neighborhood: "San Telmo",
      city: "Capital Federal",
      country: "Argentina",
    },
    features: {
      totalArea: { value: 120, unit: "m²" },
      rooms: 4,
      bedrooms: 3,
      bathrooms: 2,
    },
    description:
      "PH de estilo reciclado íntegramente, conservando la fachada original de ladrillo a la vista y las aberturas de madera restauradas. Cuenta con living de doble altura, cocina con desayunador, tres dormitorios con placares y un patio interno con parrilla. La planta alta se destina a un estudio independiente con acceso propio. Se entrega amoblado con muebles de diseño a medida y equipamiento de línea completa. A pasos de la Plaza Dorrego, ideal para quienes buscan un hogar con carácter en el casco histórico.",
    images: [],
    agent: {
      name: "Hallo Inmobiliaria",
      phone: "+54 11 4300 1122",
      logo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=160&q=70",
      label: "Inmobiliaria",
    },
    contact: { phone: "+54 11 4300 1122", email: "hola@hallo.com.ar" },
    actions: { isFavorite: false },
  },
  {
    id: "demo-4",
    status: "available",
    propertyType: "Loft",
    title: "Loft industrial a estrenar en Puerto Madero",
    price: { amount: 1450, currency: "USD" },
    location: {
      address: "Aimé Painé 1180",
      neighborhood: "Puerto Madero",
      city: "Capital Federal",
      country: "Argentina",
    },
    features: {
      totalArea: { value: 64, unit: "m²" },
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
    },
    description:
      "Loft de doble altura con vista al río, carpintería en hierro y pisos de hormigón pulido. Cochera y amenities de primer nivel.",
    images: [
      {
        id: "demo-4-img-1",
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=70",
        alt: "Living de loft con doble altura",
        isPrimary: true,
      },
      {
        id: "demo-4-img-2",
        url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=70",
        alt: "Vista nocturna de Puerto Madero",
      },
    ],
    agent: {
      name: "Hallo Inmobiliaria",
      phone: "+54 11 4315 9900",
      label: "Super destacado",
    },
    contact: {
      phone: "+54 11 4315 9900",
      whatsapp: "+54 9 11 4315 9900",
      email: "hola@hallo.com.ar",
    },
    actions: { isFavorite: false },
  },
  {
    id: "demo-5",
    status: "available",
    propertyType: "Departamento",
    title: "Departamento con terraza en Recoleta",
    price: { amount: 275000, currency: "USD" },
    location: {
      address: "Av. Alvear 1892",
      neighborhood: "Recoleta",
      city: "Capital Federal",
      country: "Argentina",
    },
    features: {
      totalArea: { value: 70, unit: "m²" },
      rooms: 2,
      bedrooms: 1,
      bathrooms: 1,
    },
    description:
      "Departamento de dos ambientes con terraza propia a pasos de la Plaza Francia. Aberturas de piso a techo, placares y cocina equipada.",
    images: [
      {
        id: "demo-5-img-1",
        url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=70",
        alt: "Living con ventanales",
        isPrimary: true,
      },
      {
        id: "demo-5-img-2",
        url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=70",
        alt: "Terraza al aire libre",
      },
    ],
    contact: { phone: "+54 11 4803 2211" },
    actions: { isFavorite: false },
  },
  {
    id: "demo-6",
    status: "available",
    propertyType: "Casa",
    title: "Casa de fin de semana en Nordelta",
    price: { amount: 420000, currency: "EUR" },
    location: {
      address: "Lagos del Golf 980",
      neighborhood: "Nordelta",
      city: "Tigre",
      country: "Argentina",
    },
    features: {
      totalArea: { value: 310, unit: "m²" },
      rooms: 6,
      bedrooms: 4,
      bathrooms: 3,
    },
    description:
      "Casa sobre el lago con muelle propio, parque parquizado y quincho. Planta baja integrada y tres suites en el primer piso.",
    images: [
      {
        id: "demo-6-img-1",
        url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=70",
        alt: "Casa frente al lago",
        isPrimary: true,
      },
      {
        id: "demo-6-img-2",
        url: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=70",
        alt: "Quincho con parrilla",
      },
    ],
    agent: {
      name: "Marta Rossi",
      phone: "+54 11 4824 0900",
      label: "Super destacado",
    },
    contact: {
      phone: "+54 11 4824 0900",
      whatsapp: "+54 9 11 4824 0900",
    },
    actions: { isFavorite: false },
  },
  {
    id: "demo-7",
    status: "available",
    propertyType: "Departamento",
    title: "Monoambiente luminoso en Caballito",
    price: { amount: 95000, currency: "USD" },
    location: {
      address: "Av. Rivadavia 5200",
      neighborhood: "Caballito",
      city: "Capital Federal",
      country: "Argentina",
    },
    features: {
      totalArea: { value: 32, unit: "m²" },
      rooms: 1,
      bedrooms: 0,
      bathrooms: 1,
    },
    description:
      "Monoambiente con balcón francés a media cuadra del subte A. Ideal como primer hogar o inversión, con amenities en la azotea.",
    images: [
      {
        id: "demo-7-img-1",
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70",
        alt: "Monoambiente integrado",
        isPrimary: true,
      },
    ],
    contact: { phone: "+54 11 4901 3344" },
    actions: { isFavorite: false },
  },
  {
    id: "demo-8",
    status: "rented",
    badge: "Encargado",
    propertyType: "Casa",
    title: "Casa quinta con piscina en San Isidro",
    price: { amount: 690000, currency: "USD" },
    location: {
      address: "Av. del Libertador 16100",
      neighborhood: "Martínez",
      city: "San Isidro",
      country: "Argentina",
    },
    features: {
      totalArea: { value: 380, unit: "m²" },
      rooms: 7,
      bedrooms: 5,
      bathrooms: 4,
    },
    description:
      "Quinta clásica rodeada de árboles con piscina, cancha de paddle y casa de huéspedes. A diez minutos de la estación Martínez.",
    images: [
      {
        id: "demo-8-img-1",
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70",
        alt: "Fachada con jardín",
        isPrimary: true,
      },
      {
        id: "demo-8-img-2",
        url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=70",
        alt: "Piscina y parque",
      },
    ],
    agent: {
      name: "Hallo Inmobiliaria",
      phone: "+54 11 4732 5566",
      label: "Inmobiliaria",
    },
    contact: { phone: "+54 11 4732 5566", email: "hola@hallo.com.ar" },
    actions: { isFavorite: false },
  },
];
