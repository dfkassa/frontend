import { ReactNode, useEffect } from "react";
import { BaseNetwork, Token } from "@/hooks/base";
import * as tokens from "./tokens.json";

import { Web3Button } from "@web3modal/react";
import * as wagmi from "wagmi";
import React from "react";


export default class EthereumLikeNetwork extends BaseNetwork {

    _chainId: number
    _chainName: string
    _isTestnet: boolean
    _dfkassaContract: string

    constructor({
        chainId,
        chainName,
        isTestnet,
        dfkassaContract,
    }: {
        chainId: number,
        chainName: string,
        isTestnet: boolean,
        dfkassaContract: string,
    }) {
        super();
        this._chainId = chainId;
        this._chainName = chainName;
        this._isTestnet = isTestnet
        this._dfkassaContract = dfkassaContract
    }

    isTestnet(): boolean {
        return this._isTestnet;
    }

    id(): string {
        return this._chainId.toString();
    }
    humanName(): string {
        return this._chainName;
    }
    connectWalletButton(): ReactNode {
        return <Web3Button balance="show" />;
    }
    payHook(token: string, amount: string): () => void {
        throw new Error("Method not implemented.");
    }
    isWalletConnected(): boolean {
        const account = wagmi.useAccount();
        return account.isConnected || account.isReconnecting || account.isConnecting
    }
    tokenPresets(): Token[] {
        return tokens[this._chainName];
    }

    switchNetwork(): () => void {
        const network = wagmi.useNetwork()
        const networkSwitcher = wagmi.useSwitchNetwork({
            onMutate(args) {
                console.log('Mutate', args)
                },
        });
        if (network.chain?.id !== this._chainId && networkSwitcher.pendingChainId !== this._chainId) {
            networkSwitcher.switchNetwork?.(this._chainId)
        }
        console.log(networkSwitcher.data)
        return () => {}
    }

}
