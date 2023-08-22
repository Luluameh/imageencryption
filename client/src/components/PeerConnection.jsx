import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import ModalCom from "./Modal";
import Send from "./PeerConnection/Send";
import Receive from "./PeerConnection/Receive";

function PeerConnection() {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [showSend, setShowSend] = useState(false);

    function toggleModal(e) {
        if (!showModal) {
            setModalTitle(e.target.dataset.btn);
            
            if (e.target.dataset.btn === "Receive") {
                setShowSend(false);
            } else {
                setShowSend(true);
            }
        }

        setShowModal((_prev) => !_prev);
    }

    return (
        <>
            <div className="d-flex justify-content-around mx-auto mt-3" style={{width: "40%"}}>
                <Button variant="success" data-btn="Send" onClick={toggleModal}>Send</Button>
                <Button variant="success" data-btn="Receive" onClick={toggleModal}>Receive</Button>
            </div>
            <ModalCom showModal={showModal} toggleModal={toggleModal} title={modalTitle}>
                {showSend ? <Send /> : <Receive />}
            </ModalCom>
        </>
    );
}


export default PeerConnection;