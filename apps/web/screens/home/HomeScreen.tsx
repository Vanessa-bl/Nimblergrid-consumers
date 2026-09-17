import { SliceZone } from "@prismicio/react";
import { getHome } from "@/lib/prismic/home";
import { components } from "@/slices";
import { Features } from "@/features/home/features";
import { Stats } from "@/features/home/stats";
import { CtaDark } from "@/features/home/cta-dark";

export async function HomeScreen() {
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
