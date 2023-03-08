import NavigationView from "@/components/Navigation";
import useLauncher from "@/hooks/useLauncher";
import React from "react";
import CodeIcon from "@rsuite/icons/Code";
import PeoplesIcon from "@rsuite/icons/Peoples"
import DetailIcon from "@rsuite/icons/Detail"
import { ButtonGroup, Form, IconButton, Panel, SelectPicker, Stack } from "rsuite";
import { DFKASSA_PROVIDERS } from "../provider";
import { BaseDFKassaProvider } from "@/provider/base";
import { Web3Button } from "@web3modal/react";

export default function Pay() {
    const launch = useLauncher();
    const [selectedNetwork, setSelectedNetwork] = React.useState<string>();
    const [selectedToken, setSelectedToken] = React.useState<string>();

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
                    header={
                        <Stack
                            justifyContent="space-between"
                        >
                            <Stack.Item>
                                <h2>$3.14</h2>
                            </Stack.Item>
                            <Stack.Item>
                                <ButtonGroup>
                                    <IconButton icon={<DetailIcon />}>Details</IconButton>
                                </ButtonGroup>
                            </Stack.Item>
                        </Stack>
                    }
                >
                    <p>
                        Confirm payment using one of this currencies & networks
                    </p>
                    <br />
                    <SelectPicker
                        label="Network"
                        data={
                            launch.result.networks.map(network => ({
                                label: network.name,
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
                                    label: token.name,
                                    value: token.address
                                })
                            )
                        }
                        value={selectedToken}
                        onChange={(value, _) => setSelectedToken(value!)}
                        cleanable={false}
                        style={{ width: "100%" }}
                    />
                    <Form.HelpText style={{ marginTop: 5 }}>&nbsp;Select prefered currency to pay</Form.HelpText>
                    <br />
                    <div style={{display: "flex", justifyContent: "center"}}>
                        {provider?.connectWalletButton()}
                    </div>
                    <hr />
                </Panel>
            </div>
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
