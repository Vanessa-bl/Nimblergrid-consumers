import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "dark" | "outline-dark" | "outline-light";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all";

const variantClasses: Record<Variant, string> = {
  primary: "bg-brand-500 text-white hover:brightness-95 hover:-translate-y-px",
  dark: "bg-neutral-900 text-white hover:brightness-110 hover:-translate-y-px",
  "outline-dark":
    "border-[1.5px] border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white",
  "outline-light":
    "border-[1.5px] border-white/50 text-white hover:bg-white hover:text-neutral-900",
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

/**
 * `external`: renderea <a> plano en vez de <Link> de next/link.
 * Uso: rutas que redirigen cross-origin (auth, downloads) — evita el prefetch
 * de Next que revienta con "Failed to fetch" sobre redirects a otros dominios.
 */
type LinkVariant = Omit<LinkProps, "className"> & {
  href: LinkProps["href"];
  external?: false;
};

type ExternalAnchorVariant = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> & {
  href: string;
  external: true;
};

type ButtonVariant = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  href?: undefined;
  external?: undefined;
};

export type ButtonProps = CommonProps & (LinkVariant | ExternalAnchorVariant | ButtonVariant);

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
    if ("external" in rest && rest.external) {
      const { external: _external, ...anchorRest } = rest;
      return (
        <a className={cls} {...(anchorRest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
          {children}
        </a>
      );
    }
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
