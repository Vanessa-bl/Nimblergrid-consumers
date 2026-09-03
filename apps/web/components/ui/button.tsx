import Link, { type LinkProps } from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "dark" | "outline-dark" | "outline-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all";

const variantClasses: Record<Variant, string> = {
  primary: "bg-rose-500 text-white hover:brightness-95 hover:-translate-y-px",
  dark: "bg-zinc-900 text-white hover:brightness-110 hover:-translate-y-px",
  "outline-dark":
    "border-[1.5px] border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white",
  "outline-light":
    "border-[1.5px] border-white/50 text-white hover:bg-white hover:text-zinc-900",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-2.5 text-[14.5px]",
  lg: "px-7 py-4 text-[15.5px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type LinkVariant = Omit<LinkProps, "className"> & { href: LinkProps["href"] };
type ButtonVariant = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  href?: undefined;
};

export type ButtonProps = CommonProps & (LinkVariant | ButtonVariant);

export const Button = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) => {
  const cls = [base, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(" ");

  if ("href" in rest && rest.href !== undefined) {
    return (
      <Link className={cls} {...(rest as LinkVariant)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cls} {...(rest as ButtonVariant)}>
      {children}
    </button>
  );
};
