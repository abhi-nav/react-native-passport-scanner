import {
	StyleSheet,
	View,
	TouchableOpacity,
	SafeAreaView,
	ImageBackground,
} from "react-native";
import React, { useState } from "react";

import { Icon, Switch } from "react-native-elements";
import { Text } from "../components/TextComponent";
import { useAppSelector } from "../app/hooks";
import { logout, StateType, setIsProduction } from "../app/auth/authSlice";
import { useDispatch } from "react-redux";
import { RootScreenProps } from "../types";
import { getDevelopmentAppUrl, getProductionAppUrl } from "../helper/helper";

type SettingStateType = {
	iccid: boolean;
	signature: boolean;
	simImage: boolean;
};

const SettingsScreen = ({ navigation }: RootScreenProps<"HomeTab">) => {
	const authState: StateType = useAppSelector((state) => state.auth);

	const dispatch = useDispatch();

	const [settingState, setSettingState] = useState<SettingStateType>({
		iccid: true,
		signature: true,
		simImage: true,
	});

	const logoutHandler = () => {
		dispatch(logout());
	};

	const changeSettingState = (key: "iccid" | "signature" | "simImage") => {
		// console.log("pressed");
		let settingState_ = { ...settingState, [key]: !settingState[key] };
		console.log(settingState_);
		// settingState_[key] = !settingState[key];
		// setSettingState(settingState_);
		// navigation.navigate("UploadedPassport");
	};

	const toggleProductionFlag = () => {
		dispatch(setIsProduction(!authState.isProduction));
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={styles.container}>
				<View style={styles.topBar}>
					<ImageBackground
						source={require("../assets/profile-bg.jpeg")}
						resizeMode="cover"
						style={styles.image}
						blurRadius={1}
					>
						<View style={styles.profileIcon}>
							<Icon
								name="user"
								type="ant-design"
								size={80}
								color="#ffffff"
							/>
							<Text style={styles.userText}>
								{authState.username}
							</Text>
							<TouchableOpacity
								onPress={logoutHandler}
								style={styles.logoutBtn}
							>
								<Icon
									name="logout"
									type="ant-design"
									size={16}
									color="#2A333D"
								/>
								<Text style={styles.logoutText}>Logout</Text>
							</TouchableOpacity>
						</View>
					</ImageBackground>
					<View style={styles.content}>
						<View style={styles.optionsView}>
							<View style={styles.itemWrapper}>
								<Icon
									name="mobile1"
									type="ant-design"
									size={24}
									color="#2A333D80"
								/>
								<Text style={styles.itemText}>
									Scan mobile ICCID Number
								</Text>

								<Switch
									value={settingState.iccid}
									color="#0376F890"
									onValueChange={() =>
										changeSettingState("iccid")
									}
								/>
							</View>
							<View style={styles.itemWrapper}>
								<Icon
									name="edit"
									type="ant-design"
									size={24}
									color="#2A333D80"
								/>
								<Text style={styles.itemText}>
									Take User Signature
								</Text>

								<Switch
									value={settingState.signature}
									color="#0376F890"
									onValueChange={() =>
										changeSettingState("signature")
									}
								/>
							</View>
							<View style={styles.itemWrapper}>
								<Icon
									name="camera"
									type="ant-design"
									size={24}
									color="#2A333D80"
								/>
								<Text style={styles.itemText}>
									Take sim user-guide Image
								</Text>

								<Switch
									value={settingState.simImage}
									color="#0376F890"
									onValueChange={() =>
										changeSettingState("simImage")
									}
								/>
							</View>
						</View>

						<View style={styles.optionsView}>
							<View style={styles.itemContainer}>
								<View style={styles.itemWrapper}>
									<Icon
										name="link"
										type="ant-design"
										size={24}
										color="#2A333D80"
									/>
									<Text style={styles.itemText}>
										Enable Production
									</Text>

									<Switch
										value={authState.isProduction}
										color="#0376F890"
										onValueChange={() =>
											toggleProductionFlag()
										}
									/>
								</View>
								<View style={styles.infoTextView}>
									<Text style={styles.infoText}>
										App is in{" "}
										{authState.isProduction
											? "Production Mode"
											: "Development Mode"}
									</Text>
									<Text>
										Server API:{" "}
										<Text style={styles.underline}>
											{authState.isProduction
												? getProductionAppUrl()
												: getDevelopmentAppUrl()}{" "}
										</Text>
									</Text>
									<Text style={styles.footerNote}>
										*Make sure to logout and restart the app
									</Text>
								</View>
							</View>
						</View>
					</View>
				</View>
			</View>
		</SafeAreaView>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#EBF0F5",
	},
	topBar: { flex: 1 },

	image: {
		width: "100%",
		height: 250,
		overflow: "hidden",
		borderRadius: 8,
		borderBottomStartRadius: 200,
		borderBottomEndRadius: 200,
	},
	profileIcon: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	userText: {
		fontSize: 40,
		color: "#ffffff",
		textTransform: "capitalize",
	},
	logoutBtn: {
		flexDirection: "row",
		alignItems: "center",
		borderRadius: 8,
		backgroundColor: "#ffffff",
		padding: 8,
		marginTop: 20,
	},
	logoutText: {
		marginLeft: 8,
		fontSize: 20,
		color: "#2A333D",
	},
	content: {
		flex: 1,
		marginHorizontal: 16,
	},
	itemWrapper: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 8,
		marginBottom: 16,
	},
	itemText: {
		flex: 1,
		color: "#2A333D",
		marginLeft: 16,
		fontSize: 16,
		fontStyle: "italic",
	},
	clickableOptions: {
		// flex: 1,
		// borderRadius: 16,
		// padding: 16,
		// paddingVertical: 24,
		// backgroundColor: "#0376F830",
	},
	optionsView: {
		flex: 1,
		// borderRadius: 16,
		marginTop: 24,
	},
	itemContainer: {
		// flex: 1,
		// flexDirection: "row",
		// alignItems: "center",
		backgroundColor: "#fff",
		// padding: 16,
		borderRadius: 8,
		// marginBottom: 16,
	},
	infoTextView: {
		alignItems: "center",
		// flex: 1,
		paddingBottom: 16,
		paddingHorizontal: 16,
		// marginLeft: 24,

		fontStyle: "italic",
		backgroundColor: "#fff",
		borderRadius: 8,
	},
	infoText: {
		fontSize: 16,
		marginBottom: 8,
		// fontStyle: "italic",
	},
	underline: { textDecorationLine: "underline" },
	footerNote: {
		marginTop: 8,
		textAlign: "center",
		// fontSize: 12,
		fontStyle: "italic",
		color: "#2A333D80",
	},
});
