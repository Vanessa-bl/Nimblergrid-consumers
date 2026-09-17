import {
  forwardRef,
  useEffect,
  useState,
  useId,
  type ChangeEvent,
} from "react";
import type { CheckboxAtomPropTypes } from "../types";
import { CheckboxImage } from "./CheckboxImage";
import styles from "../checkbox.module.css";

export const CheckboxAtom = forwardRef<
  HTMLInputElement,
  CheckboxAtomPropTypes
>(function CheckboxAtom(
  {
    defaultChecked = false,
    onChange,
    checked,
    disabled = false,
    id,
    className,
    containerProps,
    checkIcon,
    ...props
  }: Readonly<CheckboxAtomPropTypes>,
  ref,
) {
  const defaultId = useId();
  const resolvedId = id ?? defaultId;
  const [innerChecked, setInnerChecked] = useState(defaultChecked);

  useEffect(() => {
    if (checked !== undefined && checked !== innerChecked) {
      setInnerChecked(checked);
    }
  }, [checked, innerChecked]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (checked === undefined) {
      setInnerChecked(event.target.checked);
    }
    onChange?.(event);
  };

  const isChecked = checked ?? innerChecked;
  const imageClassName = [containerProps?.className, className]
    .filter(Boolean)
    .join(" ");

  return (
    <CheckboxImage
      {...containerProps}
      className={imageClassName}
      checked={isChecked}
      disabled={disabled}
      labelHtmlFor={resolvedId}
      checkIcon={checkIcon}
    >
      <input
        {...props}
        id={resolvedId}
        ref={ref}
        type="checkbox"
        className={styles.checkbox__input}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
      />
    </CheckboxImage>
  );
});

CheckboxAtom.displayName = "CheckboxAtom";
