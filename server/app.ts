import http from "http";
import express from "express";
import cors from "cors";
import WebSocket, { WebSocketServer } from "ws";

import decryptController from "./controller/decryptController";
import encryptController from "./controller/encryptController";
import downloadController from "./controller/downloadController";
import imgUpload from "./middlewares/uploadImg";

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

app.post("/api/v1/encrypt", imgUpload, encryptController);
app.post("/api/v1/decrypt", imgUpload, decryptController);
app.get("/api/v1/download/:downloadType", downloadController);

const wss = new WebSocketServer({ server });

interface SocketMessage { type: "file", size: number, name: string, mimeType: string };

wss.on('connection', (ws) => {
    ws.on('message', (data) => {
        const { type, size, name, mimeType } = JSON.parse(data.toString()) as SocketMessage;

        if (type === "file") {
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: "file", size, name, mimeType }));
                }
            });
        }
    });
});

const PORT = 3001;

server.listen(PORT, () => console.log(`Server listening at port ${PORT}`));