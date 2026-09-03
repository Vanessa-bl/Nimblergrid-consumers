"use client";

import { useState, useId } from "react";
import { NavLinks } from "@/components/layout/nav-links";
import { MenuIcon } from "@/components/ui/icons/menu";
import { CloseIcon } from "@/components/ui/icons/close";
import type { NavItem } from "@/lib/prismic/navigation";

export function HeaderMobileMenu({ links }: { links: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (links.length === 0) return null;

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-[10px] text-zinc-900 md:hidden"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {open && (
        <div
          id={panelId}
          className="absolute inset-x-0 top-full border-b border-zinc-200 bg-zinc-50 shadow-sm md:hidden"
        >
          <div className="mx-auto max-w-[1640px] px-4 py-3 sm:px-6">
            <NavLinks
              items={links}
              variant="vertical"
              ariaLabel="Móvil"
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
