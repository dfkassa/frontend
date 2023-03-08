import { BaseDFKassaProvider } from "@/provider/base";
import EVMDFKassaProvider from "@/provider/impls/evm";


export const DFKASSA_PROVIDERS: {[key: string]: BaseDFKassaProvider} = {
    "ETH1": new EVMDFKassaProvider({
        networkId: "ETH1",
        ethChainId: 1,
        dfkassaContractAddress: "0x0"
    }),
    "ETH5": new EVMDFKassaProvider({
        networkId: "ETH5",
        ethChainId: 5,
        dfkassaContractAddress: "0x0"
    })
}
