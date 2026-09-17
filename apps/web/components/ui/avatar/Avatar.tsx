"use client";

import { memo, useEffect, useState } from "react";
import { UserIcon } from "@/components/ui/icons/user";
import type { AvatarProps, AvatarSize, AvatarTone } from "./Avatar.types";

const circleBaseClasses =
  "flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full";

const sizeClasses: Record<AvatarSize, string> = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-[13px]",
  md: "h-12 w-12 text-base",
  lg: "h-[72px] w-[72px] text-2xl",
  xl: "h-24 w-24 text-3xl",
};

const toneClasses: Record<AvatarTone, string> = {
  rose: "bg-brand-500 text-white",
  dark: "bg-neutral-900 text-white",
  light: "border border-neutral-200 bg-white text-neutral-700",
  muted: "border border-neutral-200 bg-neutral-200 text-neutral-700",
};

const imageClasses = "border border-neutral-200 bg-neutral-100";

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const firstWord = words[0] ?? "";
  if (words.length > 1) {
    const secondWord = words[1] ?? "";
    return `${firstWord.charAt(0).toUpperCase()}${secondWord.charAt(0).toUpperCase()}`;
  }
  return `${firstWord.charAt(0).toUpperCase()}${firstWord.charAt(1)}`;
}

export const Avatar = memo(function Avatar({
  name,
  avatarUrl,
  size = "md",
  tone = "rose",
  alt,
  className,
}: Readonly<AvatarProps>) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUrl]);

  const resolvedName = name?.trim() ?? "";
  const resolvedUrl = avatarUrl?.trim() ?? "";
  const resolvedAlt = alt?.trim() ?? resolvedName;
  const decorative = resolvedAlt === "";
  const showImage = resolvedUrl !== "" && !imageFailed;
  const showInitials = !showImage && resolvedName !== "";
  const circleClasses = showImage ? imageClasses : toneClasses[tone];
  const avatarClassName = [
    circleBaseClasses,
    sizeClasses[size],
    circleClasses,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={avatarClassName} aria-hidden={decorative ? true : undefined}>
      {showImage ? (
        <img
          src={resolvedUrl}
          alt={resolvedAlt}
          onError={() => setImageFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : null}
      {showInitials ? (
        <span aria-hidden="true" className="font-semibold leading-none">
          {getInitials(resolvedName)}
        </span>
      ) : null}
      {showInitials || showImage ? null : <UserIcon className="h-1/2 w-1/2" />}
      {showInitials && !decorative ? (
        <span className="sr-only">{resolvedAlt}</span>
      ) : null}
    </span>
  );
});
