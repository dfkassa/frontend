import { ethers } from "ethers";
import { Context, ReactNode, useEffect } from "react";
import * as wagmi from "wagmi";
import React from "react";
import * as tokens from "@/hooks/tokens.json";
import ChainlinkOracleABI from "@/abi/ChainlinkOracle.json";
import { BillSettings } from "./parseQueryString";
import { readContracts } from '@wagmi/core';


export interface Token {
    address: string,
    symbol: string,
    name: string,
    decimals: number,
    oracleChainId: number | undefined,
    oracleAddress: string | undefined
}


export abstract class BaseNetwork {
    abstract id(): string
    abstract humanName(): string
    abstract isTestnet(): boolean
    abstract connectWalletButton(): ReactNode
    abstract isWalletConnected(): boolean
    abstract payHook(
        token: string,
        amount: string
    ): () => void
    abstract tokenPresets(): Token[]
    abstract switchNetwork(): () => void
    abstract useContractPayCallback({
        to,
        token,
        amount,
        payload
    }: {
        to: string,
        token: string,
        amount: ethers.BigNumber,
        payload: ethers.BigNumber
    }): () => void
}


export function useTokenPrices(): (address: string, chainId: number) => ethers.BigNumber | undefined {
    const requests: any[] = [];
    for (const key in tokens) {
        const element = tokens[key];
        for (const network in element["networks"]) {
            const networkDetails = element["networks"][network];
            requests.push({
                address: networkDetails["oracle"]["address"],
                abi: ChainlinkOracleABI,
                functionName: "latestAnswer",
                chainId: networkDetails["oracle"]["chainId"]
            })
        }

    }
    const prices = wagmi.useContractReads<unknown[], string, any, ethers.BigNumber[]>({
        contracts: requests,
        allowFailure: false
    })
    console.log("P", prices.data);
    // useEffect(() => {
    //     prices.refetch().then(val => console.log(val))
    // }, [])
    return (address, chainId) => {
        if (prices.data === undefined) {
            return undefined
        }
        let counter = 0;
        for (const priceRequest of requests) {
            console.log("eq", address, chainId, priceRequest.address, priceRequest.chainId)
            if (priceRequest.address == address && chainId == priceRequest.chainId) {
                return prices.data[counter];
            } else {
                ++counter
            }
        }
        return undefined
    }
}
