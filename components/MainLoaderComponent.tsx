import { StyleSheet, View, Dimensions } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { Text } from "./TextComponent";
const { width, height } = Dimensions.get("window");
type MainLoaderComponentPropType = {
	progress?: number;
};

const MainLoaderComponent: React.FC<MainLoaderComponentPropType> = ({
	progress,
}) => {
	return (
		<View style={styles.container}>
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
		</View>
	);
};

export default MainLoaderComponent;

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		height: height,
		width: width,
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 99,
		backgroundColor: "rgba(0, 0, 0, 0.2 )",
	},
	lottie: {
		width: 200,
		height: 200,
	},
	progressText: {
		fontWeight: "bold",
		fontSize: 12,
	},
});
