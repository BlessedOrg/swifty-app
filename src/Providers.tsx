"use client";
import { ReactNode } from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "@/theme/theme";
import { localWallet, smartWallet, ThirdwebProvider } from "@thirdweb-dev/react";
import { ThirdwebProvider as ThirdwebProviderV5 } from "thirdweb/react";
import { Navigation } from "@/components/navigation/Navigation";
import "react-quill/dist/quill.snow.css";

interface IProps {
  children: ReactNode;
}

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
        <ThirdwebProvider clientId={`${process.env.THIRDWEB_CLIENT_ID}`}>
          <ThirdwebProviderV5>
            <Navigation>{children}</Navigation>
          </ThirdwebProviderV5>
        </ThirdwebProvider>
      </ChakraProvider>
    </>
  );
};
