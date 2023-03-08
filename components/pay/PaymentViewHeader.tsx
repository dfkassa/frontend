import { ButtonGroup, Drawer, IconButton, Panel, Stack } from "rsuite";
import CodeIcon from "@rsuite/icons/Code";
import PeoplesIcon from "@rsuite/icons/Peoples";
import DetailIcon from "@rsuite/icons/Detail";
import React from "react";


export function PaymentDetailsDrawer({
    open,
    setOpen,
    launch,
    ...props
}: {
    open: boolean,
    setOpen: (_: boolean) => void,
    launch: import("wasm").LaunchOutput
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
                            <dt>Payload</dt>
                            <dd>{launch.payload}</dd>
                            <dt>Seller contact</dt>
                            <dd>{launch.contact}</dd>
                        </dl>
                    </Panel>
                </Drawer.Body>
            </Drawer>
        </>
    )
}

export function PaymentHeader({
    launch,
    ...props
}: {
    launch: import("wasm").LaunchOutput
}) {
    const [detailesDrawerOpened, setDetailesDrawerOpened] = React.useState(false);
    return (
        <>
            <Stack
                justifyContent="space-between"
            >
                <Stack.Item>
                    <h2>$3.14</h2>
                </Stack.Item>
                <Stack.Item>
                    <ButtonGroup>
                        <IconButton onClick={() => setDetailesDrawerOpened(true)} icon={<DetailIcon />}>Details</IconButton>
                    </ButtonGroup>
                </Stack.Item>
            </Stack>
            <PaymentDetailsDrawer
                setOpen={setDetailesDrawerOpened}
                open={detailesDrawerOpened}
                launch={launch}
            />
        </>
    )
}
