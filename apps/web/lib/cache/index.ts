import { unstable_cache, revalidateTag } from "next/cache";

type CacheOptions = {
  tags?: readonly string[];
  revalidate?: number | false;
};

const DEFAULT_REVALIDATE_SECONDS = 3600;

export const withCache = <TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyParts: readonly string[],
  { tags, revalidate = DEFAULT_REVALIDATE_SECONDS }: CacheOptions = {},
) =>
  unstable_cache(fn, [...keyParts], {
    tags: tags ? [...tags] : undefined,
    revalidate,
  });

export { revalidateTag };
