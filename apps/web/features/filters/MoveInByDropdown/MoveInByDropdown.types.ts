export type MoveInByDropdownProps = {
  label?: string;
  selectedDate: string | null;
  onDateChange: (date: string | null) => void;
  onDone: () => void;
};
