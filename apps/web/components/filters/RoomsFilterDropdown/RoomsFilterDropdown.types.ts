export type RoomsSelection = {
  bedrooms: string[];
  bathrooms: string[];
};

export type RoomsFilterDropdownProps = {
  label?: string;
  selectedBedrooms: string[];
  selectedBathrooms: string[];
  onChange: (selection: RoomsSelection) => void;
  onDone: () => void;
};

export type SegmentedGroupProps = {
  groupLabel: string;
  options: readonly string[];
  selected: readonly string[];
  onSelect: (option: string) => void;
};
