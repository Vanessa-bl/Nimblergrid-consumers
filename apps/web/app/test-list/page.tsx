import type { Metadata } from "next";
import { SearchResultsLayout } from "@/components/test/search-results-layout";

export const metadata: Metadata = {
  title: "Search results — test list",
};

export default function TestListPage() {
  return <SearchResultsLayout />;
}
