import React, { useCallback, useRef, useState } from "react";
// import ImagePicker, { Image } from "react-native-image-crop-picker";
import { CropView } from "react-native-image-crop-tools";

import {
	ImageSourcePropType,
	StyleSheet,
	TouchableOpacity,
	View,
} from "react-native";
import { Icon } from "react-native-elements";
import { ImageCropResponse } from "../types";
// import * as FileSystem from "expo-file-system";
import { Text } from "./TextComponent";

type CropImageComponentType = {
	capturedPhotoUri: string;
	width: number;
	height: number;
	onDoneHandler: (image: ImageCropResponse) => void;
	onRetakeHandler: () => void;
};

const CropImageComponent: React.FC<CropImageComponentType> = ({
	capturedPhotoUri,
	width,
	height,
	onDoneHandler,
	onRetakeHandler,
}) => {
	const [imageCropResponse, setImageResponse] = useState<ImageCropResponse>();

	const cropViewRef = useRef<CropView | null>(null);

	const doneCropHandler = async () => {
		// console.log(cropViewRef);
		const image = await cropViewRef.current!.saveImage(false, 100);
		console.log("image cropped", image);
	};

	const imageCropHandler = async (res: ImageCropResponse) => {
		// console.warn("cropped image", res);
		// console.log(await FileSystem.getInfoAsync("file://" + res.uri));
		res.uri = "file://" + res.uri;
		setImageResponse(res);
		onDoneHandler(res);
	};

	return (
		<View style={styles.container}>
			<View style={styles.wrapper}>
				<CropView
					sourceUrl={capturedPhotoUri}
					style={styles.cropView}
					ref={cropViewRef}
					onImageCrop={imageCropHandler}
					// keepAspectRatio
					//   aspectRatio={{width: 16, height: 9}}
				/>
				{/* <View
					style={{
						flex: 1,
					}}
				>
					{imageCropResponse ? (
						<Image
							style={{
								// flex: 1,
								width: imageCropResponse.width,
								height: "80%",
								resizeMode: "center",
							}}
							source={imageCropResponse}
						/>
					) : null}
				</View> */}
			</View>
			<View style={styles.textBox}>
				<Text style={styles.infoText}>
					Please Crop the above Image precisely to the edge
				</Text>
			</View>
			<View style={styles.btnContainer}>
				<TouchableOpacity
					style={styles.cancelBtn}
					onPress={onRetakeHandler}
				>
					<View style={styles.btnWrapper}>
						<View>
							<Icon
								name="back"
								type="ant-design"
								size={24}
								color="#2A333D80"
								style={{ marginRight: 5 }}
							/>
						</View>
						<Text style={styles.btnText}> Retake </Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.doneBtn}
					onPress={doneCropHandler}
				>
					<View style={styles.btnWrapper}>
						<Icon
							name="checkcircleo"
							type="ant-design"
							size={24}
							color="#2A333D80"
							style={{ marginRight: 5 }}
						/>
						<Text style={styles.btnText}> Done Cropping</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default CropImageComponent;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// flexDirection: "row",
	},
	wrapper: {
		flex: 1,
		flexDirection: "row",
	},
	btnContainer: {
		// flex: 1,
		marginVertical: 24,
		flexDirection: "row",
		// padding: 24,
		justifyContent: "space-around",
	},
	btnWrapper: {
		// flex: 1,
		// margin: 24,
		flexDirection: "row",
		// padding: 24,
		// justifyContent: "space-around",
	},
	doneBtn: {
		backgroundColor: "#0a95ff40",
		borderColor: "#0a95ff",
		borderWidth: 2,
		paddingVertical: 16,
		paddingHorizontal: 16,
		alignItems: "center",
		justifyContent: "center",
		// width: 160,
		borderRadius: 16,
	},
	cancelBtn: {
		// backgroundColor: "#f6600020",
		borderColor: "#f6600080",
		borderWidth: 2,
		paddingVertical: 16,
		paddingHorizontal: 16,
		alignItems: "center",
		justifyContent: "center",
		// width: 160,
		borderRadius: 16,
	},
	cropView: {
		flex: 1,
		// height: "60%",
	},
	textBox: {
		alignItems: "center",
		fontSize: 24,
		marginTop: 16,
		// transform: [{ rotate: "90deg" }, { translateX: 50 }],
	},
	infoText: {
		fontSize: 14,
		fontWeight: "400",
		color: "#2A333D90",
	},
	btnText: {
		fontSize: 16,
		color: "#2A333D99",
	},
});
