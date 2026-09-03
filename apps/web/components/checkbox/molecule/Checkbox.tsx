import {
  forwardRef,
  useEffect,
  useState,
  useId,
  type ChangeEvent,
} from "react";
import type { CheckboxPropTypes } from "../types";
import { CheckboxAtom } from "../atom/CheckboxAtom";
import styles from "../checkbox.module.css";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxPropTypes>(
  function Checkbox(
    {
      label = "",
      description,
      checked,
      defaultChecked = false,
      disabled = false,
      id,
      onChange,
      className,
      containerProps,
      checkIcon,
      ...props
    }: Readonly<CheckboxPropTypes>,
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
    const hasLabel = label.trim() !== "";
    const hasDescription =
      description !== undefined &&
      description !== null &&
      !(Array.isArray(description) && description.length === 0);
    const showText = hasLabel || hasDescription;

    const wrapperClassName = [
      styles.checkbox__component,
      disabled && styles.disabled,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClassName}>
        <span className={styles.leftContent}>
          <CheckboxAtom
            {...props}
            ref={ref}
            checked={isChecked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            id={resolvedId}
            onChange={handleChange}
            className={className}
            containerProps={containerProps}
            checkIcon={checkIcon}
          />
        </span>
        {showText ? (
          <label htmlFor={resolvedId} className={styles.checkbox__content}>
            {hasLabel ? (
              <span className={styles.checkbox__title}>{label}</span>
            ) : null}
            {hasDescription ? (
              <p className={styles.checkbox__description}>{description}</p>
            ) : null}
          </label>
        ) : null}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
