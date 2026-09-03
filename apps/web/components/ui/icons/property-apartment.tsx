import type { SVGProps } from "react";

export function PropertyApartmentIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="5.5" y="3.5" width="13" height="17" rx="1.5" />
      <path d="M9.5 7.5h1M13.5 7.5h1M9.5 11h1M13.5 11h1M9.5 14.5h1M13.5 14.5h1" />
      <path d="M10.5 20.5v-2.5h3v2.5" />
    </svg>
  );
}
