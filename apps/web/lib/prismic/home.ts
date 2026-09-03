import { createClient } from "@/prismicio";
import { withCache } from "@/lib/cache";

export const HOME_CACHE_TAGS = ["prismic", "home"] as const;
const HOME_CACHE_TTL_SECONDS = 3600;

const fetchHome = async () => {
  const client = createClient();
  return client.getSingle("home").catch(() => null);
};

export const getHome = withCache(fetchHome, ["home"], {
  tags: HOME_CACHE_TAGS,
  revalidate: HOME_CACHE_TTL_SECONDS,
});
