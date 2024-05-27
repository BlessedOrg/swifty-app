import "./globals.scss";
import { Inter } from "next/font/google";
import { Providers } from "../Providers";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react"
import HowItWorks from "@/components/navigation/HowItWorks";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Blessed",
    default: "",
  },
};
function MyApp({ children }) {
  return (
    <html lang="en">
      <body>
        <main className={inter.className}>
          <Providers>
            {children}
            {/*<HowItWorks />*/}
          </Providers>
        </main>
        <Analytics />
      </body>
    </html>
  );
}

export default MyApp;
