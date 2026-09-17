import type { DocProp } from "@/components/test/props-table";
import type { PillOption } from "@/components/ui/form/PillSelect/PillSelect.types";

export const TEXT_FIELD_PROPS: readonly DocProp[] = [
  {
    name: "label?",
    description: "Texto visible arriba del campo. Sin label no se renderiza.",
  },
  {
    name: "required?",
    description:
      "Agrega asterisco rojo + sr-only '(obligatorio)' y aria-required al input.",
  },
  {
    name: "error?",
    description:
      "Mensaje de error: borde brand-500, texto brand-600 y aria-invalid. Si hay helper, lo reemplaza.",
  },
  {
    name: "helper?",
    description: "Texto de ayuda debajo del campo en neutral-500.",
  },
  {
    name: "startAdornment?",
    description:
      "Contenido decorativo fijo a la izquierda (ej: '$'). No es interactivo.",
  },
  {
    name: "endAdornment?",
    description: "Contenido decorativo fijo a la derecha (ej: '/year').",
  },
  {
    name: "className?",
    description: "Clases extra para el contenedor del campo.",
  },
  {
    name: "…props de input nativo",
    description:
      "value, onChange, placeholder, disabled, readOnly, id, name, aria-* y demás InputHTMLAttributes se propagan al input. El estilo readOnly es propio (bg-neutral-50, texto neutral-600, sigue siendo enfocable).",
  },
];

export const CURRENCY_INPUT_PROPS: readonly DocProp[] = [
  {
    name: "value",
    required: true,
    description:
      "Valor controlado SIEMPRE en dígitos planos ('90000'), nunca formateado.",
  },
  {
    name: "onValueChange",
    required: true,
    description: "Emite solo dígitos planos, sin separadores ni símbolos.",
  },
  {
    name: "prefix?",
    description: "Símbolo izquierdo (default '$').",
  },
  {
    name: "suffix?",
    description: "Unidad derecha (ej: '/year').",
  },
  {
    name: "label? / required?",
    description: "Mismos contratos que TextField (asterisco + aria-required).",
  },
  {
    name: "error? / helper?",
    description: "Mismos contratos que TextField (borde brand-500 y aria-invalid).",
  },
  {
    name: "disabled? / readOnly?",
    description:
      "disabled bloquea todo; readOnly muestra el valor ya formateado sin permitir edición.",
  },
];

export const PILL_SELECT_PROPS: readonly DocProp[] = [
  {
    name: "options",
    required: true,
    description:
      "Opciones { value, label, disabled? }. Los values deben ser únicos.",
  },
  {
    name: "value",
    required: true,
    description: "Value seleccionado o null si no hay selección. Controlado por el padre.",
  },
  {
    name: "onChange",
    required: true,
    description: "Se dispara al elegir (click o flechas) con el value de la opción.",
  },
  {
    name: "label?",
    description: "Título visible del grupo, asociado con aria-labelledby.",
  },
  {
    name: "name?",
    description: "Name del grupo de radios. Si no viene, se genera uno único.",
  },
  {
    name: "required?",
    description: "Asterisco + aria-required en el radiogroup.",
  },
  {
    name: "disabled?",
    description: "Deshabilita todo el grupo.",
  },
  {
    name: "error? / helper?",
    description:
      "Mensaje debajo del grupo con los mismos contratos de TextField.",
  },
  {
    name: "className?",
    description: "Clases extra para el contenedor del grupo.",
  },
];

export const INFO_TOOLTIP_PROPS: readonly DocProp[] = [
  {
    name: "content",
    required: true,
    description: "Contenido del tooltip (texto o ReactNode).",
  },
  {
    name: "label?",
    description: "aria-label del botón (default 'Más información').",
  },
  {
    name: "placement?",
    description:
      "Hacia qué lado abre el panel: 'right' (default) o 'left'.",
  },
  {
    name: "className?",
    description: "Clases extra para el wrapper del botón.",
  },
];

export const HOUSEHOLD_OPTIONS: readonly PillOption[] = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "4", label: "4+" },
];

export const PETS_OPTIONS: readonly PillOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export const CREDIT_OPTIONS: readonly PillOption[] = [
  { value: "600-649", label: "600–649" },
  { value: "650-699", label: "650–699" },
  { value: "700-749", label: "700–749" },
  { value: "750+", label: "750+" },
];

export const LEASE_OPTIONS: readonly PillOption[] = [
  { value: "12", label: "12 months" },
  { value: "24", label: "24 months" },
  { value: "36", label: "36 months" },
];
