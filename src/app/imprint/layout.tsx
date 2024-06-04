import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Imprint",
};
export default function ImprintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
