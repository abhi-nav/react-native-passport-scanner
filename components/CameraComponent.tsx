import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
// import { Camera, CameraCapturedPicture } from "expo-camera";

import { PassportBox, MrzBox } from "../constants/PassportDimension";
import { useIsFocused } from "@react-navigation/native";
import {
	RNCamera as Camera,
	TakePictureResponse,
	TakePictureOptions,
} from "react-native-camera";

type CameraComponentPropType = {
	width: number;
	height: number;
	onCapturePhoto: (cameraCapturedPicture: TakePictureResponse) => void;
};
import { Icon } from "react-native-elements";

const CameraComponent: React.FC<CameraComponentPropType> = ({
	width,
	height,
	onCapturePhoto,
}) => {
	const cameraRef = useRef<Camera>(null);
	const isFocused = useIsFocused();

	const [isCameraReady, setIsCameraReady] = useState<boolean>(false);

	const [type, setType] = useState<"back" | "front">(
		Camera.Constants.Type.back
	);

	useEffect(() => {
		if (!isFocused) setIsCameraReady(false);
	}, [isFocused]);

	const onCameraReady = () => {
		console.log("camera is ready..");
		setIsCameraReady(true);
	};

	const capturePhoto = async () => {
		if (!isCameraReady) {
			Alert.alert("Camera not ready", "Please refresh your app");
			// const perm = await Camera.requestCameraPermissionsAsync();
			return;
		}
		// const ratios = await cameraRef.current!.getSupportedRatiosAsync();
		// console.log("cameraRef.current", cameraRef.current);
		const options: TakePictureOptions = {
			quality: 1,
			// forceUpOrientation: true,
			fixOrientation: true,
			// ratio: ""
			// fixOrientation: true,
			// skipProcessing: false,
			pauseAfterCapture: true,
			orientation: "portrait",
			imageType: "png",
		};
		const photo = await cameraRef.current!.takePictureAsync(options);

		console.log("photo async", photo);
		onCapturePhoto(photo);
	};

	return (
		<View style={styles.container}>
			<Camera
				style={{
					...styles.camera,
					width: width,
					height: height,
				}}
				type={type}
				ref={cameraRef}
				ratio="16:9"
				autoFocusPointOfInterest={{ x: 0.1, y: 0.5 }}
				onCameraReady={onCameraReady}
				zoom={0.05}
			>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={capturePhoto}
					>
						<Icon
							name="camerao"
							type="ant-design"
							size={60}
							color="#fff"
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.overlayPassportBox}></View>
				<View style={styles.overlayMrzBox}></View>
			</Camera>
		</View>
	);
};

export default CameraComponent;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
	},
	overlayPassportBox: {
		...PassportBox,
		position: "absolute",
		borderWidth: 2,
		borderColor: "white",
		borderStyle: "dashed",
		borderRadius: 5,
	},
	overlayMrzBox: {
		...MrzBox,
		position: "absolute",
		borderWidth: 2,
		borderColor: "white",
		borderStyle: "dashed",
		borderRadius: 5,
	},
	buttonContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-end",
	},
	button: {
		zIndex: 99999,
		height: 100,
		width: 100,
		backgroundColor: "#0376F8",
		borderRadius: 60,
		alignItems: "center",
		justifyContent: "center",
		transform: [{ rotate: "90deg" }, { translateX: 50 }],
	},
	camera: {},
});
