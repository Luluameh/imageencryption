import { unlinkSync, createWriteStream, readFileSync } from "fs";
import { join } from "path";
import { Request, Response } from "express";
import JSZip from "jszip";

import { decrypt } from "../utils/decrypt";

const decryptController = async (req: Request, res: Response) => {
	try {
		if (!req.files)
			return res.status(422).json({ status: "Error", msg: "No Image" });

			console.log(req.files)
		const encryptedImagePath = (req.files as any).image[0].path;
		const keyPath = (req.files as any).key[0].path;

		const { outputPath, outputImageFileName } = await decrypt(encryptedImagePath, keyPath);

		const imageData = readFileSync(outputPath);
		const zip = new JSZip();

		zip.file(outputImageFileName, imageData);

		zip.generateNodeStream({type: "nodebuffer", streamFiles: true})
		.pipe(createWriteStream(join(__dirname, "../assets/decrypted file.zip")))
		.on('finish', function () {
			unlinkSync(outputPath);
		});

		res.json({ status: "OK", msg: "Decrytped Image successfully" });
	} catch (error) {
		console.log(error);
		res.status(422).json({ status: "Error", msg: "An error occured" });
	}
};

export default decryptController;
