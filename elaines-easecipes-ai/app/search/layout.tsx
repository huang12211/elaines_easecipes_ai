import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Recipes",
  description: "Search Elaine's Easecipes by keywords, category, or ingredient.",
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
