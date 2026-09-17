import Link from "next/link";

export function LogoWordmark({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Nimblergrid"
      className={`flex flex-none items-center ${className}`.trim()}
    >
      <span className="font-sans text-[26px] font-bold leading-none text-neutral-900 sm:text-[30px]">
        Nimblergrid
      </span>
    </Link>
  );
}
