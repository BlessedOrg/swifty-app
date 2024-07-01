"use client";
import { ReactNode } from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "@/theme/theme";
import { ThirdwebProvider as ThirdwebProviderV5 } from "thirdweb/react";
import { Navigation } from "@/components/navigation/Navigation";
import "react-quill/dist/quill.snow.css";
import { defineChain } from "thirdweb/chains";
import { UserContextProvider } from "./store/UserContext";

interface IProps {
  children: ReactNode;
}
const thirdwebActiveChain = defineChain({
  id: Number(process.env.NEXT_PUBLIC_CHAIN_ID!),
  rpc: process.env.NEXT_PUBLIC_JSON_RPC_URL!,
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
});
export const activeChain = thirdwebActiveChain;

export const Providers = ({ children }: IProps) => {
  return (
    <>
      <ColorModeScript
        initialColorMode={theme.config.initialColorMode}
        storageKey={"tikiti-color-mode"}
      />
      <UserContextProvider>
        <ChakraProvider
          theme={theme}
          toastOptions={{ defaultOptions: { isClosable: true } }}
        >
          <ThirdwebProviderV5>
            <Navigation>{children}</Navigation>
          </ThirdwebProviderV5>
        </ChakraProvider>
      </UserContextProvider>
    </>
  );
};
