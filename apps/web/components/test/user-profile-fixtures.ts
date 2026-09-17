import type { DocProp } from "@/components/test/props-table";

export const AVATAR_PROPS: readonly DocProp[] = [
  {
    name: "name?",
    description:
      "Nombre de la persona. Genera las iniciales del fallback (máx. 2, de las palabras del nombre) y el alt por defecto de la imagen. Sin nombre se renderiza una silueta.",
  },
  {
    name: "avatarUrl?",
    description:
      "URL de la foto. Usa un img plano (apto para URLs remotas arbitrarias). Si la carga falla cae a iniciales; al cambiar la URL reintenta la imagen.",
  },
  {
    name: "size?",
    description:
      "xs (24px) | sm (32px) | md (48px) | lg (72px) | xl (96px). Default: md. Diámetro y tipografía de iniciales con clases estáticas por tamaño.",
  },
  {
    name: "tone?",
    description:
      "rose (bg-brand-500, texto blanco) | dark (neutral-900) | light (blanco con borde) | muted (neutral-200). Default: rose. Solo aplica al fallback.",
  },
  {
    name: "alt?",
    description:
      "Texto alternativo; default: el nombre. alt='' marca el avatar como decorativo (aria-hidden): usalo cuando el nombre ya está visible al lado, como en UserProfileCard.",
  },
  {
    name: "className?",
    description:
      "Clases extra sobre el círculo. Permiten sobrescribir el diámetro (ej: h-20 w-20) porque se agregan al final.",
  },
];

export const USER_PROFILE_CARD_PROPS: readonly DocProp[] = [
  {
    name: "data?",
    description:
      "UserProfileData (id, name, phone, email, avatarUrl?) o null. Sin datos y sin carga se muestra el estado vacío informativo. Default: null. Los adapters supabaseProfileToUserData y magentoCustomerToUserData (en domain/user-profile.ts) convierten filas reales a este modelo.",
  },
  {
    name: "title?",
    description: "Título del header. Default: 'Tus datos'.",
  },
  {
    name: "description?",
    description:
      "Subtítulo del header. Sin valor (o vacío) no se renderiza ninguna línea.",
  },
  {
    name: "onEdit?",
    description:
      "Callback que recibe el objeto data completo al presionar 'Editar datos'. Sin callback el footer con el botón no se renderiza (degradación elegante).",
  },
  {
    name: "isLoading?",
    description:
      "Muestra el skeleton (círculo + líneas con animate-pulse) con la misma silueta de card y aria-busy. La card no expone controles mientras carga. Default: false.",
  },
  {
    name: "className?",
    description: "Clases extra sobre la card (ancho, márgenes, etc.).",
  },
];

export const USER_PROFILE_CARD_USAGE = `<UserProfileCard
  data={supabaseProfileToUserData(profileRow)}
  description="Tus datos desde Supabase"
  onEdit={(data) => saveProfile(data)}
/>`;
