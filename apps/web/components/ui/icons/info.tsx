import type { SVGProps } from "react";

export function InfoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path
        d="M9.6 9.4a2.4 2.4 0 1 1 3.4 2.2c-.7.3-1 .9-1 1.6v.4"
        strokeLinecap="round"
      />
      <path d="M12 16.9h.01" strokeLinecap="round" strokeWidth={2.4} />
    </svg>
  );
}
