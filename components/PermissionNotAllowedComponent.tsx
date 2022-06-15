import { StyleSheet, View } from "react-native";
import { Text } from "./TextComponent";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";

const PermissionNotAllowedComponent = () => {
	return (
		<View
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Text>
				<FontAwesome name="times-circle" size={40} color="red" />
			</Text>
			<Text style={styles.permissionText}>
				Please allow the permission for camera and storage to run this
				app.
			</Text>
		</View>
	);
};

export default PermissionNotAllowedComponent;

const styles = StyleSheet.create({
	permissionText: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#C70039",
		padding: 10,
	},
});
