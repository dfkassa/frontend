import React, { useEffect } from "react";

export interface MerchantPreferedToken {
    symbol: string,
    chains: string[],
    amount: string
}

export interface BillSettings {
    ethAddress: string | undefined,
    tronAddress: string | undefined,
    amountInCents: number,
    tokens: MerchantPreferedToken[],
    expiresAt: number | undefined,
    payload: number | undefined,
    sellerContact: string | undefined
}

export interface QueryParsingResponse {
    settings?: BillSettings
    errorMessage?: string
}

export function useParseQueryStringSettings(): QueryParsingResponse | undefined {

    const [settings, setSettings] = React.useState<QueryParsingResponse | undefined>(undefined);


    useEffect(() => {
        console.log(window.location.search.replace("?", ""))
        const params = new URLSearchParams(window.location.search.replace("?", ""));

        const tokensString = params.get("tokens");
        const tokens = tokensString !== null ? _parseTokensString(tokensString) ?? [] : []
        const payload = params.get("payload");
        const expiresAt = params.get("expires_at");
        const amountInCents = params.get("amount_in_cents");

        if (amountInCents === null) {
            setSettings({
                errorMessage: "Pass amount_in_cents value (represents checkout cost in cents)"
            });
        } else if (params.get("eth_address") === null) {
            setSettings({
                    errorMessage: "Pass eth_address value (represents merchant's payment recieving address)"
            });
        } else {
            setSettings(
                {
                    settings: {
                        ethAddress: params.get("eth_address"),
                        tronAddress: params.get("tron_address"),
                        amountInCents: parseInt(amountInCents),
                        tokens: tokens,
                        expiresAt: expiresAt !== null ? parseInt(expiresAt) : undefined,
                        payload: payload !== null ? parseInt(payload) : undefined,
                        sellerContact: params.get("seller_contact") ?? undefined
                    },
                }
            )
        }
    }, [])

    return settings

}


function _parseTokensString(dumpedTokens: string): MerchantPreferedToken[] | undefined {
    const tokens = dumpedTokens.split(";");
    const merchantTokens: MerchantPreferedToken[] = [];
    tokens.forEach(elem => {
        const [symbol, chains, amount] = elem.split("/");
        merchantTokens.push({
            symbol,
            amount,
            chains: chains.split(",")
        })
    })
    return merchantTokens;

}
