import { Button, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { RootScreenProps } from "../types";
import { useIsFocused, useRoute } from "@react-navigation/native";
import AuthComponent from "../components/AuthComponent";
import LoaderComponent from "../components/LoaderComponent";

const ProfileScreen = () => {
	const route_ = useRoute();
	let isFocused = useIsFocused();

	useEffect(() => {}, [isFocused]);

	return (
		<View style={styles.container}>
			<AuthComponent />
			<LoaderComponent />
		</View>
	);
};
export default ProfileScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		justifyContent: "center",
	},
});
