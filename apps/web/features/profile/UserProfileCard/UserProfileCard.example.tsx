"use client";

import { useState, type ReactNode } from "react";
import { UserProfileCard } from "./UserProfileCard";
import {
  magentoCustomerToUserData,
  supabaseProfileToUserData,
  type MagentoCustomer,
  type SupabaseProfileRow,
  type UserProfileData,
} from "@/domain/user-profile";

const focusVisibleClasses =
  "rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500";

const DEMO_USER: UserProfileData = {
  id: "demo-1",
  name: "Iraima Hurtado",
  phone: "+54 11 4824 0900",
  email: "iraima@hallo.com.ar",
};

const DEMO_SUPABASE_ROW: SupabaseProfileRow = {
  id: "a3f9c2e1",
  full_name: "Marta Rossi",
  phone_number: "+54 11 4772 3300",
  email: "marta@hallo.com.ar",
  avatar_url:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=70",
};

const DEMO_MAGENTO_CUSTOMER: MagentoCustomer = {
  id: 2048,
  firstname: "Lucas",
  lastname: "Fernández",
  email: "lucas@hallo.com.ar",
  custom_attributes: [
    { code: "telephone", value: "+54 11 4300 1122" },
    { code: "avatar_url", value: null },
  ],
};

type DemoBlockProps = {
  caption: string;
  children: ReactNode;
};

function DemoBlock({ caption, children }: Readonly<DemoBlockProps>) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
        {caption}
      </p>
      {children}
    </div>
  );
}

export function UserProfileCardExample() {
  const [isLoading, setIsLoading] = useState(false);
  const [editTarget, setEditTarget] = useState<UserProfileData | null>(null);
  const supabaseData = supabaseProfileToUserData(DEMO_SUPABASE_ROW);
  const magentoData = magentoCustomerToUserData(DEMO_MAGENTO_CUSTOMER);

  return (
    <div className="space-y-6">
      <DemoBlock caption="1 · Demo controlada">
        <UserProfileCard
          data={DEMO_USER}
          onEdit={setEditTarget}
          isLoading={isLoading}
        />
        <div className="mt-2 flex min-h-6 items-center justify-between gap-2">
          <p className="text-sm text-neutral-500">
            {editTarget !== null
              ? `Edit solicitado con: ${editTarget.name}`
              : "Sin ediciones todavía"}
          </p>
          <button
            type="button"
            onClick={() => setIsLoading((current) => !current)}
            className={`cursor-pointer text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700 ${focusVisibleClasses}`}
          >
            {isLoading ? "Ocultar carga" : "Mostrar carga"}
          </button>
        </div>
      </DemoBlock>
      <DemoBlock caption="2 · Adapter Supabase">
        <UserProfileCard
          data={supabaseData}
          description="Sincronizado desde la tabla profiles"
        />
      </DemoBlock>
      <DemoBlock caption="3 · Adapter Magento">
        <UserProfileCard
          data={magentoData}
          description="Importado desde el customer de Magento"
        />
      </DemoBlock>
    </div>
  );
}
