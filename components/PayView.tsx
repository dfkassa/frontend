import { Button, ButtonGroup, Drawer, Form, IconButton, Panel, SelectPicker, Stack, useToaster, Notification } from "rsuite";
import DetailIcon from '@rsuite/icons/Detail';
import React, { useEffect } from "react";
import { Network, NetworkContext } from "@/hooks/all";
import { BaseNetwork, useTokenPrices } from "@/hooks/base";
import { useParseQueryStringSettings } from "@/hooks/parseQueryString";

import { ethers } from "ethers";


export function PaymentDetailsDrawer({
    open,
    setOpen,
    payload,
    ...props
}: {
    open: boolean,
    setOpen: (_: boolean) => void,
    payload: string,
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
                            <dd>{payload}</dd>
                            <dt>Seller contact</dt>
                            <dd>https://t.me/example</dd>
                        </dl>
                    </Panel>
                </Drawer.Body>
            </Drawer>
        </>
    )
}

export function PaymentHeader({amount, payload, ...props}: { payload: string, amount?: number }) {
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
            <PaymentDetailsDrawer setOpen={setDetailesDrawerOpened} open={detailesDrawerOpened} payload={payload} />
        </>
    )
}

export function ConfirmPaymentDropdown({
    processConfirmation,
    setProcessConfirmation,
    merchantAddress,
    payload,
    merchantContact,
    tokenAddress,
    tokenSymbol,
    amount
}: {
    processConfirmation: boolean,
    setProcessConfirmation: (_: boolean) => void,
    merchantAddress: string,
    payload: ethers.BigNumber,
    merchantContact: string,
    tokenAddress: string,
    tokenSymbol: string,
    amount: ethers.BigNumber
}) {
    const networkProvider = React.useContext(NetworkContext);
    const [connectWalletAndPayDrawer, setConnectWalletAndPayDrawer] = React.useState<boolean>(false);

    const payCallback = networkProvider.useContractPayCallback({
        to: merchantAddress,
        token: tokenAddress,
        amount: amount,
        payload: payload
    })

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
                            <dd>{merchantAddress}</dd>
                            <dt>Payload</dt>
                            <dd>{payload}</dd>
                            <dt>Seller contact</dt>
                            <dd>{merchantContact}</dd>
                            <dt>Network</dt>
                            <dd>{networkProvider.humanName()}</dd>
                            <dt>Token</dt>
                            <dd>{tokenAddress} ({tokenSymbol})</dd>
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
                            onClick={payCallback}
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

    const [processConfirmation, setProcessConfirmation] = React.useState<boolean>(false);

    const isWalletConnected = Network[selectedNetworkLabel].isWalletConnected();
    Network[selectedNetworkLabel].switchNetwork();

    const querySettings = useParseQueryStringSettings();

    const tokenPrices = useTokenPrices();

    const tokenPresets = Network[selectedNetworkLabel].tokenPresets();
    const acceptableTokens = tokenPresets.filter(
        elem => (
            querySettings?.settings?.tokens.find(
                pot => pot.symbol == elem.symbol && pot.chains.find(chain => chain === Network[selectedNetworkLabel].id())
            ) !== undefined
        )
    )

    const [selectedToken, setSelectedToken] = React.useState<string>(null);

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

    const tokenAmounts: any = {};
    querySettings?.settings?.tokens.forEach(elem => {
        if (elem.amount == "auto") {
            const token = acceptableTokens.find(pot => pot.symbol == elem.symbol)!;
            const price = tokenPrices(token.oracleAddress!, token.oracleChainId!);
            // TODO: cannot do auto price convertion

            const amount = ethers.BigNumber.from(
                querySettings?.settings?.amountInCents!
            ).mul(ethers.BigNumber.from(10).pow(24)).div(price!);
            console.log("SYN", amount)
            tokenAmounts[elem.symbol] = amount;
        } else {
            // TODO: if merchant's custom, add 18 esxp
            tokenAmounts[elem.symbol] = ethers.utils.parseUnits(elem.amount, 18);
        }
    });
    console.log("TA", tokenAmounts)

    return (
        <NetworkContext.Provider value={Network[selectedNetworkLabel]}>
            <Panel
                bordered
                shaded
                header={<PaymentHeader amount={querySettings?.settings?.amountInCents} payload={querySettings?.settings?.payload}/>}
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
                        acceptableTokens.map(
                            (elem) => ({ label: `${ethers.utils.formatUnits(tokenAmounts[elem.symbol], 18)} ${elem.symbol} (${elem.name})`, value: elem.symbol })
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
            <ConfirmPaymentDropdown
                processConfirmation={processConfirmation}
                setProcessConfirmation={setProcessConfirmation}
                merchantAddress={querySettings?.settings?.ethAddress}
                payload={querySettings?.settings?.payload}
                merchantContact={querySettings?.settings?.sellerContact}
                tokenAddress={acceptableTokens.find(elem => elem.symbol == selectedToken)?.address}
                tokenSymbol={selectedToken}
                amount={tokenAmounts[selectedToken]}
            />
        </NetworkContext.Provider>

    )
}
