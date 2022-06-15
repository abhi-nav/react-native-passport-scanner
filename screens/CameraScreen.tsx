import {
	StyleSheet,
	View,
	LayoutChangeEvent,
	PermissionsAndroid,
} from "react-native";

import React, { useEffect, useState } from "react";

import { RNCamera as Camera, TakePictureResponse } from "react-native-camera";

import CameraComponent from "../components/CameraComponent";
import PreviewPictureComponent from "../components/PreviewPictureComponent";

import {
	getPassportImage,
	getMrzImage,
	rotateCroppedImage,
	rotateImage,
} from "../helper/imageManipulator";
// import * as FileSystem from "expo-file-system";
import RNTesseractOcr, {
	LANG_ENGLISH,
	LANG_OCRB,
	LANG_OCRB_LITE,
	LANG_PASSPORT,
	useEventListener,
} from "react-native-tesseract-ocr";

import { parseMrz } from "../helper/mrz";
import { Result } from "mrz";
import { Image as CropImage } from "react-native-image-crop-picker";
import {
	Dimensions as Dimensions_,
	ImageCropResponse,
	OCR_STATUS,
	StackScreenProps,
	STATUSES,
} from "../types";
import { ImageResult, SaveFormat } from "expo-image-manipulator";
import Loader from "../components/MainLoaderComponent";
import PermissionNotAllowedComponent from "../components/PermissionNotAllowedComponent";
import CropImageComponent from "../components/CropImageComponent";
import { createUserPassportPartial } from "../helper/passport";
import { useAppDispatch } from "../app/hooks";
import {
	addUserPassport,
	setIsBusy,
	setLoading,
} from "../app/user-passports/userPassportsSlice";
import {
	clearCacheCameraDirectory,
	clearImageFromUri,
} from "../helper/clearImage";

