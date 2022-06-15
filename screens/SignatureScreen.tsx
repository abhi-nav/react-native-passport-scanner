import React, { useEffect, useRef, useState } from "react";

import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Text } from "../components/TextComponent";
import { UserPassport } from "../app/user-passports/models/UserPassport";

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { RootScreenProps, StackScreenProps } from "../types";
import {
	addUserSignature,
	getUserPassportFromId,
} from "../app/user-passports/userPassportsSlice";
import RNSketchCanvas, {
	SketchCanvas,
} from "@terrylinla/react-native-sketch-canvas";

// import ImageResizer, { Response } from "react-native-image-resizer";
import { Image, Icon } from "react-native-elements";
import { getSignatureImage } from "../helper/imageManipulator";
import { ImageResult } from "expo-image-manipulator";

const SignatureScreen = ({
	route,
	navigation,
}: RootScreenProps<"Signature">) => {
	const [userPassport, setUserPassport] = useState<Partial<UserPassport>>();

	const { id } = route.params;
	const dispatch = useAppDispatch();
	const userPassports = useAppSelector((state) => state.userPassports);
	const sketchCanvasRef = useRef<SketchCanvas>(null);
	const [signature, setSignature] = useState<ImageResult>();

	// console.log("userPassport", userPassport);
	// const whiteBackGroundCanvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		let userPassport = null;

		if (id) {
			userPassport = getUserPassportFromId(userPassports, id);
		}

		if (userPassport) {
			setUserPassport(userPassport);
		} else {
			navigation.navigate("HomeTab", { screen: "Home" });
		}
	}, [id, userPassports]);

	const clearPath = () => {
		sketchCanvasRef.current!.clear();
	};

	const saveImage = () => {
		sketchCanvasRef.current!.getBase64(
			"jpg",
			false,
			false,
			false,
			false,
			async (error, result) => {
				// console.log("error", error);
				if (error) return;
				const imageBase64 = "data:image/jpeg;base64," + result;

				const resizedImage = await getSignatureImage(imageBase64);
				// const resizedImage = await ImageResizer.createResizedImage(
				// 	imageBase64,
				// 	1200,
				// 	1200,
				// 	"JPEG",
				// 	1
				// 	);
				setSignature(resizedImage); // not needed for now
				// console.log("image result", resizedImage);
				dispatch(
					addUserSignature({
						id: id!,
						signatureImage: resizedImage.uri,
					})
				);
				navigation.navigate("BarcodeScanner", {
					id: userPassport!.id!,
				});
			}
		);
	};
	if (!userPassport) {
		return null;
	}

	return (
		<View style={styles.container}>
			<View style={styles.sketchWrapper}>
				<SketchCanvas
					ref={sketchCanvasRef}
					// containerStyle={{ backgroundColor: "transparent", flex: 1 }}
					// canvasStyle={{ backgroundColor: "transparent", flex: 1 }}

					style={styles.sketchStyle}
					strokeWidth={1}
				/>
				<View style={styles.btnWrapper}>
					<TouchableOpacity
						style={{
							...styles.functionButton,
							backgroundColor: "#EBEBEB",
						}}
						onPress={clearPath}
					>
						<Icon
							name="delete"
							type="ant-design"
							size={20}
							color="grey"
						></Icon>
						<Text style={styles.btnClear}>Clear </Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.functionButton}
						onPress={saveImage}
					>
						<Icon
							name="check"
							type="ant-design"
							size={20}
							color="#ffffff"
						></Icon>
						<Text style={styles.btnSave}>Save </Text>
					</TouchableOpacity>
				</View>
			</View>

			<View style={styles.imageWrapper}>
				<Image
					style={styles.image}
					source={{ uri: userPassport.passportImage }}
				/>
			</View>
		</View>
	);
};

export default SignatureScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "stretch",
		backgroundColor: "#ffffff",
	},
	sketchWrapper: {
		flex: 1,
		paddingHorizontal: 20,
		marginTop: 20,
	},

	btnWrapper: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	functionButton: {
		marginHorizontal: 2.5,
		marginVertical: 8,
		padding: 10,
		flexDirection: "row",
		backgroundColor: "#0376F8",
		borderRadius: 5,
	},
	btnClear: {
		color: "grey",
		paddingHorizontal: 5,
	},

	btnSave: {
		color: "#ffffff",
		paddingHorizontal: 5,
	},

	imageWrapper: {
		flex: 1,
		marginTop: 10,
		marginHorizontal: 10,
		padding: 10,
		borderRadius: 10,
		backgroundColor: "#ffffff",
	},
	image: {
		width: "100%",
		aspectRatio: 16 / 9,
		height: undefined,
		// top: "-50%",
		// left: "-50%",
		// marginBottom: 10,
	},
	sketchStyle: {
		flex: 1,
		backgroundColor: "#dcf4ff",
	},
});
