import "./globals.scss";
import { Inter } from "next/font/google";
import { Providers } from "../Providers";
import { Metadata } from "next";
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
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}

export default MyApp;
