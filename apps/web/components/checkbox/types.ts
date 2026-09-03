import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
} from "react";

export type CheckboxImagePropTypes = {
  checked?: boolean;
  disabled?: boolean;
  labelHtmlFor?: string;
  checkIcon?: ReactNode;
} & LabelHTMLAttributes<HTMLLabelElement>;

export type CheckboxAtomPropTypes = {
  defaultChecked?: boolean;
  containerProps?: LabelHTMLAttributes<HTMLLabelElement>;
  checkIcon?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export type CheckboxPropTypes = {
  label?: string;
  description?: ReactNode | ReactNode[];
} & CheckboxAtomPropTypes;

export type CheckboxControlPropTypes = {
  containerProps?: LabelHTMLAttributes<HTMLLabelElement>;
  checkIcon?: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;
