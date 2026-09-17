export type PropertySearchBarProps = {
  placeholder?: string;
  value: string;
  onValueChange: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
};
