"use client";

import { useEffect, useId, useRef, useState } from "react";
import { InfoIcon } from "@/components/ui/icons/info";
import type { InfoTooltipProps } from "./InfoTooltip.types";

export function InfoTooltip({
  content,
  label = "Más información",
  placement = "right",
  className,
}: Readonly<InfoTooltipProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <span ref={wrapperRef} className={`relative inline-flex ${className ?? ""}`}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => {
          setIsOpen((current) => !current);
        }}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 transition-colors hover:text-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
      >
        <InfoIcon className="h-4 w-4" />
      </button>
      <div
        id={panelId}
        role="tooltip"
        hidden={!isOpen}
        className={`absolute top-full z-20 mt-2 w-64 rounded-xl border border-zinc-200 bg-white p-3 text-xs leading-relaxed text-zinc-600 shadow-[0_20px_50px_-20px_rgba(24,24,27,0.30)] ${
          placement === "left" ? "right-0" : "left-0"
        }`}
      >
        {content}
      </div>
    </span>
  );
}
