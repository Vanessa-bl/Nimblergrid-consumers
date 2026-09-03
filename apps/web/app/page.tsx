import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Stats } from "@/components/home/stats";
import { CtaDark } from "@/components/home/cta-dark";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Stats />
      <CtaDark />
    </>
  );
}
