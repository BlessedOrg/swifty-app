import { ReactNode } from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "@/theme/theme";
import {
  coinbaseWallet,
  metamaskWallet,
  ThirdwebProvider,
  walletConnect,
  embeddedWallet,
} from "@thirdweb-dev/react";
import { Navigation } from "@/components/navigation/Navigation";
import { Inter } from "next/font/google";

interface IProps {
  children: ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

export const Providers = ({ children }: IProps) => {
  return (
    <>
      <ColorModeScript
        initialColorMode={theme.config.initialColorMode}
        storageKey={"tikiti-color-mode"}
      />

      <ChakraProvider theme={theme}>
        <ThirdwebProvider
          supportedWallets={[
            metamaskWallet({
              recommended: true,
            }),
            coinbaseWallet(),
            walletConnect(),
            embeddedWallet({
              auth: {
                options: ["email", "google", "apple", "facebook"],
              },
            }),
          ]}
          clientId={process.env.NEXT_PUBLIC_CLIENT_ID}
        >
          <main className={inter.className}>
            <Navigation>{children}</Navigation>
          </main>
        </ThirdwebProvider>
      </ChakraProvider>
    </>
  );
};
