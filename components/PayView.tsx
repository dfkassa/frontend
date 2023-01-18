import { Button, ButtonGroup, Drawer, Form, IconButton, Panel, SelectPicker, Stack, useToaster, Notification } from "rsuite";
import DetailIcon from '@rsuite/icons/Detail';
import React, { useEffect } from "react";
import { Network, NetworkContext } from "@/hooks/all";
import { BaseNetwork } from "@/hooks/base";
import { useParseQueryStringSettings } from "@/hooks/parseQueryString";

import { ethers } from "ethers";


export function PaymentDetailsDrawer({
    open,
    setOpen,
    ...props
}: {
    open: boolean,
    setOpen: (_: boolean) => void
}) {
    return (
        <>
            <Drawer size="lg" placement="bottom" open={open} onClose={() => setOpen(false)}>
                <Drawer.Header>
                <Drawer.Title><h4>Checkout details</h4></Drawer.Title>
                </Drawer.Header>
                <Drawer.Body style={{ padding: 10 }}>
                    <Panel
                        bordered shaded
                    >
                        <dl>
                            <dt>Seller ETH address</dt>
                            <dd>0x123123123123</dd>
                            <dt>Payload</dt>
                            <dd>1322321</dd>
                            <dt>Seller contact</dt>
                            <dd>https://t.me/example</dd>
                        </dl>
                    </Panel>
                </Drawer.Body>
            </Drawer>
        </>
    )
}

export function PaymentHeader({amount, ...props}: { amount?: number }) {
    const [detailesDrawerOpened, setDetailesDrawerOpened] = React.useState(false);
    return (
        <>
            <Stack
                justifyContent="space-between"
            >
                <Stack.Item>
                    <h2>${
                        amount === undefined ?
                        0 : ethers.utils.commify(
                            (amount / 100).toFixed(2)
                        )
                    }</h2>
                </Stack.Item>
                <Stack.Item>
                    <ButtonGroup>
                        <IconButton onClick={() => setDetailesDrawerOpened(true)} icon={<DetailIcon />}>Details</IconButton>
                    </ButtonGroup>
                </Stack.Item>
            </Stack>
            <PaymentDetailsDrawer setOpen={setDetailesDrawerOpened} open={detailesDrawerOpened} />
        </>
    )
}

export function ConfirmPaymentDropdown({
    processConfirmation, setProcessConfirmation
}: {
    processConfirmation: boolean,
    setProcessConfirmation: (_: boolean) => void
}) {
    const networkProvider = React.useContext(NetworkContext);
    const [connectWalletAndPayDrawer, setConnectWalletAndPayDrawer] = React.useState<boolean>(false);
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
                            <dt>Seller ETH address</dt>
                            <dd>0x123123123123</dd>
                            <dt>Payload</dt>
                            <dd>1322321</dd>
                            <dt>Seller contact</dt>
                            <dd>https://t.me/example</dd>
                            <dt>Network</dt>
                            <dd>{networkProvider.humanName()}</dd>
                            <dt>Token</dt>
                            <dd>0x123123 (USDT)</dd>
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
                        >
                            <b>Pay</b>
                        </Button>
                    </div>
                </Drawer.Body>
            </Drawer>
        </>
    )
}


export default function PayView() {
    const [selectedNetworkLabel, setSelectedNetworkLabel] = React.useState<string>("ETH_GOERLI");
    const toaster = useToaster();
    const [queryStringErrorShowed, setQueryStringErrorShowed] = React.useState<boolean>(false);

    const tokenPresets = Network[selectedNetworkLabel].tokenPresets();
    const [selectedToken, setSelectedToken] = React.useState<string>("0x0");
    const [processConfirmation, setProcessConfirmation] = React.useState<boolean>(false);

    const isWalletConnected = Network[selectedNetworkLabel].isWalletConnected();
    Network[selectedNetworkLabel].switchNetwork();

    const querySettings = useParseQueryStringSettings();

    console.log("q", querySettings)
    if (querySettings !== undefined && querySettings.settings == undefined && !queryStringErrorShowed) {
        toaster.push(
            <Notification duration={0} type="error" header="Invalid query string arguments">
                {querySettings.errorMessage}
                <hr />
                If you are not a developer, contact the shop support.
            </Notification>,
            { placement: "topStart" }
        )
        setQueryStringErrorShowed(true)
        // TODO
        // throw new Error("Query string does not contain required field")
    }


    return (
        <NetworkContext.Provider value={Network[selectedNetworkLabel]}>
            <Panel
                bordered
                shaded
                header={<PaymentHeader amount={querySettings?.settings?.amountInCents} />}
                style={{
                    maxWidth: 600,
                    margin: 10,
                    display: queryStringErrorShowed ? "none" : "block"
                }}
            >
                <p>
                    Confirm payment using one of this currencies & networks
                </p>
                <br />
                <SelectPicker
                    label="Network"
                    data={[
                        { label: "Ethereum Goerli Testnet", value: "ETH_GOERLI" },
                        { label: "Binance Smart Chain Testnet", value: "BSC_TESTNET" }
                    ]}
                    value={selectedNetworkLabel}
                    style={{ width: "100%" }}
                    onChange={(value, _) => setSelectedNetworkLabel(value!)}
                    cleanable={false}
                />
                <Form.HelpText style={{ marginTop: 5 }}>&nbsp;Select prefered network to pay</Form.HelpText>
                <br />
                <SelectPicker
                    label="Token"
                    data={
                        tokenPresets.map(
                            elem => ({
                                label: elem.name,
                                value: elem.address
                            })
                        )
                    }
                    value={selectedToken}
                    onChange={(value, _) => setSelectedToken(value!)}
                    cleanable={false}
                    style={{ width: "100%" }} />
                <Form.HelpText style={{ marginTop: 5 }}>&nbsp;Select prefered currency to pay</Form.HelpText>
                <br />
                <div style={{display: "flex", justifyContent: "center"}}>
                    {Network[selectedNetworkLabel].connectWalletButton()}
                </div>
                <hr />
                <Button
                    block
                    appearance="primary"
                    style={{ backgroundColor: "#5ea83e" }}
                    disabled={!isWalletConnected}
                    onClick={() => setProcessConfirmation(true)}
                ><b>Confirm</b></Button>
                <Form.HelpText style={{ marginTop: 10 }}>&nbsp;Network fee: 0.00234 ETH (~1.12$)</Form.HelpText>
                <Form.HelpText>&nbsp;Protocol fee: 0.00087 ETH (~0.32$)</Form.HelpText>
            </Panel>
            <ConfirmPaymentDropdown processConfirmation={processConfirmation} setProcessConfirmation={setProcessConfirmation} />
        </NetworkContext.Provider>

    )
}
