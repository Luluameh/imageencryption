import path from "path";
import fs from "fs";
import jimp from "jimp";

export const encrypt = async (fullPath: string) => {
	// get the base name of the file
	const fileName = path.basename(fullPath);

	// remove the extension from the file name
	const fileNameWithoutExtension = fileName.split(".")[0];

	const image = await jimp.read(fullPath);

	// get the image extension using jimp
	const extension = image.getExtension();
	const outputImageFileName = `${fileNameWithoutExtension}_encrypted.${extension}`;
	const outputKeyFileName = `${fileNameWithoutExtension}_key.txt`;

	// get the rgba values of the image
	const rgba = image.bitmap.data;

	// get the length of the rgba array
	const length = rgba.length;

	const key: [number] = [0];
	for (let i = 0; i < length; i++) {
		key[i] = (Math.floor(Math.random() * 256));
	}

	await new Promise<void>((resolve) => {
		for (let i = 0; i < length; i++) {
			const k = key[i];
			rgba[i] = rgba[i] ^ k;
		}

		// save the image with _encrypted appended to the file name, mimeType and the new extension
		image.bitmap.data = rgba;
		resolve();
	});

	const outputImagePath = path.join(__dirname, `../assets/${outputImageFileName}`);
	const outputKeyPath = path.join(__dirname, `../assets/${outputKeyFileName}`);

	await image.writeAsync(outputImagePath);

	fs.writeFileSync(outputKeyPath, Buffer.from(key).toString('base64'));
	fs.unlinkSync(fullPath);

	return { 
		outputImagePath, 
		outputKeyPath, 
		outputImageFileName, 
		outputKeyFileName
	};
};
