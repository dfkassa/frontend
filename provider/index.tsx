import { BaseDFKassaProvider } from "@/provider/base";
import EVMDFKassaProvider from "@/provider/impls/evm";
import * as chainIcons from "@thirdweb-dev/chain-icons";
import GearIcon from '@rsuite/icons/Gear';


export const DFKASSA_PROVIDERS: {[key: string]: BaseDFKassaProvider} = {
    "ETH1": new EVMDFKassaProvider({
        networkId: "ETH1",
        ethChainId: 1,
        dfkassaContractAddress: "0x0",
        networkIcon: <chainIcons.Ethereum height={20} />
    }),
    "ETH5": new EVMDFKassaProvider({
        networkId: "ETH5",
        ethChainId: 5,
        dfkassaContractAddress: "0x0",
        networkIcon: <GearIcon height={20} />
    }),
    "ETH97": new EVMDFKassaProvider({
        networkId: "ETH97",
        ethChainId: 97,
        dfkassaContractAddress: "0x0",
        networkIcon: <GearIcon height={20} />
    })
}


export const TOKEN_LOGO: {[key: string]: React.ReactNode} = {
    "BUSD": <chainIcons.BinanceUsd  height={20} />,
    "USDC": <chainIcons.UsdCoin height={20} />
}
