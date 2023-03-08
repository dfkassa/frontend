import { BaseDFKassaProvider, Bill, TXStateCallback } from "@/provider/base";
import { Web3Button } from "@web3modal/react";
import WagmiClient from "context/WagmiClient";
import React from "react";
import * as wagmi from "wagmi";


export default class EVMDFKassaProvider extends BaseDFKassaProvider {
    _networkId: string
    _ethChainId: number
    _dfkassaContractAddress: string
    _networkIcon: React.ReactNode

    constructor({
        networkId, ethChainId, dfkassaContractAddress, networkIcon
    }: {
        networkId: string, ethChainId: number, dfkassaContractAddress: string,
        networkIcon: React.ReactNode
    }) {
        super();
        this._networkId = networkId
        this._ethChainId = ethChainId
        this._dfkassaContractAddress = dfkassaContractAddress
        this._networkIcon = networkIcon
    }

    networkId(): string {
        return this._networkId
    }

    async pay({ bill, callback }: { bill: Bill, callback: TXStateCallback }): Promise<void> {
        callback.onSuccess("test");
    }
    connectWalletButton() {
        return <Web3Button balance="show"/>
    }

    async switchNetwork(): any {
        const wagmiClient = React.useContext(WagmiClient);
        try {
            await wagmiClient?.connector?.switchChain(this._ethChainId)
        } catch(err) {
            console.error(err)
        }

    }

    networkIcon(): React.ReactNode {
        return this._networkIcon
    }

    addWalletConnectionCallback(current: boolean, onChangeCallback: (_: boolean) => any) {
        const wagmiClient = React.useContext(WagmiClient);

        setInterval(() => {
            if (current != (wagmiClient?.status == "connected")) {
                onChangeCallback(wagmiClient?.status == "connected")
            }
        }, 1200)
    }

}
