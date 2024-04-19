"use client";
import { ReactNode } from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "@/theme/theme";
import { coinbaseWallet, embeddedWallet, localWallet, metamaskWallet, smartWallet, ThirdwebProvider, walletConnect } from "@thirdweb-dev/react";
import { Navigation } from "@/components/navigation/Navigation";
import { GelatoOpCelestia } from "@thirdweb-dev/chains";

interface IProps {
  children: ReactNode;
}

const opCelestiaRaspberry = {
  ...GelatoOpCelestia,
  rpc: ["https://rpc.opcelestia-raspberry.gelato.digital"],
};
export const activeChain = opCelestiaRaspberry;

export const smartWalletConfig = smartWallet(localWallet(), {
  factoryAddress: process.env.THIRDWEB_FACTORY_ADDRESS as string,
  gasless: true,
});

export const Providers = ({ children }: IProps) => {
  return (
    <>
      <ColorModeScript
        initialColorMode={theme.config.initialColorMode}
        storageKey={"tikiti-color-mode"}
      />

      <ChakraProvider theme={theme}>
        <ThirdwebProvider
          activeChain={activeChain}
          supportedWallets={[
            smartWalletConfig,
            metamaskWallet(),
            coinbaseWallet(),
            walletConnect(),
            embeddedWallet({
              auth: {
                options: ["email", "google", "apple", "facebook"],
              },
            }),
          ]}
          clientId={`${process.env.THIRDWEB_CLIENT_ID}`}
          authConfig={{
            authUrl: "/api/auth",
            domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "",
          }}
        >
          <Navigation>{children}</Navigation>
        </ThirdwebProvider>
      </ChakraProvider>
    </>
  );
};
