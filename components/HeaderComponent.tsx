import React from "react";
import { Text } from "./TextComponent";
import { StyleSheet, View } from "react-native";

type props = {
	title: string;
};

const HeaderComponent = ({ title }: props) => {
	return (
		<View style={styles.container}>
			<Text>{title}</Text>
		</View>
	);
};

export default HeaderComponent;

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
	},
});
