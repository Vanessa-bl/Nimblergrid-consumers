import type { SVGProps } from "react";

export function PropertyTownhomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="m4 12 8-7 8 7" />
      <rect x="5.5" y="11.5" width="6" height="9" rx="1" />
      <rect x="12.5" y="11.5" width="6" height="9" rx="1" />
      <path d="M8.5 20.5v-3.5h1M14.5 20.5v-3.5h1" />
    </svg>
  );
}
