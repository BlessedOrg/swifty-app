// "use client";
// import { Web3Modal } from "@web3modal/react";
// import { ReactNode } from "react";
// import {
//   EthereumClient,
//   w3mConnectors,
//   w3mProvider,
// } from "@web3modal/ethereum";
// import { configureChains, createConfig, WagmiConfig } from "wagmi";
// import { arbitrum, mainnet, polygon } from "wagmi/chains";
//
// const chains = [arbitrum, mainnet, polygon];
// const projectId = "8cadb0f541431c41a5c180bd8d10f875";
//
// const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
// const wagmiConfig = createConfig({
//   autoConnect: true,
//   connectors: w3mConnectors({ projectId, chains }),
//   publicClient,
// });
// const ethereumClient = new EthereumClient(wagmiConfig, chains);
// export const Web3ModalProvider = ({ children }: { children: ReactNode }) => {
//   return (
//     <>
//       <Web3Modal
//         projectId={projectId}
//         ethereumClient={ethereumClient}
//         themeVariables={{
//           "--w3m-z-index": "10000",
//         }}
//       />
//       <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
//     </>
//   );
// };
export default function () {}
