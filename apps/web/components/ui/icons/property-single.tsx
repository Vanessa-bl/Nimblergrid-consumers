import type { SVGProps } from "react";

export function PropertySingleIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="m3.5 11.5 8.5-7 8.5 7" />
      <path d="M6 10.5V21h12V10.5" />
      <path d="M10 21v-5.5h4V21" />
    </svg>
  );
}
