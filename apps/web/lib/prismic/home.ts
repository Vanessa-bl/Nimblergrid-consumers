import { createClient } from "@/prismicio";
import { withCache } from "@/lib/cache";

export const HOME_CACHE_TAGS = ["prismic", "home"] as const;
const HOME_CACHE_TTL_SECONDS = 3600;

const fetchHome = async () => {
  const client = createClient();
  return client.getSingle("home").catch((err) => {
    console.error("[getHome] Prismic error detail:", {
      message: err?.message,
      name: err?.name,
      url: err?.url,
      status: err?.status,
      responseBody: typeof err?.response === "string"
        ? err.response.slice(0, 500)
        : err?.response,
      hasToken: Boolean(process.env.PRISMIC_ACCESS_TOKEN),
      repoName: process.env.NEXT_PUBLIC_PRISMIC_REPO ?? "(fallback to sm.json)",
    });
    return null;
  });
};

export const getHome = withCache(fetchHome, ["home"], {
  tags: HOME_CACHE_TAGS,
  revalidate: HOME_CACHE_TTL_SECONDS,
});
