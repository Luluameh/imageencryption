import { useEffect, useState, useRef } from "react";
import { Button, Overlay, Tooltip } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import { useConnection } from "../../context/ConnectionProvider";
import FileTransfer from "./FileTransfer";

function Send() {
  const [iceCandidate, setIceCandidate] = useState("");
  const [showToolTips, setShowToolTips] = useState(false);
  const target = useRef(null);

  const {
    connected,
    peerConnection,
    setRtcPeerConnection,
    disconnect
  } = useConnection();

  useEffect(() => {
    function startWebRTC() {
      if (peerConnection) {
        peerConnection.onicecandidate = (e) => {
          if (e.candidate) {
            const _iceCandidate = JSON.stringify(peerConnection.localDescription);
            setIceCandidate(_iceCandidate);
          }
        };

        peerConnection.createOffer()
          .then((offer) => {
            return peerConnection.setLocalDescription(offer);
          })
          .then(() => {
            console.log("offer set");
          })
          .catch((error) => {
            console.error("Error creating offer:", error);
          });
      }
    }

    startWebRTC();

    return () => {
      console.log("bye");
      disconnect();
    };
  }, [peerConnection]);

  function copyText() {
    navigator.clipboard.writeText(iceCandidate);
    setShowToolTips(true);

    setTimeout(() => {
      setShowToolTips(false);
    }, 3000);
  }

  function enterReceiverAnswer() {
    const answer = prompt("Enter Receiver Answer");

    if (answer) {
      const des = new RTCSessionDescription(JSON.parse(answer));
      console.log(peerConnection);
      peerConnection.setRemoteDescription(des);
    }
  }

  function sendFile() {
    // Implement your send file functionality here
    e.preventDefault();
    console.log(file);
    sendFile(file);

  }

  return (
    <>
      {connected ? (
        <FileTransfer send={sendFile} />
      ) : (
        <>
          {iceCandidate !== "" && (
            <QRCodeSVG
              value={iceCandidate}
              size="400"
              style={{ width: "100%" }}
            />
          )}
          <div className="mt-3 d-flex justify-content-evenly">
            <Button ref={target} onClick={copyText}>
              Copy
            </Button>
            <Overlay
              target={target.current}
              show={showToolTips}
              placement="right"
            >
              {(props) => (
                <Tooltip id="overlay-example" {...props}>
                  Copied!
                </Tooltip>
              )}
            </Overlay>
            <Button onClick={enterReceiverAnswer}>Enter Receiver Answer</Button>
          </div>
        </>
      )}
    </>
  );
}

export default Send;
