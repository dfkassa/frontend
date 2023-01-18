import type { Context, ReactNode } from "react";
import React from "react";


export interface Token {
    address: string,
    symbol: string,
    name: string,
    decimals: number
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
}
