import React, { useEffect, useState, useRef } from "react";
import { Button, Overlay, Tooltip } from "react-bootstrap";
import { QRCodeSVG } from "qrcode.react";
import { useConnection } from "../../context/ConnectionProvider";
import FileTransfer from "./FileTransfer";

function Receive() {
  const [iceCandidate, setIceCandidate] = useState("");
  const [showToolTips, setShowToolTips] = useState(false);
  const target = useRef(null);

  const {
    connected,
    peerConnection,
    setRtcPeerConnection,
    setDataChannel,
    disconnect,
  } = useConnection();

  useEffect(() => {
    function startWebRTC() {
      setRtcPeerConnection();

      peerConnection.ondatachannel = (e) => {
        setDataChannel(e.channel);
      };

      peerConnection.onicecandidate = (e) => {
        const _iceCandidate = JSON.stringify(peerConnection.localDescription);
        setIceCandidate(_iceCandidate);
      };
    }

    startWebRTC();

    return () => {
      console.log("bye");
      disconnect();
    };
  }, []);

  function enterSenderOffer() {
    const offer = prompt("Enter Sender's Offer");

    const des = new RTCSessionDescription(JSON.parse(offer));
    peerConnection.setRemoteDescription(des).then(() => {
      console.log("offer set");
      peerConnection
        .createAnswer()
        .then((answer) => {
          peerConnection.setLocalDescription(answer);
          console.log("Answer created");
        })
        .catch((error) => {
          console.error("Error creating answer:", error);
        });
    });
  }

  function copyText() {
    navigator.clipboard.writeText(iceCandidate);
    setShowToolTips(true);

    setTimeout(() => {
      setShowToolTips(false);
    }, 3000);
  }

  return (
    <>
      {connected ? (
        <FileTransfer send={null} />
      ) : (
        <>
          {iceCandidate === "" ? (
            <Button onClick={enterSenderOffer}>Enter Sender's Offer</Button>
          ) : (
            <>
              <QRCodeSVG
                value={iceCandidate}
                size="400"
                style={{ width: "100%" }}
              />
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
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default Receive;
