import type { RefObject } from "react";

export type FilterChipButtonProps = {
  label: string;
  isOpen?: boolean;
  hasValue?: boolean;
  hasIcon?: boolean;
  selected?: boolean;
  buttonRef?: RefObject<HTMLButtonElement | null>;
  onClick?: () => void;
};
