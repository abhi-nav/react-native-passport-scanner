import React from "react";

import { FontAwesome, AntDesign } from "@expo/vector-icons";
import { View } from "react-native";

export function TabBarIcon(props: {
	name: React.ComponentProps<typeof AntDesign>["name"];

	color: string;
}) {
	return (
		<AntDesign
			size={20}
			style={{
				position: "absolute",
				// top: -40,
				// marginBottom: -30,
			}}
			{...props}
		/>
	);
}

// export function TabBarIcon(props: {
// 	name: React.ComponentProps<typeof FontAwesome>["name"];

// 	color: string;
// }) {
// 	return (
// 		<FontAwesome
// 			size={20}
// 			style={{
// 				position: "absolute",
// 				// top: -40,
// 				// marginBottom: -30,
// 			}}
// 			{...props}
// 		/>
// 	);
// }

export function TabBarScannerIcon(props: {
	name: React.ComponentProps<typeof AntDesign>["name"];
	color: string;
}) {
	const size = 65;
	const color = "#0376F8";
	return (
		<View
			style={{
				width: size,
				height: size,
				borderRadius: 0.5 * size,
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				borderColor: color,
				backgroundColor: color,
				elevation: 3,
			}}
		>
			<AntDesign
				size={20}
				style={{
					position: "absolute",
					color: "#fff",
					// top: -40,
					// marginBottom: -30,
				}}
				{...props}
			/>
		</View>
	);
}

export function DrawerIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return (
		<FontAwesome
			size={20}
			style={{
				position: "absolute",
			}}
			{...props}
		/>
	);
}
