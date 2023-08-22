import { Container, Alert } from "react-bootstrap";
import NavBar from "./components/NavBar"
import 'bootstrap/dist/css/bootstrap.min.css';
import Encrytion from "./components/Encryption";
//import PeerConnection from "./components/PeerConnection";
import { ConnectionProvider } from "./context/ConnectionProvider";

function App() {
  return (
    <div className="App">
      <NavBar />
      <Container>
        <Alert variant="primary" className="mt-2 text-center">
          Select an Image to encrypt!
        </Alert>
        <ConnectionProvider>
          <Encrytion />
        {/*  <PeerConnection />*/}
        </ConnectionProvider>
      </Container>
    </div>
  )
}

export default App
