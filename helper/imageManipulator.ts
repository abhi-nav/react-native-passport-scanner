import {
	ImageResult,
	manipulateAsync,
	SaveFormat,
} from "expo-image-manipulator";

import { MrzBox, PassportBox } from "../constants/PassportDimension";
import { HighlandImageBox } from "../constants/HighlandImageDimensions";
import { TakePictureResponse } from "react-native-camera";
import { Dimensions, ImageCropResponse } from "../types";
import { Image } from "react-native-image-crop-picker";
import * as FileSystem from "expo-file-system";
// import ImageResizer from "react-native-image-resizer";

export const getPassportImage = async (
	cameraCapturedPicture: TakePictureResponse
) => {
	const croppedHeight =
		(Number.parseInt(PassportBox.height) / 100) *
		cameraCapturedPicture!.height;
	const croppedWidth =
		(Number.parseInt(PassportBox.width) / 100) *
		cameraCapturedPicture!.width;

	const originX =
		(Number.parseInt(PassportBox.left) / 100) *
		cameraCapturedPicture!.width;
	const originY =
		(Number.parseInt(PassportBox.top) / 100) *
		cameraCapturedPicture!.height;

	// console.log(
	// 	"crop height, width, x, y",
	// 	croppedHeight,
	// 	croppedWidth,
	// 	originX,
	// 	originY
	// );

	const passportImage = await manipulateAsync(
		cameraCapturedPicture!.uri,
		[
			{
				crop: {
					width: croppedWidth,
					height: croppedHeight,
					originX: originX,
					originY: originY,
				},
			},
			{ resize: { width: 450, height: 800 } },
		],
		{ compress: 0.3, format: SaveFormat.JPEG }
	);
	// const resizedImage = await ImageResizer.createResizedImage(
	// 	passportImage.uri,
	// 	1200,
	// 	1200,
	// 	"JPEG",
	// 	1
	// );
	// ImageResizer
	console.log("Image Size", await FileSystem.getInfoAsync(passportImage.uri));
	console.log("Cache Directory", FileSystem.cacheDirectory);
	return passportImage;
};

export const getMrzImage = async (
	cameraCapturedPicture: TakePictureResponse,
	dimensions: Dimensions
) => {
	const croppedHeight =
		(Number.parseInt(MrzBox.height) / 100) * cameraCapturedPicture!.height;
	const croppedWidth =
		(MrzBox.width * cameraCapturedPicture!.width) / dimensions.width;
	const originX =
		(Number.parseInt(MrzBox.left) / 100) * cameraCapturedPicture!.width;
	const originY =
		(Number.parseInt(MrzBox.top) / 100) * cameraCapturedPicture!.height;

	// console.log(
	// 	"crop height, width, x, y",
	// 	croppedHeight,
	// 	croppedWidth,
	// 	originX,
	// 	originY
	// );

	const mrzImage = await manipulateAsync(
		cameraCapturedPicture!.uri,
		[
			{
				crop: {
					width: croppedWidth,
					height: croppedHeight,
					originX: originX,
					originY: originY,
				},
			},
		],
		{ compress: 1, format: SaveFormat.PNG }
	);
	return mrzImage;
};

export const getHighlandImage = async (
	cameraCapturedPicture: TakePictureResponse
) => {
	const croppedHeight =
		(Number.parseInt(HighlandImageBox.height) / 100) *
		cameraCapturedPicture!.height;
	const croppedWidth =
		(Number.parseInt(HighlandImageBox.width) / 100) *
		cameraCapturedPicture!.width;

	const originX =
		(Number.parseInt(HighlandImageBox.left) / 100) *
		cameraCapturedPicture!.width;
	const originY =
		(Number.parseInt(HighlandImageBox.top) / 100) *
		cameraCapturedPicture!.height;

	// console.log(
	// 	"crop height, width, x, y",
	// 	croppedHeight,
	// 	croppedWidth,
	// 	originX,
	// 	originY
	// );

	const highlandImage = await manipulateAsync(
		cameraCapturedPicture!.uri,
		[
			{
				crop: {
					width: croppedWidth,
					height: croppedHeight,
					originX: originX,
					originY: originY,
				},
			},
			{ resize: { width: 400, height: 400 } },
		],
		{ compress: 0.2, format: SaveFormat.JPEG }
	);
	return highlandImage;
};

export const rotateCroppedImage = async (
	image: ImageCropResponse,
	rotate: number = -90
) => {
	return await manipulateAsync(image!.uri, [{ rotate: rotate }], {
		compress: 1,
		format: SaveFormat.PNG,
	});
};

export const rotateImage = async (
	image: ImageResult,
	imageFormat: SaveFormat = SaveFormat.PNG,
	rotate: number = -90
) => {
	return await manipulateAsync(image!.uri, [{ rotate: rotate }], {
		compress: 1,
		format: imageFormat,
	});
};

export const getSignatureImage = async (base64Image: string) => {
	const signatureImage = await manipulateAsync(
		base64Image,
		[{ resize: { width: 400, height: 400 } }],
		{ compress: 1, format: SaveFormat.JPEG }
	);
	console.log(
		"Signature Image",
		await FileSystem.getInfoAsync(signatureImage.uri)
	);

	return signatureImage;
};
