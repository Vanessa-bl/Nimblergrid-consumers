import type { ReactNode } from "react";
import type { CheckboxImagePropTypes } from "../types";
import styles from "../checkbox.module.css";

export function DefaultCheckIcon() {
  return (
    <svg
      viewBox="0 0 12 12"
      width="12"
      height="12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 6.5 5 9l4.5-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckboxImage({
  checked = false,
  disabled = false,
  labelHtmlFor,
  checkIcon,
  className,
  children,
  ...rest
}: Readonly<CheckboxImagePropTypes & { children?: ReactNode }>) {
  const cellClassName = [
    styles.checkbox,
    checked && styles.checked,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label htmlFor={labelHtmlFor} className={cellClassName} {...rest}>
      <span className={styles.checkbox__area}>
        <span className={styles.checkbox__area__box}>
          {checked ? (
            <span className={styles.checkbox__area__box__icon}>
              {checkIcon ?? <DefaultCheckIcon />}
            </span>
          ) : null}
        </span>
      </span>
      {children}
    </label>
  );
}
