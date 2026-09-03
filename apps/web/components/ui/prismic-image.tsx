import type { ImageField } from "@prismicio/client";
import type { ImgHTMLAttributes } from "react";

type PrismicImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "srcSet"
> & {
  field: ImageField;
  fill?: boolean;
};

export const PrismicImage = ({
  field,
  fill = false,
  alt,
  className,
  loading = "lazy",
  decoding = "async",
  ...rest
}: PrismicImageProps) => {
  if (!field?.url) return null;

  const finalAlt = alt ?? field.alt ?? "";
  const fillClass = fill ? "absolute inset-0 h-full w-full" : "";
  const finalClass = [fillClass, className].filter(Boolean).join(" ");

  return (
    <img
      src={field.url}
      alt={finalAlt}
      width={fill ? undefined : field.dimensions?.width}
      height={fill ? undefined : field.dimensions?.height}
      loading={loading}
      decoding={decoding}
      className={finalClass || undefined}
      {...rest}
    />
  );
};