const CameraScreen = ({ navigation }: StackScreenProps<"Camera">) => {
	const [hasCameraPermission, setHasCameraPermission] = useState<boolean>();
	const [hasStoragePermission, setHasStoragePermission] =
		useState<boolean>(false);
	const [startCamera, setStartCamera] = useState<boolean>();
	const [capturedPhoto, setCapturedPhoto] = useState<TakePictureResponse>();

	const [passportPhoto, setPassportPhoto] = useState<ImageResult>();
	const [passportPhotoRotated, setPassportPhotoRotated] =
		useState<ImageResult>();

	const [mrzPhoto, setMrzPhoto] = useState<ImageResult>();
	const [mrzPhotoRotated, setMrzPhotoRotated] = useState<ImageResult>();

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [ocrProgress, setOcrProgress] = useState<number>(0);

	const [ocrStatus, setOcrStatus] = useState<OCR_STATUS>(STATUSES.IDLE);

	const [dimensions, setDimensions] = useState<Dimensions_>({
		width: 0,
		height: 0,
	});

	const dispatch = useAppDispatch();

	useEventListener("onProgressChange", (p) => {
		setOcrProgress(p.percent);
	});

	useEffect(() => {
		(async () => {
			const storageGranted = await PermissionsAndroid.request(
				"android.permission.WRITE_EXTERNAL_STORAGE"
			);

			setHasStoragePermission(
				storageGranted === PermissionsAndroid.RESULTS.GRANTED
			);

			const cameraGranted = await PermissionsAndroid.request(
				"android.permission.CAMERA"
			);

			setHasCameraPermission(
				cameraGranted === PermissionsAndroid.RESULTS.GRANTED
			);
		})();
	}, []);

	const retakePhotoHandler = async () => {
		// setIsLoading(true);
		if (mrzPhoto) {
			clearImageFromUri(mrzPhoto.uri);
			setMrzPhoto(undefined);
		}

		setCapturedPhoto(undefined);

		if (passportPhoto) {
			clearImageFromUri(passportPhoto.uri);
			setPassportPhoto(undefined);
		}

		setOcrStatus(STATUSES.IDLE);
		setOcrProgress(0);
		setIsLoading(false);
	};

	const runOcr = async (imagePath: string) => {
		try {
			const text = await RNTesseractOcr.recognize(
				imagePath,
				// LANG_ENGLISH,
				LANG_OCRB,
				{
					allowlist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<",
				}
			);
			return text;
		} catch (error) {
			console.log("ocr error catched", error);
		}
	};

	const onCapturePhoto = async (
		cameraCapturedPicture: TakePictureResponse
	) => {
		setIsLoading(true);
		dispatch(setIsBusy(true));
		setCapturedPhoto(cameraCapturedPicture);
		const passportImage = await getPassportImage(cameraCapturedPicture);
		const mrzImage = await getMrzImage(cameraCapturedPicture, dimensions);
		// setPassportPhoto(passportImage);
		setMrzPhoto(mrzImage);

		const rotatedMrzImage = await rotateImage(mrzImage);

		const rotatedPassportImage = await rotateImage(
			passportImage,
			SaveFormat.JPEG
		);

		setPassportPhotoRotated(rotatedPassportImage);

		// clearing Image
		// clearImageFromUri(passportPhoto!.uri);

		setMrzPhotoRotated(rotatedMrzImage);

		// console.log("rotatedPassportImage...", rotatedPassportImage);
		// console.log("passportPhotoRotated...", passportPhotoRotated);

		await doneHandler(rotatedMrzImage, rotatedPassportImage);
		// console.log("cropped passport Image", passportImage);
		// console.log("cropped passport mrz", mrzImage);

		// console.log(
		// 	"Passpor Size, Mrz Size",
		// 	await FileSystem.getInfoAsync(passportImage.uri),
		// 	await FileSystem.getInfoAsync(mrzImage.uri)
		// );
	};

	const layoutHandler = (event: LayoutChangeEvent) => {
		let { width, height } = event.nativeEvent.layout;
		console.log(
			"on layout handler called .. width, height ",
			width,
			height
		);
		width = width * 1;
		setDimensions({ width: width, height: width * (16 / 9) });
		// console.log(event.nativeEvent.layout);
	};

	if (!hasStoragePermission || !hasCameraPermission) {
		return <PermissionNotAllowedComponent />;
	}

	const cropDoneHandler = async (mrzImage: ImageCropResponse) => {
		const rotatedImage = await rotateCroppedImage(mrzImage);
		// console.log("rotateImage", rotatedImage);
		doneHandler(rotatedImage);
	};

	const doneHandler = async (
		mrzImage: ImageResult,
		rotatedPassportImage?: ImageResult
	) => {
		try {
			// setOcrStatus(STATUSES.IDLE);
			if (!isLoading) setLoading(true);
			setOcrStatus(STATUSES.PENDING);
			const text = await runOcr(mrzImage.uri);
			// setIsLoading(false);
			// console.log("OCR OUTPUT", JSON.stringify(text));

			if (!text) {
				console.log("No Text to recognize");
				setOcrStatus(STATUSES.FAILED);
				retakePhotoHandler();
				return;
			}

			const result = parseMrz(text);

			if (!result || !result.valid) {
				setOcrStatus(STATUSES.FAILED);
				return;
				// retakePhotoHandler();
			}
			setOcrStatus(STATUSES.SUCCEEDED);
			setLoading(false);
			const resultFields = (result as Result).fields;

			clearImageFromUri(mrzImage.uri);
			clearImageFromUri(mrzPhotoRotated!.uri);
			clearCacheCameraDirectory();
			// console.log("result fields", resultFields);

			// console.log("passportPhotoRotated...", passportPhotoRotated);
			// setPassportResult(resultFields);

			const userPassport = createUserPassportPartial(
				resultFields,
				rotatedPassportImage
					? rotatedPassportImage.uri
					: passportPhotoRotated!.uri
			);

			dispatch(addUserPassport(userPassport));
			dispatch(setIsBusy(false));

			navigation.navigate("Signature", { id: userPassport.id! });
		} catch (error) {
			console.log("problem with OCR Engine", error);
			retakePhotoHandler();
		}
		setIsLoading(false);

		// console.log("OCR RESULT", result);
	};

	const renderComponent = () => {
		if (ocrStatus === STATUSES.FAILED && mrzPhoto) {
			if (mrzPhotoRotated) {
				clearImageFromUri(mrzPhotoRotated.uri);
			}
			if (isLoading) {
				setIsLoading(false);
			}
			return (
				<CropImageComponent
					width={mrzPhoto.width}
					height={mrzPhoto.height}
					capturedPhotoUri={mrzPhoto!.uri}
					onDoneHandler={cropDoneHandler}
					onRetakeHandler={retakePhotoHandler}
				/>
			);
		} else if (!capturedPhoto && dimensions) {
			return (
				<CameraComponent
					width={dimensions.width}
					height={dimensions.height}
					onCapturePhoto={onCapturePhoto}
				/>
			);
		} else if (capturedPhoto) {
			return (
				// {/* load photo preview in background */}
				<PreviewPictureComponent
					width={dimensions.width}
					height={dimensions.height}
					capturedPhotoUri={capturedPhoto!.uri}
					// onDoneHandler={cropDoneHandler}
					// onRetakeHandler={retakePhotoHandler}
				/>
			);
		}
	};

	return (
		<View style={styles.container} onLayout={layoutHandler}>
			{/* overlaying loader */}
			{ocrStatus === STATUSES.PENDING || isLoading ? (
				<Loader progress={ocrProgress} />
			) : null}
			{renderComponent()}
			{/* testing */}
			{/* {passportPhotoRotated ? (
				<Image
					style={{
						// flex: 1,
						width: 400,
						height: (400 * 16) / 9,
						resizeMode: "center",
					}}
					source={{ uri: passportPhotoRotated!.uri }}
				/>
			) : null}
			{mrzPhotoRotated ? (
				<Image
					style={{
						// flex: 1,
						width: 350,
						height: (400 * 16) / 9,
						resizeMode: "center",
					}}
					source={{ uri: mrzPhotoRotated!.uri }}
				/>
			) : null} */}
		</View>
	);
};

export default CameraScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
