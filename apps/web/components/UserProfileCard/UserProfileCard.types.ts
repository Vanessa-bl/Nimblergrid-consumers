export type UserProfileData = {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatarUrl?: string | null;
};

export type UserProfileCardProps = {
  data?: UserProfileData | null;
  title?: string;
  description?: string;
  onEdit?: (data: UserProfileData) => void;
  isLoading?: boolean;
  className?: string;
};

export type SupabaseProfileRow = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  email: string | null;
  avatar_url: string | null;
};

export type MagentoCustomAttribute = {
  code: string;
  value: string | null;
};

export type MagentoCustomer = {
  id: string | number;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  custom_attributes?: MagentoCustomAttribute[] | null;
};

export function supabaseProfileToUserData(
  row: SupabaseProfileRow,
): UserProfileData {
  return {
    id: row.id,
    name: row.full_name ?? "",
    phone: row.phone_number ?? "",
    email: row.email ?? "",
    avatarUrl: row.avatar_url ?? "",
  };
}

export function magentoCustomerToUserData(
  customer: MagentoCustomer,
): UserProfileData {
  const attributes = customer.custom_attributes ?? [];
  const phone = attributes.find((attribute) => attribute.code === "telephone");
  const avatar = attributes.find((attribute) => attribute.code === "avatar_url");
  return {
    id: String(customer.id),
    name: [customer.firstname, customer.lastname]
      .filter(Boolean)
      .join(" ")
      .trim(),
    phone: phone?.value ?? "",
    email: customer.email ?? "",
    avatarUrl: avatar?.value ?? "",
  };
}
