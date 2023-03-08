import { BaseDFKassaProvider } from "@/provider/base";
import React from "react";
import { Button, Drawer, Panel, Steps } from "rsuite";

export function ConfirmPaymentDropdown({
    processConfirmation,
    setProcessConfirmation,
    networkProvider,
    launch,
}: {
    processConfirmation: boolean,
    setProcessConfirmation: (_: boolean) => void,
    launch: import('wasm').LaunchOutput,
    networkProvider: BaseDFKassaProvider
}) {
    const [connectWalletAndPayDrawer, setConnectWalletAndPayDrawer] = React.useState<boolean>(false);
    const [awaitPaymentDrawerOpened, setAwaitPaymentDrawerOpened] = React.useState<boolean>(false);
    const [currentStep, setCurrentStep] = React.useState<number>(0);

    // const payCallback = networkProvider.useContractPayCallback({
    //     to: merchantAddress,
    //     token: tokenAddress,
    //     amount: amount,
    //     payload: payload,
    //     onCallConfirmed() {
    //         setCurrentStep(1)
    //     }
    // })

    return (
        <>
            <Drawer size="full" placement="bottom" open={processConfirmation} onClose={() => setProcessConfirmation(false)}>
                <Drawer.Header>
                <Drawer.Title><h4>Term of rules</h4></Drawer.Title>
                </Drawer.Header>
                <Drawer.Body style={{ padding: 10 }}>
                    <Panel
                        header="Read and confirm term of rules"

                        bordered
                        shaded
                    >
                        I agree with terms blablablabl
                    </Panel>
                    <br />
                    <Button
                        block
                        appearance="primary"
                        color="blue"
                        onClick={() => {setProcessConfirmation(false); setConnectWalletAndPayDrawer(true)}}
                    >
                        <b>I agree</b>
                    </Button>
                </Drawer.Body>
            </Drawer>
            <Drawer autoFocus={false} size="lg" placement="bottom" open={connectWalletAndPayDrawer} onClose={() => setConnectWalletAndPayDrawer(false)}>
                <Drawer.Header>
                <Drawer.Title><h4>Pay the bill</h4></Drawer.Title>
                </Drawer.Header>
                <Drawer.Body style={{ padding: 10 }}>
                    <Panel
                        bordered
                        shaded
                    >
                        <dl>
                            <dt>Payload</dt>
                            <dd>{launch.payload}</dd>
                            <dt>Seller contact</dt>
                            <dd>{launch.contact}</dd>
                        </dl>
                    </Panel>
                    <br />
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Button
                            block
                            appearance="primary"
                            style={{
                                backgroundColor: "#3f51b5"
                            }}
                            onClick={() => {
                                setConnectWalletAndPayDrawer(false)
                                setAwaitPaymentDrawerOpened(true)
                            }}
                        >
                            <b>Pay</b>
                        </Button>
                    </div>
                </Drawer.Body>
            </Drawer>
            <Drawer size="md" placement="bottom" open={awaitPaymentDrawerOpened} onClose={() => setAwaitPaymentDrawerOpened(false)}>
                <Drawer.Header>
                <Drawer.Title><h4>Awaiting payment</h4></Drawer.Title>
                </Drawer.Header>
                <Drawer.Body style={{ padding: 10 }}>
                    <Panel>
                        <Steps current={0} vertical>
                        <Steps.Item title="Confirm the call" description="Confirm smart contract call in your wallet" />
                        <Steps.Item title="Block confirmation" description="Awaiting when the block is getting confirmed" />
                        <Steps.Item title="Done!" description="Succesful! Payment is completed" />
                    </Steps>
                    </Panel>
                </Drawer.Body>
            </Drawer>
        </>
    )
}
