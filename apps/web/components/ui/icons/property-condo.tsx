import type { SVGProps } from "react";

export function PropertyCondoIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="7" y="2.5" width="10" height="19" rx="1.5" />
      <path d="M9.5 5.5h1.5M13 5.5h1.5M9.5 9h1.5M13 9h1.5M9.5 12.5h1.5M13 12.5h1.5M9.5 16h1.5M13 16h1.5" />
      <path d="M11 21.5v-2.5h2v2.5" />
    </svg>
  );
}
