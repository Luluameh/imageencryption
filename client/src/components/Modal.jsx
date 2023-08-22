import { Modal, Button, Badge } from "react-bootstrap";
import { useConnection } from "../context/ConnectionProvider";

function ModalCom(props) {
    const { connected } = useConnection();
    return (
        <Modal show={props.showModal} onHide={props.toggleModal} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>
                    {props.title}
                    <Badge pill className={"ms-3 badge " + (connected ? "bg-success" : "bg-danger")}>
                        {connected ? "Connected" : "Disconnected"}
                    </Badge>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.children}</Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.toggleModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalCom;
