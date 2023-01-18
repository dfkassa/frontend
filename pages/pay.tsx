import NavigationView from "@/components/Navigation";
import PayView from "@/components/PayView";
import { Panel, Nav, Stack } from "rsuite";
import CodeIcon from '@rsuite/icons/Code';
import CreativeIcon from '@rsuite/icons/Creative';
import PeoplesIcon from '@rsuite/icons/Peoples';

export default function Pay() {

    return (
        <>
            <NavigationView />
            <div style={{ display: "flex", justifyContent: "center",  width: "100%" }}>
                <PayView />
            </div>
            <footer>
                <hr />
                <Stack justifyContent="space-around" style={{color: "rgba(255, 255, 255, 0.75)"}}>
                    <Stack.Item>
                        <p><CodeIcon />&nbsp;Source code</p>
                    </Stack.Item>
                    <Stack.Item>
                        <p><PeoplesIcon />&nbsp;Support</p>
                    </Stack.Item>
                </Stack>
            </footer>
        </>
    );
}
