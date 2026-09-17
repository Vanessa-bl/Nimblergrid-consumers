export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export type AvatarTone = "rose" | "dark" | "light" | "muted";

export type AvatarProps = {
  name?: string | null;
  avatarUrl?: string | null;
  size?: AvatarSize;
  tone?: AvatarTone;
  alt?: string;
  className?: string;
};
