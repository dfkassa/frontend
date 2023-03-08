import { BaseDFKassaProvider, Bill, TXStateCallback } from "@/provider/base";
import { Web3Button } from "@web3modal/react";


export default class EVMDFKassaProvider extends BaseDFKassaProvider {

    _networkId: string
    _ethChainId: number
    _dfkassaContractAddress: string

    constructor({ networkId, ethChainId, dfkassaContractAddress }: { networkId: string, ethChainId: number, dfkassaContractAddress: string }) {
        super();
        this._networkId = networkId
        this._ethChainId = ethChainId
        this._dfkassaContractAddress = dfkassaContractAddress
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

}
