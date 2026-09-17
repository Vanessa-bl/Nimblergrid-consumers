"use client";

import { useState } from "react";
import { ViewModeToggle, type ViewModeOption } from "@/components/ui/view-mode-toggle";
import { ProfileCardDemo } from "@/components/test/profile-card-demo";
import { ContactedCards } from "@/components/test/contacted-cards";
import { RenterProfileForm } from "@/features/profile/renter-profile/RenterProfileForm";

type TabId = "profile" | "renter-profile" | "contacted";

const TAB_OPTIONS: readonly ViewModeOption<TabId>[] = [
  { label: "Profile", value: "profile" },
  { label: "Renter profile", value: "renter-profile" },
  { label: "Contactados", value: "contacted" },
];

const PANEL_LABELS: Record<TabId, string> = {
  profile: "Profile",
  "renter-profile": "Renter profile",
  contacted: "Contactados",
};

export function TestProfileLayout() {
  const [activeId, setActiveId] = useState<TabId>("profile");

  return (
    <div className="pb-24">
      <div className="px-4 pt-10 sm:px-6">
        <h1 className="text-left text-3xl font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-4xl">
          Your home
        </h1>
        <div className="mt-6">
          <ViewModeToggle
            ariaLabel="Flujos de perfil"
            options={TAB_OPTIONS}
            value={activeId}
            onChange={setActiveId}
            className="w-full max-w-2xl"
          />
        </div>
      </div>

      <div
        role="tabpanel"
        aria-label={PANEL_LABELS.profile}
        hidden={activeId !== "profile"}
        className="px-4 pt-10 sm:px-6"
      >
        <ProfileCardDemo />
      </div>

      <div
        role="tabpanel"
        aria-label={PANEL_LABELS["renter-profile"]}
        hidden={activeId !== "renter-profile"}
        className="px-4 pt-10 sm:px-6"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl">
            Renter profile
          </h2>
          <p className="mt-2 max-w-[64ch] text-sm leading-relaxed text-neutral-600">
            We&apos;ll include any details you share here with rental managers
            you contact. This helps complete the picture of you as a renter.
          </p>
        </div>
        <RenterProfileForm />
      </div>

      <div
        role="tabpanel"
        aria-label={PANEL_LABELS.contacted}
        hidden={activeId !== "contacted"}
        className="pt-8"
      >
        <ContactedCards />
      </div>
    </div>
  );
}
