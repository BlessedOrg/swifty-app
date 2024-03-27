import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import "./globals.scss";
import { Providers } from "../src/Providers";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

export default MyApp;
