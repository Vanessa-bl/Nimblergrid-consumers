import type { Content } from "@prismicio/client";
import type { NavItem } from "@/domain/navigation";

export type UrlField = Content.CategoriesSliceDefaultPrimaryNavCategoriesItem["url"];
export type ParsedHref = Pick<NavItem, "href" | "external">;

export const extractHrefFromRichText = (field: UrlField): ParsedHref | null => {
  if (!Array.isArray(field) || field.length === 0) return null;

  for (const block of field) {
    if ("spans" in block && Array.isArray(block.spans)) {
      for (const span of block.spans) {
        if (span.type === "hyperlink" && "data" in span && span.data) {
          const { url, target } = span.data as { url?: string; target?: string };
          if (url) return { href: url, external: target === "_blank" };
        }
      }
    }

    const text = "text" in block ? block.text : "";
    if (text.startsWith("http://") || text.startsWith("https://")) {
      return { href: text, external: true };
    }
    if (text.startsWith("/")) {
      return { href: text, external: false };
    }
  }

  return null;
};
