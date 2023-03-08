import "../styles/globals.css";
import type { AppProps } from "next/app";

import * as wagmi from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import * as wagmiChains from "@wagmi/core/chains"
import * as web3modal from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

import { CustomProvider } from 'rsuite';
import { WASMContextProvider } from "context/WASM";

export default function App({ Component, pageProps }: AppProps) {
    const chains = [wagmiChains.goerli, wagmiChains.mainnet];
    const { provider } = wagmi.configureChains(
        chains,
        [
            web3modal.walletConnectProvider({
                projectId: "8e7a7f7389c2cb73d086225ec791a430",

            }),
        ]
    );
    const wagmiClient = wagmi.createClient({
        // autoConnect: true,
        connectors: web3modal.modalConnectors({
            appName: "DFKassa",
            projectId: "8e7a7f7389c2cb73d086225ec791a430",
            chains
        }),
        provider,
    });
    const ethereumClient = new web3modal.EthereumClient(wagmiClient, chains);
    return (
        <>
            <wagmi.WagmiConfig client={wagmiClient}>
            <CustomProvider theme="dark">
                <WASMContextProvider>
                    <Component {...pageProps} />
                </WASMContextProvider>
            </CustomProvider>

            </wagmi.WagmiConfig>
                <Web3Modal
                    projectId="8e7a7f7389c2cb73d086225ec791a430"
                    ethereumClient={ethereumClient}
                    themeColor="blackWhite"
                />
        </>
        // <CustomProvider theme="dark">


        // </CustomProvider>
    )
}
