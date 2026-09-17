import Link from "next/link";
import type { NavItem } from "@/domain/navigation";

type Variant = "horizontal" | "vertical";

const containerClasses: Record<Variant, string> = {
  horizontal: "flex items-center gap-1.5",
  vertical: "flex flex-col gap-1",
};

const linkClasses: Record<Variant, string> = {
  horizontal:
    "rounded-full px-3.5 py-2.5 text-[14.5px] font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900",
  vertical:
    "rounded-full px-3.5 py-3 text-[15px] font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900",
};

type NavLinksProps = {
  items: readonly NavItem[];
  variant?: Variant;
  ariaLabel?: string;
  className?: string;
  onNavigate?: () => void;
};

export function NavLinks({
  items,
  variant = "horizontal",
  ariaLabel = "Principal",
  className = "",
  onNavigate,
}: NavLinksProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label={ariaLabel}
      className={`${containerClasses[variant]} ${className}`.trim()}
    >
      {items.map((item) => (
        <Link
          key={`${item.href}-${item.label}`}
          href={item.href}
          onClick={onNavigate}
          {...(item.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={linkClasses[variant]}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
