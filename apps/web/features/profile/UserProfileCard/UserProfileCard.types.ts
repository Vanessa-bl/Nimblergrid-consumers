import type { UserProfileData } from "@/domain/user-profile";

export type UserProfileCardProps = {
  data?: UserProfileData | null;
  title?: string;
  description?: string;
  onEdit?: (data: UserProfileData) => void;
  isLoading?: boolean;
  className?: string;
};
