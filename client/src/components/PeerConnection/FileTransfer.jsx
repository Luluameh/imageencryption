import { Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useConnection } from "../../context/ConnectionProvider";

function FileTransfer(props) {
  const { sendFile, sendSignalData } = useConnection();

  const [file, setFile] = useState(null);
  function fileChangeHandler(e) {
    setFile(e.target.files[0]);
    sendSignalData(e.target.files[0]);
  }

  function send(e) {
    e.preventDefault();
    console.log(file);
    sendFile(file);
  }

  return (
    <Form onSubmit={send}>
      <Form.Group>
        <Form.Label>File</Form.Label>
        <Form.Control type="file" accept=".zip" onChange={fileChangeHandler} />
        <Form.Text className="text-muted">Select Encrypted zip file.</Form.Text>

        <Button type="submit" variant="success" className="ms-3">
          Send
        </Button>
      </Form.Group>
    </Form>
  );
}

export default FileTransfer;
