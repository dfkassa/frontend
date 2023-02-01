import { ReactNode, useEffect } from "react";
import { BaseNetwork, PayableEntity, Token } from "@/hooks/base";
import * as tokens from "../tokens.json";
import DFKassaABI from "@/abi/DFKassa.abi.json";

import { Web3Button } from "@web3modal/react";
import * as wagmi from "wagmi";
import React from "react";
import { BillSettings } from "../parseQueryString";
import { ethers } from "ethers";


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
        const presets = [];
        for (const key in tokens) {
            const element = tokens[key];
            if (element["networks"] === undefined) {
                continue
            }
            const elementNetwork = element["networks"][this.id()];
            if (elementNetwork !== undefined) {
                presets.push({
                    address: element["networks"][this.id()]["address"],
                    symbol: element["symbol"],
                    name: element["name"],
                    decimals: element["decimals"],
                    oracleChainId: element["networks"][this.id()].oracle.chainId,
                    oracleAddress: element["networks"][this.id()].oracle.address,
                });
            }
        }
        return presets;
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

    useContractPayCallback({
        to,
        token,
        amount,
        payload,
        onCallConfirmed
    }: {
        to: string,
        token: string,
        amount: ethers.BigNumber,
        payload: ethers.BigNumber,
        onCallConfirmed: () => void
    }): () => void {
        const fees = wagmi.useFeeData();
        const overrides = {
            gasPrice: fees.data?.gasPrice
        };
        if (token == ethers.constants.AddressZero) {
            overrides["value"] = amount.add(fees.data?.gasPrice?.mul(30_000))
        } else {
            overrides["value"] = fees.data?.gasPrice?.mul(30_000)
        }
        const broadcastPreparation = wagmi.usePrepareContractWrite({
            address: this._dfkassaContract,
            abi: DFKassaABI,
            functionName: "pay",
            args: [
                to, token, amount, payload
            ],
            overrides: overrides
        });
        const signedTx = wagmi.useContractWrite({
            ...broadcastPreparation.config,
            onSuccess(data: any, variables: any, context: any) {
                onCallConfirmed()
            }
        });
        const signWaiter = wagmi.useWaitForTransaction({
            hash: signedTx.data?.hash,
        });
        // wagmi.useContractEvent({
        //     address: this._dfkassaContract,
        //     abi: DFKassaABI,
        //     eventName: 'NewPayment',
        //     listener(...args) {
        //         console.log(args)
        //     },
        // })
        return signedTx.write!
    }

}
