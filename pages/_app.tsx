import "../styles/globals.css";
import type { AppProps } from "next/app";

import * as wagmi from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import * as wagmiChains from "@wagmi/core/chains"
import * as web3modal from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

import { CustomProvider } from 'rsuite';

export default function App({ Component, pageProps }: AppProps) {
    const chains = [wagmiChains.goerli, wagmiChains.bscTestnet, wagmiChains.mainnet];
    const { provider } = wagmi.configureChains(
        chains,
        [
            web3modal.walletConnectProvider({
                projectId: "55fa8a10268e7dd8e9a490f7d07ce403",

            }),
            publicProvider()
        ]
    );
    const wagmiClient = wagmi.createClient({
        autoConnect: true,
        connectors: web3modal.modalConnectors({
            appName: "DFKassa",
            chains
        }),
        provider,
    });
    const ethereumClient = new web3modal.EthereumClient(wagmiClient, chains);
    return (
        <CustomProvider theme="dark">
            <wagmi.WagmiConfig client={wagmiClient}>
                <Component {...pageProps} />
            </wagmi.WagmiConfig>
            <Web3Modal
                projectId="55fa8a10268e7dd8e9a490f7d07ce403"
                ethereumClient={ethereumClient}
                themeColor="blackWhite"
            />
        </CustomProvider>
    )
}
