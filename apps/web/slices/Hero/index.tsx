import type { Content } from "@prismicio/client";
import type { SliceComponentProps } from "@prismicio/react";
import { Hero } from "@/features/home/hero";

export type HeroProps = SliceComponentProps<Content.HeroSlice>;

const HeroSlice = ({ slice }: HeroProps) => <Hero slice={slice} />;

export default HeroSlice;
