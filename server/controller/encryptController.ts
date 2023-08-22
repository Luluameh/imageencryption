import { unlinkSync, createWriteStream, readFileSync } from "fs";
import { join } from "path";
import { Request, Response } from "express";
import JSZip from "jszip";

import { encrypt } from "../utils/encrypt";

const encryptController = async (req: Request, res: Response) => {
	try {
		if (!req.file)
			return res.status(422).json({ status: "Error", msg: "No Image" });

		const { outputImagePath, outputKeyPath, outputImageFileName, outputKeyFileName } = await encrypt(req.file.path);
		const zip = new JSZip();

		const imageData = readFileSync(outputImagePath);
		const keyData = readFileSync(outputKeyPath);
		zip.file(outputImageFileName, imageData);
		zip.file(outputKeyFileName, keyData);

		zip
			.generateNodeStream({ type: "nodebuffer", streamFiles: true })
			.pipe(createWriteStream(join(__dirname, "../assets/encrypted file.zip")))
			.on('finish', function () {
				unlinkSync(outputImagePath);
				unlinkSync(outputKeyPath);
			});

		res.json({ status: "OK", msg: "Encryped Image successfully" });
	} catch (error) {
		console.log(error);
		res.status(422).json({ status: "Error", msg: "An error occured" });
	}
};

export default encryptController;
