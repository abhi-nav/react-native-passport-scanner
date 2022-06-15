import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import { PassportBox, MrzBox } from "../constants/PassportDimension";

type PreviewPictureComponentType = {
	capturedPhotoUri: string;
	width: number;
	height: number;
	// onDoneHandler: (image: Image) => void;
	// onRetakeHandler: () => void;
};

const PreviewPictureComponent: React.FC<PreviewPictureComponentType> = ({
	capturedPhotoUri,
	width,
	height,
	// onDoneHandler,
	// onRetakeHandler,
}) => {
	return (
		<View
			style={{
				...styles.imageContainer,
				width: width,
				height: height,
			}}
		>
			<ImageBackground
				source={{ uri: capturedPhotoUri }}
				style={{
					...styles.image,
				}}
				resizeMode="cover"
			>
				<View style={styles.overlayPassportBox}></View>
				<View style={styles.overlayMrzBox}></View>
			</ImageBackground>
		</View>
	);
};

export default PreviewPictureComponent;

const styles = StyleSheet.create({
	imageContainer: {},
	image: {
		flex: 1,
	},
	button: {
		backgroundColor: "#8DF1FF",
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "black",
		padding: 5,
		transform: [{ rotate: "90deg" }],
	},
	btnText: {
		fontSize: 20,
		fontWeight: "bold",
	},

	buttonContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-end",
	},
	groupBtn: {
		width: "80%",
		flexDirection: "row",
		justifyContent: "space-around",
	},
	borderWrapper: {
		borderColor: "black",
		borderWidth: 2,
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
});
