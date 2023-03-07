interface Bill {
    to: string,
    token: string,
    amount: string,
    payload: string
}


export interface TXStateCallback {
    onSuccess: (hash: string) => void
}


export abstract class BaseDFKassaProvider {
    abstract pay(bill: Bill, callback: TXStateCallback): Promise<void>;
    abstract connectWalletButton(): React.ReactNode;
}
