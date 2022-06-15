import { StyleSheet, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { HighlandImageBox } from "../constants/HighlandImageDimensions";
import { useIsFocused } from "@react-navigation/native";
import {
	RNCamera as Camera,
	TakePictureResponse,
	TakePictureOptions,
} from "react-native-camera";
import { Icon } from "react-native-elements";

type HighlandImageComponentPropType = {
	width: number;
	height: number;
	onCapturePhoto: (cameraCapturedPicture: TakePictureResponse) => void;
};

const HighlandImageComponent: React.FC<HighlandImageComponentPropType> = ({
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
			return;
		}

		// const ratios = await cameraRef.current!.getSupportedRatiosAsync();
		// console.log("cameraRef.current", cameraRef.current);
		const options: TakePictureOptions = {
			quality: 0.2,
			// forceUpOrientation: true,
			fixOrientation: true,
			// ratio: ""
			// fixOrientation: true,
			// skipProcessing: false,
			pauseAfterCapture: true,
			orientation: "portrait",
			imageType: "jpeg",
		};
		const photo = await cameraRef.current!.takePictureAsync(options);

		console.log("photo async", photo);
		onCapturePhoto(photo);
	};

	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
			}}
		>
			<Camera
				style={{
					...styles.camera,
					width: width,
					height: height,
				}}
				type={type}
				ref={cameraRef}
				ratio="16:9"
				onCameraReady={onCameraReady}
			>
				<View style={styles.buttonContainer}>
					<TouchableOpacity
						style={styles.button}
						onPress={capturePhoto}
					>
						<Icon
							name="camerao"
							type="ant-design"
							size={40}
							color="#ffffff"
						/>
					</TouchableOpacity>
				</View>
				<View style={styles.overlayHighlandImageBox}></View>
			</Camera>
		</View>
	);
};

export default HighlandImageComponent;

const styles = StyleSheet.create({
	overlayHighlandImageBox: {
		...HighlandImageBox,
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
		zIndex: 9999,
		height: 80,
		backgroundColor: "#0376F8",
		borderRadius: 50,
		padding: 20,
		transform: [{ translateY: 40 }],
	},
	camera: {},
});
