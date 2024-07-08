import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faucet",
};
export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
