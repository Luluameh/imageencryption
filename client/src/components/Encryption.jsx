import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";

import ModalCom from "./Modal";

function Encrytion() {
    const [formData, setFormData] = useState({
        encryptionType: "",
        image: null,
        key: null
    });
    const [emptyEncryptionType, setEmptyEncryptionType] = useState(false);
    const [emptyEncryptionImage, setEmptyEncryptionImage] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState({title: "", msg: ""});
    const [loading, setLoading] = useState(false);


    function toggleModal() {
        setShowModal(preShowModal => preShowModal ? false : true);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        let theValue = value;
        if (name === "image" || name === "key")
            theValue = e.target.files[0];
        setFormData(prevForm => {
            return {
                ...prevForm,
                [name]: theValue
            }
        });
    }

    async function uploadImage(e) {
        try {
            e.preventDefault();
            setEmptyEncryptionType(false);
            setEmptyEncryptionImage(false);

            if (formData.encryptionType === "") {
                setEmptyEncryptionType(true);
                return;
            }

            if (!formData.image) {
                setEmptyEncryptionImage(true);
                return;
            }
            setLoading(true);

            let url = "http://localhost:3001/api/v1/encrypt";
            if (formData.encryptionType === "d") {
                url = "http://localhost:3001/api/v1/decrypt";
            }
            const myFormData = new FormData();
            myFormData.append("image", formData.image);
            if (formData.encryptionType === "d")
                myFormData.append("key", formData.key);

            const { data } = await axios.post(url, myFormData);

            setModalInfo({
                title: "Success",
                msg: data.msg
            });
            toggleModal();
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }

    }

    return (
        <>
            <Form onSubmit={uploadImage}>
                <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>Encryption Type</Form.Label>
                    <Form.Control as="select" size="lg" name="encryptionType" value={formData.encryptionType} onChange={handleChange}>
                        <option value={""} disabled>--Select Encryption Type--</option>
                        <option value={"e"}>Encrypt</option>
                        <option value={"d"}>Decrypt</option>
                    </Form.Control>
                    {emptyEncryptionType && <Alert variant="danger" className="mt-2">Please select an encryption type.</Alert>}
                </Form.Group>
                <Form.Group>
                    <Form.Label>Select Image</Form.Label>
                    <Form.Control type="file" name="image" onChange={handleChange} />
                    {emptyEncryptionImage && <Alert variant="danger" className="mt-2">Please select an image File.</Alert>}
                </Form.Group>
                {formData.encryptionType === "d" && <Form.Group>
                    <Form.Label>Select Key</Form.Label>
                    <Form.Control type="file" name="key" onChange={handleChange} />
                    {emptyEncryptionImage && <Alert variant="danger" className="mt-2">Please select an key File.</Alert>}
                </Form.Group>}

                <Button type="submit" className="mt-2">{loading ? "Encrypting..." : "Encrypt"}</Button>
            </Form>

            <ModalCom 
                showModal={showModal}
                toggleModal={toggleModal} 
                title={modalInfo.title}
            >
                <p>{modalInfo.msg}</p>
            </ModalCom>
        </>
    );
}

export default Encrytion;