import { Navbar, Nav } from "rsuite";
import CreativeIcon from '@rsuite/icons/Creative';

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
