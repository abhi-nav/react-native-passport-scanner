import React from "react";
import ImagePicker, { Image } from "react-native-image-crop-picker";

type CropImageComponentType = {
	capturedPhotoUri: string;
	width: number;
	height: number;
	onDoneHandler: (image: Image) => void;
	onRetakeHandler: () => void;
};

const CropImageComponent: React.FC<CropImageComponentType> = ({
	capturedPhotoUri,
	width,
	height,
	onDoneHandler,
	onRetakeHandler,
}) => {
	console.log("width and height", width, height);

	ImagePicker.openCropper({
		cropping: true,
		path: capturedPhotoUri,
		width: width,
		height: height,
		// compressImageMaxWidth: 5,
		mediaType: "photo",
		freeStyleCropEnabled: true,
		cropperToolbarTitle: "Crop to the nearest text boundary",
		cropperCancelText: "Re Take",
		hideBottomControls: true,
		// cropperChooseText: "Choose text",
	})
		.then((image) => {
			onDoneHandler(image);
			console.log(image);
		})
		.catch((error) => {
			console.log("calling retake handler");
			onRetakeHandler();
			// console.log("Image Picker catched error", error);
		});

	// console.log("Preview Picture props width and height", width, height);
	return null;
};

export default CropImageComponent;
