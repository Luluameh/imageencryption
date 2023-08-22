import { Navbar, Container, Dropdown, DropdownButton } from 'react-bootstrap';
import axios from "axios";

function NavBar() {
    async function downloadFile(e) {
        try {
            const { name } = e.target;

            if (name === "e") {
                await axios.get(`/api/v1/download/${name}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Image Encryption</Navbar.Brand>
                <DropdownButton id="dropdown-basic-button" title="Download File">
                    <Dropdown.Item href="http://localhost:3001/api/v1/download/e">Download Encrypted File</Dropdown.Item>
                    <Dropdown.Item href="http://localhost:3001/api/v1/download/d">Download Decrypted File</Dropdown.Item>
                </DropdownButton>
            </Container>
        </Navbar>
    )
}

export default NavBar;