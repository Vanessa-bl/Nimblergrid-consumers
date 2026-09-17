import type { InputHTMLAttributes } from "react";

export type DatePickerProps = {
  value: string | null;
  onChange: (value: string | null) => void;
  id?: string;
  min?: string;
  max?: string;
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type" | "id">;

export function DatePicker(props: Readonly<DatePickerProps>) {
  const { value, onChange, id, min, max, className, ...rest } = props;
  return (
    <input
      {...rest}
      id={id}
      type="date"
      min={min}
      max={max}
      value={value ?? ""}
      onChange={(event) => {
        const nextValue = event.target.value;
        onChange(nextValue === "" ? null : nextValue);
      }}
      className={`h-11 w-full cursor-pointer rounded-xl border border-neutral-300 bg-white px-3 text-sm text-neutral-900 outline-none transition-colors hover:border-neutral-400 focus:border-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
        className ?? ""
      }`}
    />
  );
}
