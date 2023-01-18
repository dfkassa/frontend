import { Context } from "react";
import { BaseNetwork } from "@/hooks/base";
import React from "react";
import EthereumLikeNetwork from "./impls/eth";


export const Network: {[key: string]: BaseNetwork} = {
    ETH_GOERLI: new EthereumLikeNetwork({
        chainId: 5,
        chainName: "Ethereum Goerli Testnet",
        isTestnet: true,
        dfkassaContract: "0x0"
    }),
    BSC_TESTNET: new EthereumLikeNetwork({
        chainId: 97,
        chainName: "Binance Smart Chain Testnet",
        isTestnet: true,
        dfkassaContract: "0x0"
    })
}

export const NetworkContext: Context<BaseNetwork> = React.createContext(Network.ETH_GOERLI);
