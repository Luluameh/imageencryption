import { createContext, useContext, useState, useEffect } from "react";

const ConnectionContext = createContext();

export function useConnection() {
  return useContext(ConnectionContext);
}

export function ConnectionProvider({ children }) {
  const [peerConnection, setPeerConnection] = useState(null);
  const [dataChannel, setDataChannel] = useState(null);
  const [connected, setConnected] = useState(false);

  const [receiveBuffer, setReceiveBuffer] = useState([]);
  const [receiveFileSize, setReceiveFileSize] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileMimeType, setFileMimeType] = useState("");
  const [socket, setSocket] = useState(new WebSocket("ws://localhost:3001"));

  socket.onopen = () => {
    console.log("Websocket Connected successfully");
  };

  socket.onmessage = ({ data }) => {
    const parsedData = JSON.parse(data);
    console.log(parsedData);

    if (parsedData.type === "file") {
      setFileSize(parsedData.size);
      setFileName(parsedData.name);
      setFileMimeType(parsedData.mimeType);
    }
  };
  socket.onerror = () => {
    console.log("Websocket error");
  };

  useEffect(() => {
    if (peerConnection !== null) {
      setDataChannel(peerConnection.createDataChannel("channel"));
    }
  }, [peerConnection]);

  useEffect(() => {
    if (dataChannel !== null) {
      dataChannel.binaryType = "arraybuffer";
      dataChannel.onopen = (e) => {
        console.log("Connection opened");
        setConnected(true);
      };

      dataChannel.onclose = (e) => {
        console.log("Connection Closed");
        setConnected(false);
      };

      dataChannel.onmessage = (e) => {
        const { data } = e;
        console.log(data);

        setReceiveBuffer((_preReceiveBuffer) => [..._preReceiveBuffer, data]);
        setReceiveFileSize((_preReceiveSize) => _preReceiveSize + data.byteLength);

        if (receiveFileSize === fileSize) {
          const received = new Blob(receiveBuffer, {type: fileMimeType});
          setReceiveBuffer([]);
          setReceiveFileSize(0);
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(received);
          downloadLink.download = fileName;
          downloadLink.click();
        }
      };
    }
  }, [dataChannel]);

  function setRtcPeerConnection() {
    setPeerConnection(new RTCPeerConnection());
  }

  // function setDataChannel(value) {
  //   dataChannel = value;
  // }

  // function initDataChannel() {
  //   dataChannel = peerConnection.createDataChannel("channel");
    
  // }

  function sendSignalData(file) {
    console.log(socket);
    const msg = { type: "file", size: file.size, name: file.name, mimeType: file.type };
    socket.send(JSON.stringify(msg));
  }

  function disconnect() {
    dataChannel.close();
    setDataChannel(null);
    peerConnection.close();
    setPeerConnection(null);
  }

  function sendFile(file) {
    console.log(dataChannel);
    dataChannel.send(`File Size: ${file.size}`);
    return;
    let offset = 0;
    const chunkSize = 16384;

    const reader = new FileReader();

    reader.addEventListener("error", (error) =>
      console.error("Error reading file:", error)
    );
    reader.addEventListener("abort", (e) =>
      console.log("File reading aborted:", e)
    );

    reader.addEventListener("load", (e) => {
      console.log(e.target.result);
      dataChannel.send(e.target.result);
      offset += e.target.result.byteLength;
      if (offset < file.size) {
        readSlice(offset);
      }
    });

    const readSlice = (o) => {
      console.log("readSlice ", o);
      const slice = file.slice(offset, o + chunkSize);
      reader.readAsArrayBuffer(slice);
    };

    readSlice(0);
  }

  function receiveFile() {}

  return (
    <ConnectionContext.Provider
      value={{
        connected,
        setConnected,
        peerConnection,
        setPeerConnection,
        setRtcPeerConnection,
        setDataChannel,
        disconnect,
        sendFile,
        sendSignalData,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}
