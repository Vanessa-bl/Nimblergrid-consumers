import type { Content } from "@prismicio/client";
import { PrismicRichText, type JSXMapSerializer } from "@prismicio/react";
import { Eyebrow } from "@/components/ui/eyebrow";
import { PrismicImage } from "@/components/ui/prismic-image";
import { SearchBar } from "@/components/ui/search-bar";

const SEARCH_MODES = [
  { key: "buy", label: "Buy", action: "/buy" },
  { key: "rent", label: "Rent", action: "/rent" },
  { key: "sell", label: "Sell", action: "/sell" },
] as const;

const titleComponents: JSXMapSerializer = {
  heading1: ({ children }) => (
    <h1 className="mt-4 font-sans text-4xl font-semibold leading-[1.05] tracking-tight text-zinc-900 sm:text-5xl lg:text-[58px]">
      {children}
    </h1>
  ),
  em: ({ children }) => (
    <em className="not-italic text-rose-500">{children}</em>
  ),
};

const descriptionComponents: JSXMapSerializer = {
  paragraph: ({ children }) => (
    <p className="mt-5 max-w-[52ch] text-[17px] leading-[1.6] text-zinc-600">
      {children}
    </p>
  ),
};

const statsComponents: JSXMapSerializer = {
  paragraph: ({ children }) => (
    <p className="mt-6 flex items-center gap-2 text-[13.5px] text-zinc-500">
      <span
        className="h-1.5 w-1.5 rounded-full bg-rose-500"
        aria-hidden="true"
      />
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <b className="font-semibold text-zinc-900">{children}</b>
  ),
};

type HeroProps = { slice: Content.HeroSlice };

export const Hero = ({ slice }: HeroProps) => {
  const {
    pretitle,
    title,
    description,
    image,
    image_caption: imageCaption,
    stats,
    metrics,
  } = slice.primary;

  return (
    <section className="mx-auto grid max-w-[1640px] items-center gap-10 px-4 pt-12 pb-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:px-7 lg:pt-16 lg:pb-14">
      <div>
        {pretitle && <Eyebrow>{pretitle}</Eyebrow>}
        <PrismicRichText field={title} components={titleComponents} />
        <PrismicRichText field={description} components={descriptionComponents} />

        <SearchBar modes={SEARCH_MODES} className="mt-6 max-w-[600px]" />

        <PrismicRichText field={stats} components={statsComponents} />
      </div>

      <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
        <div className="relative aspect-[4/3.4] overflow-hidden rounded-[28px] bg-[linear-gradient(150deg,#E7DBD9,#CBB6B4)] shadow-[0_10px_30px_-12px_rgba(15,23,42,0.25)]">
          <PrismicImage
            field={image}
            fill
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
          {imageCaption && (
            <span className="absolute left-3.5 top-3.5 rounded-md bg-black/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 backdrop-blur-sm">
              {imageCaption}
            </span>
          )}
        </div>

        {metrics.length > 0 && (
          <div className="absolute -right-4 -bottom-4 flex gap-5 rounded-[20px] bg-white p-5 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.25)] sm:-right-5 sm:-bottom-5">
            {metrics.map((metric, index) => (
              <div key={metric.label ?? index}>
                <b className="block font-sans text-[26px] font-semibold leading-none text-zinc-900">
                  {metric.value}
                </b>
                <span className="text-[12px] text-zinc-600">{metric.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
