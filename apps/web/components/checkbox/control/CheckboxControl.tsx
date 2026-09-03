import {
  forwardRef,
  useEffect,
  useState,
  useId,
  type ChangeEvent,
} from "react";
import type { CheckboxControlPropTypes } from "../types";
import { DefaultCheckIcon } from "../atom/CheckboxImage";
import styles from "../checkbox.module.css";

export const CheckboxControl = forwardRef<
  HTMLInputElement,
  CheckboxControlPropTypes
>(function CheckboxControl(
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
  }: Readonly<CheckboxControlPropTypes>,
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
  const cellClassName = [
    styles.checkbox,
    isChecked && styles.checked,
    disabled && styles.disabled,
    containerProps?.className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label
      {...containerProps}
      htmlFor={resolvedId}
      className={cellClassName}
    >
      <span className={styles.checkbox__area}>
        <span className={styles.checkbox__area__box}>
          {isChecked ? (
            <span className={styles.checkbox__area__box__icon}>
              {checkIcon ?? <DefaultCheckIcon />}
            </span>
          ) : null}
        </span>
      </span>
      <input
        {...props}
        id={resolvedId}
        ref={ref}
        type="checkbox"
        className={[styles.checkbox__input, className]
          .filter(Boolean)
          .join(" ")}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
      />
    </label>
  );
});

CheckboxControl.displayName = "CheckboxControl";
