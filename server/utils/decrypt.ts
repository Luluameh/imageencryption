import path from "path";
import fs from "fs";
import jimp from "jimp";

export const decrypt = async (filePath: string, keyPath: string) => {
	const image = await jimp.read(filePath);

	// get the image extension using jimp
	const extension = image.getExtension();

	// get the rgba values of the image
	const rgba = image.bitmap.data;

	// get the length of the rgba array
	const length = rgba.length;

	// get the base64 encoded key
	const key = fs.readFileSync(keyPath, "utf8");

	// decode the key
	const keyDecoded = Buffer.from(key, "base64");

	const keyArray = Array.from(keyDecoded);

	// loop through the rgba array
	for (let i = 0; i < length; i++) {
		const k = keyArray[i];
		rgba[i] = rgba[i] ^ k;
	}

	// save the image with _decrypted appended to the file name, mimeType and the new extension
	image.bitmap.data = rgba;

	const fileName = path
		.basename(filePath)

		// remove _encrypted from the file name if present
		.replace(/\_encrypted$/, "");

	// remove the extension from the file name
	const fileNameWithoutExtension = `${fileName.split(".")[0]}_decrypted`;
	const outputPath = path.join(
		__dirname,
		`../assets/${fileNameWithoutExtension}.${extension}`
	);

	await image.writeAsync(outputPath);

	fs.unlinkSync(filePath);
    fs.unlinkSync(keyPath);

	return { outputPath,  outputImageFileName: `${fileNameWithoutExtension}.${extension}`};
};
