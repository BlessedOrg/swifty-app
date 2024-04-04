import { ReactNode } from "react";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "@/theme/theme";
import {
  coinbaseWallet,
  metamaskWallet,
  ThirdwebProvider,
  walletConnect,
  embeddedWallet,
  smartWallet,
  localWallet,
} from "@thirdweb-dev/react";
import { Navigation } from "@/components/navigation/Navigation";
import { Inter } from "next/font/google";
import { GelatoOpCelestia, Sepolia } from "@thirdweb-dev/chains";
interface IProps {
  children: ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

const opCelestiaRaspberry = {
  ...GelatoOpCelestia,
  rpc: ["https://rpc.opcelestia-raspberry.gelato.digital"],
};
export const activeChain = opCelestiaRaspberry;

export const smartWalletConfig = smartWallet(localWallet(), {
  factoryAddress: `${process.env.THIRDWEB_FACTORY_ADDRESS}`,
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
              onAuthSuccess: (data) => console.log(data),
            }),
          ]}
          clientId={`${process.env.THIRDWEB_CLIENT_ID}`}
        >
          <main className={inter.className}>
            <Navigation>{children}</Navigation>
          </main>
        </ThirdwebProvider>
      </ChakraProvider>
    </>
  );
};
