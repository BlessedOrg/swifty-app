"use client";
import { ReactNode } from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "@/theme/theme";
import {
  localWallet,
  metamaskWallet,
  smartWallet,
  ThirdwebProvider,
} from "@thirdweb-dev/react";
import { ThirdwebProvider as ThirdwebProviderV5 } from "thirdweb/react";
import { Navigation } from "@/components/navigation/Navigation";
import { GelatoOpCelestia } from "@thirdweb-dev/chains";
import "react-quill/dist/quill.snow.css";

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

      <ChakraProvider
        theme={theme}
        toastOptions={{ defaultOptions: { isClosable: true } }}
      >
        <ThirdwebProvider
          clientId={`${process.env.THIRDWEB_CLIENT_ID}`}
          activeChain={activeChain}
          supportedChains={[activeChain]}
          supportedWallets={[metamaskWallet()]}
        >
          <ThirdwebProviderV5>
            <Navigation>{children}</Navigation>
          </ThirdwebProviderV5>
        </ThirdwebProvider>
      </ChakraProvider>
    </>
  );
};
