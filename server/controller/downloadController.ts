import { join } from "path";
import { existsSync } from "fs";
import { Request, Response } from "express";

const downloadController = (req: Request, res: Response) => {
    const { downloadType } = req.params;

    if (downloadType === "e") {
        const filePath = join(__dirname, "../assets/encrypted file.zip")

        if (existsSync(filePath)) {
            res.download(filePath);
            return;
        }

        res.status(404).json({status: "File not found", msg: "No Files have be encrypted"});
        return;
    }

    const filePath = join(__dirname, "../assets/decrypted file.zip");

    if (existsSync(filePath)) {
        res.download(filePath);
        return;
    }

    res.status(404).json({status: "File not found", msg: "No Files have be decrypted"});
};

export default downloadController;
