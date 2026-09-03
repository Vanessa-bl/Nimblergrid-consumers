import Link from "next/link";
import { Eyebrow } from "@/components/ui/eyebrow";
import { ArrowRightIcon } from "@/components/ui/icons/arrow-right";
import { ImagePlaceholderIcon } from "@/components/ui/icons/image-placeholder";

const FEATURES = [
  {
    href: "/discover/photos",
    eyebrow: "Inspiración",
    title: "Inspirate con miles de fotos reales",
    description:
      "Recorré ambientes, materiales y estilos de los mejores estudios. Guardá tus favoritas en ideabooks.",
    cta: "Ver fotos",
  },
  {
    href: "/profesionales",
    eyebrow: "Profesionales",
    title: "Encontrá el estudio ideal",
    description:
      "Filtrá por zona, especialidad o estilo. Mirá su portfolio antes de contactarlos.",
    cta: "Ver profesionales",
  },
  {
    href: "/productos",
    eyebrow: "Productos",
    title: "Descubrí productos verificados",
    description:
      "Catálogo de fabricantes y marcas con precios y disponibilidad. Pedí cotización en un clic.",
    cta: "Ver productos",
  },
] as const;

export function Features() {
  return (
    <section className="mx-auto max-w-[1640px] px-4 py-16 sm:px-6 lg:px-7 lg:py-20">
      <header className="mx-auto mb-11 max-w-[680px] text-center">
        <Eyebrow>Todo en un mismo lugar</Eyebrow>
        <h2 className="mt-3 font-sans text-3xl font-semibold leading-[1.1] tracking-tight text-zinc-900 sm:text-4xl lg:text-[42px]">
          De la inspiración a la obra terminada
        </h2>
        <p className="mx-auto mt-3.5 max-w-[56ch] text-base leading-relaxed text-zinc-600">
          Tres herramientas que se combinan para que cada proyecto se haga realidad con menos fricción.
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
