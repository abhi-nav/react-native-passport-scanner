import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "./TextComponent";
import { Icon } from "react-native-elements";
import { StateType as AuthStateType } from "../app/auth/authSlice";
import { StateType as PassportStateType } from "../app/user-passports/userPassportsSlice";

import { useAppSelector } from "../app/hooks";

const TopBarNotifyComponent = () => {
	const authState: AuthStateType = useAppSelector((state) => state.auth);
	const userPassports: PassportStateType = useAppSelector(
		(state) => state.userPassports
	);

	let { hasWifi } = authState;

	const { loading } = userPassports;

	return (
		<View style={styles.topBar}>
			<View style={styles.item1}>
				<Icon
					name="scan1"
					type="ant-design"
					color="#0376F8"
					size={28}
				/>
				<Text style={[styles.appText]}>High</Text>
				<Text
					style={[
						styles.appText,
						{ color: "#2A333D", marginLeft: 0 },
					]}
				>
					Land
				</Text>
			</View>
			<View style={styles.item2}>
				<View style={styles.internetBtn}>
					<View style={styles.justifyCenter}>
						<Icon
							name={hasWifi ? "wifi" : "wifi-off"}
							type="feather"
							size={14}
							color="#2A333D60"
						/>
					</View>
					<View style={styles.connectionView}>
						<Text style={styles.connectionText}>
							{hasWifi ? "Connected" : "No Connectivity"}
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

export default TopBarNotifyComponent;

const styles = StyleSheet.create({
	topBar: {
		flexDirection: "row",
		height: 50,
	},
	item1: {
		flex: 1,
		flexDirection: "row",
		left: 16,
		marginTop: 22,
	},
	item2: {
		flex: 1,
		flexDirection: "row",
		marginTop: 16,
		height: 37,
		justifyContent: "flex-end",
		marginRight: 16,
	},
	appText: {
		color: "#0376F8",
		marginLeft: 12,
		letterSpacing: 3,
		fontSize: 20,
		fontStyle: "italic",
		fontWeight: "400",
		justifyContent: "flex-start",
	},
	internetBtn: {
		flexDirection: "row",
		borderWidth: 1,
		borderColor: "#E7E7E7",
		padding: 5,
		borderRadius: 100,
		paddingHorizontal: 16,
		height: 40,
	},
	justifyCenter: {
		justifyContent: "center",
	},
	connectionView: {
		marginLeft: 12,
		justifyContent: "center",
	},
	connectionText: {
		fontSize: 14,
		color: "#2A333D60",
	},
});
