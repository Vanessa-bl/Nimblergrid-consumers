import { SliceZone } from "@prismicio/react";
import { getHome } from "@/lib/prismic/home";
import { components } from "@/slices";
import { Features } from "@/components/home/features";
import { Stats } from "@/components/home/stats";
import { CtaDark } from "@/components/home/cta-dark";

export default async function HomePage() {
  const home = await getHome();

  return (
    <>
      {home && <SliceZone slices={home.data.slices} components={components} />}
      <Features />
      <Stats />
      <CtaDark />
    </>
  );
}
