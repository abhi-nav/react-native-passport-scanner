import { StyleSheet, View, Dimensions } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { Text } from "./TextComponent";

type LoaderComponentPropType = {
	progress?: number;
	displayText?: string;
	icon?: JSX.Element;
};

const LoaderComponent: React.FC<LoaderComponentPropType> = ({
	progress,
	displayText,
	icon,
}) => {
	return (
		<View style={styles.container}>
			{icon ? icon : null}
			<LottieView
				source={require("../assets/loader.json")}
				style={styles.lottie}
				speed={1}
				loop={true}
				autoPlay
				progress={progress}
			/>
			{progress ? (
				<Text style={styles.progressText}> {progress} % </Text>
			) : null}

			{displayText ? (
				<Text style={styles.progressText}> {displayText} </Text>
			) : null}
		</View>
	);
};

export default LoaderComponent;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 99,
		backgroundColor: "rgba(0, 0, 0, 0.2 )",
	},
	lottie: {
		width: 150,
		height: 150,
	},
	progressText: {
		letterSpacing: 1,
		fontWeight: "bold",
		fontSize: 12,
		fontFamily: "open-sans",
	},
});
