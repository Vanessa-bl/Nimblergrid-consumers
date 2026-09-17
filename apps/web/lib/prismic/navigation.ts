import type { NavItem } from "@/domain/navigation";
import { createClient } from "@/prismicio";
import { extractHrefFromRichText } from "./nav-parser";

export const getNavigationLinks = async (): Promise<NavItem[]> => {
  const client = createClient();
  const doc = await client.getSingle("navigation").catch(() => null);
  if (!doc) return [];

  return doc.data.slices
    .filter((slice) => slice.slice_type === "categories")
    .flatMap((slice) => slice.primary.nav_categories)
    .flatMap((row) => {
      const label = row.category_name?.trim();
      if (!label) return [];

      const parsed = extractHrefFromRichText(row.url);
      if (!parsed) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[navigation] Item "${label}" has no URL in Prismic. Skipping.`);
        }
        return [];
      }

      return [{ label, ...parsed }];
    });
};
