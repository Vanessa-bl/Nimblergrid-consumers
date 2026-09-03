import type { Metadata } from "next";
import { ComponentShowcase } from "@/components/test/component-showcase";

export const metadata: Metadata = {
  title: "Test de componentes",
};

export default function TestComponentPage() {
  return <ComponentShowcase />;
}
