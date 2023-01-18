import { Navbar, Nav, Stack } from "rsuite";
import CodeIcon from '@rsuite/icons/Code';
import CreativeIcon from '@rsuite/icons/Creative';
import PeoplesIcon from '@rsuite/icons/Peoples';

export default function NavigationView() {
    return (
        <Navbar>
            <Nav>
                <Nav.Item>
                    <CreativeIcon style={{
                        paddingBottom: 4,
                        fontSize: 23,
                        color: "#fac273" // "#34c3ff"
                    }}
                    />&nbsp;<span style={{color: "white"}}>What is DFKassa?</span>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
}
