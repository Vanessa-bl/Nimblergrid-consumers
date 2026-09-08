import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { ImagePlaceholderIcon } from "@/components/ui/icons/image-placeholder";

const FEATURES = [
  {
    href: "/discover/photos",
    eyebrow: "Lorem",
    title: "Lorem ipsum dolor sit amet consectetur",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit sed. Do eiusmod tempor incididunt ut.",
    cta: "Lorem ipsum",
  },
  {
    href: "/profesionales",
    eyebrow: "Lorem",
    title: "Lorem ipsum dolor sit",
    description:
      "Lorem ipsum dolor sit amet consectetur. Adipiscing elit sed do eiusmod tempor.",
    cta: "Lorem ipsum",
  },
  {
    href: "/productos",
    eyebrow: "Lorem",
    title: "Lorem ipsum dolor",
    description:
      "Lorem ipsum dolor sit amet consectetur adipiscing. Elit sed do eiusmod tempor.",
    cta: "Lorem ipsum",
  },
] as const;

export function Features() {
  return (
    <section className="mx-auto max-w-[1640px] px-4 py-16 sm:px-6 lg:px-7 lg:py-20">
      <header className="mx-auto mb-11 max-w-[680px] text-center">
        <Eyebrow>Lorem ipsum dolor sit amet</Eyebrow>
        <h2 className="mt-3 font-sans text-3xl font-semibold leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl lg:text-[42px]">
          Lorem ipsum dolor sit amet consectetur adipiscing
        </h2>
        <p className="mx-auto mt-3.5 max-w-[56ch] text-base leading-relaxed text-zinc-600">
          Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <Link
            key={f.href}
            href={f.href}
            className="group flex flex-col overflow-hidden rounded-[20px] border border-zinc-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_10px_30px_-12px_rgba(15,23,42,0.25)]"
          >
            <div className="relative flex aspect-[16/10] items-center justify-center bg-[linear-gradient(150deg,#E0E4E2,#C2CAC6)] text-zinc-500/40">
              <ImagePlaceholderIcon />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="mb-2 text-[12px] font-bold uppercase tracking-[0.12em] text-rose-500">
                {f.eyebrow}
              </span>
              <h3 className="font-sans text-[20px] font-semibold leading-tight tracking-tight text-zinc-900">
                {f.title}
              </h3>
              <p className="mt-2.5 text-[14.5px] leading-[1.55] text-zinc-600">
                {f.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-500 transition-all group-hover:gap-2.5">
                {f.cta}
                <ArrowRightIcon />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
