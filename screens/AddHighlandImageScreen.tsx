import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { StackScreenProps } from "../types";
import { RNCamera as Camera, TakePictureResponse } from "react-native-camera";
import { UserPassport } from "../app/user-passports/models/UserPassport";
import {
	addUserHighlandImage,
	getUserPassportFromId,
} from "../app/user-passports/userPassportsSlice";
import { getHighlandImage } from "../helper/imageManipulator";

import { Dimensions as Dimensions_ } from "../types";
import HighlandImageComponent from "../components/HighlandImageComponent";

const AddHighlandImageScreen = ({
	route,
	navigation,
}: StackScreenProps<"AddHighlandImage">) => {
	const [userPassport, setUserPassport] = useState<Partial<UserPassport>>();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { id } = route.params;
	const dispatch = useAppDispatch();
	const userPassports = useAppSelector((state) => state.userPassports);

	const [dimensions, setDimensions] = useState<Dimensions_>({
		width: 0,
		height: 0,
	});

	// const sketchCanvasRef = useRef<SketchCanvas>(null);
	// const [signature, setSignature] = useState<Response>();
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

	const onCapturePhoto = async (
		cameraCapturedPicture: TakePictureResponse
	) => {
		setIsLoading(true);
		const highlanImage = await getHighlandImage(cameraCapturedPicture);

		const userPassport: Partial<UserPassport> = {
			id: id,
			highlandImage: highlanImage.uri,
		};
		dispatch(addUserHighlandImage(userPassport));
		navigation.navigate("HomeTab", { screen: "Home" });
	};

	const layoutHandler = (event: LayoutChangeEvent) => {
		let { width, height } = event.nativeEvent.layout;
		width = width * 1;
		setDimensions({ width: width, height: width * (16 / 9) });
	};

	if (!userPassport) {
		return null;
	}

	return (
		<View style={styles.container} onLayout={layoutHandler}>
			<HighlandImageComponent
				width={dimensions.width}
				height={dimensions.height}
				onCapturePhoto={onCapturePhoto}
			/>

			{/* {highlandImage ? (
				<Image
					style={{
						// flex: 1,
						width: 400,
						height: (400 * 16) / 9,
						resizeMode: "center",
					}}
					source={{ uri: highlandImage!.uri }}
				/>
			) : null} */}
		</View>
	);
};

export default AddHighlandImageScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
