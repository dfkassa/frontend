import NavigationView from "@/components/Navigation";
import useLauncher from "@/hooks/useLauncher";
import React from "react";
import CodeIcon from "@rsuite/icons/Code";
import PeoplesIcon from "@rsuite/icons/Peoples"
import DetailIcon from "@rsuite/icons/Detail"
import { Button, ButtonGroup, Form, IconButton, Panel, SelectPicker, Stack } from "rsuite";
import { DFKASSA_PROVIDERS, TOKEN_LOGO } from "../provider";
import { BaseDFKassaProvider } from "@/provider/base";
import { Web3Button } from "@web3modal/react";
import { PaymentHeader } from "@/components/pay/PaymentViewHeader";
import { Polygon } from "@thirdweb-dev/chain-icons";
import { ConfirmPaymentDropdown } from "@/components/pay/ConfirmPaymentDropdown";

export default function Pay() {
    const launch = useLauncher();
    const [selectedNetwork, setSelectedNetwork] = React.useState<string>();
    const [selectedToken, setSelectedToken] = React.useState<string>();
    const [isWalletConnected, setIsWalletConnected] = React.useState<boolean>();
    const [processConfirmation, setProcessConfirmation] = React.useState<boolean>(false);

    if (!launch) {
        return <>Loading</>
    } else if (launch.isError) {
        return <>Cannot load page {launch.result}</>
    }

    if (!selectedNetwork) {
        setSelectedNetwork(launch.result.networks[0].id);
    }
    if (!selectedToken) {
        setSelectedToken(launch.result.tokens[0].address);
    }

    const provider: BaseDFKassaProvider | undefined = DFKASSA_PROVIDERS[selectedNetwork!];
    provider?.addWalletConnectionCallback(isWalletConnected, setIsWalletConnected)
    provider?.switchNetwork();
    console.log(launch.result.networks)

    return (
        <>
            <NavigationView />
            <div style={{ display: "flex", justifyContent: "center",  width: "100%" }}>
                <Panel
                    bordered
                    shaded
                    style={{
                        maxWidth: 600,
                        margin: 10,
                    }}
                    header={<PaymentHeader launch={launch.result} />}
                >
                    <p>
                        Confirm payment using one of this currencies & networks
                    </p>
                    <br />
                    <SelectPicker
                        label="Network"
                        data={
                            launch.result.networks.map(network => ({
                                label: <div style={{display: "flex", padding: 3}}>{ DFKASSA_PROVIDERS[network.id].networkIcon() }&nbsp;{ network.name }</div>,
                                value: network.id
                            }))
                        }
                        value={selectedNetwork}
                        style={{ width: "100%" }}
                        onChange={(value, _) => setSelectedNetwork(value!)}
                        cleanable={false}
                    />
                    <Form.HelpText style={{ marginTop: 5 }}>&nbsp;Select prefered network to pay</Form.HelpText>
                    <br />
                    <SelectPicker
                        label="Currency"
                        data={
                            launch.result.tokens
                            .filter(token => token.network_id == selectedNetwork)
                            .map(
                                token => ({
                                    label: <div style={{display: "flex", padding: 3}}>{ TOKEN_LOGO[token.symbol] }&nbsp;{ token.name } ({token.symbol})</div>,
                                    value: token.address
                                })
                            )
                        }
                        value={selectedToken}
                        onChange={(value, _) => {
                            setSelectedToken(value!);
                        }}
                        cleanable={false}
                        style={{ width: "100%" }}
                    />
                    <Form.HelpText style={{ marginTop: 5 }}>&nbsp;Select prefered currency to pay</Form.HelpText>
                    <br />
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {provider?.connectWalletButton()}
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
            </div>
            <ConfirmPaymentDropdown processConfirmation={processConfirmation} setProcessConfirmation={setProcessConfirmation} launch={launch.result} networkProvider={provider} />
            <footer>
                <hr />
                <Stack justifyContent="space-around" style={{color: "rgba(255, 255, 255, 0.75)"}}>
                    <Stack.Item>
                        <p><CodeIcon />&nbsp;<a href="https://github.com/dfkassa/frontend" style={{color: "rgba(255, 255, 255, 0.75)"}}>Source code</a></p>
                    </Stack.Item>
                    <Stack.Item>
                        <p><PeoplesIcon />&nbsp;Support</p>
                    </Stack.Item>
                </Stack>
            </footer>
        </>
    );
}
