export type PropertyTypeDropdownProps = {
  label?: string;
  selectedTypes: string[];
  totalResults: number;
  onApply: (types: string[]) => void;
  onClear: () => void;
};
