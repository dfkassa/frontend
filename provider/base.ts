export interface Bill {
    to: string,
    token: string,
    amount: string,
    payload: string
}


export interface TXStateCallback {
    onSuccess: (hash: string) => void
}


export abstract class BaseDFKassaProvider {
    abstract networkId(): string;
    abstract pay({ bill, callback }: { bill: Bill, callback: TXStateCallback }): Promise<void>;
    abstract connectWalletButton(): React.ReactNode;
    abstract switchNetwork(): Promise<any>;
    abstract networkIcon(): React.ReactNode;
    abstract addWalletConnectionCallback(current: boolean | undefined, onChangeCallback: (_: boolean) => any): void
}
