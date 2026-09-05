import type { Metadata } from "next";
import { TestProfileLayout } from "@/components/test/test-profile-layout";

export const metadata: Metadata = {
  title: "Test de perfiles",
};

export default function TestProfilePage() {
  return <TestProfileLayout />;
}
