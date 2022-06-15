import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { Text } from "../components/TextComponent";
import { getAuthToken } from "../app/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Input, Icon } from "react-native-elements";

const LoginScreen = () => {
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [disableLogin, setDisableLogin] = useState<boolean>(true);

	const authState = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();

	useEffect(() => {
		setDisableLogin(!username || !password);
	}, [username, password]);

	const loginHandler = async () => {
		if (username && password) {
			const auth = await dispatch(
				getAuthToken({ username, password, shouldFakeState: false })
			);
		}
	};

	const onChangeHandler = (value: string, key: "username" | "password") => {
		key === "username" ? setUsername(value) : setPassword(value);
	};

	return (
		<View style={styles.container}>
			{/* <HeaderComponent title="Title" /> */}
			<View style={styles.form}>
				<View style={styles.titleContainer}>
					<Icon
						name="scan1"
						type="ant-design"
						color="#0376F8"
						size={28}
					/>
					<Text style={[styles.appText]}>High</Text>
					<Text style={[styles.appText, styles.sideTitle]}>Land</Text>
				</View>
				<View style={styles.errorContainer}>
					{authState.errorMessage ? (
						<Text style={styles.errorMessage}>
							{authState.errorMessage}
						</Text>
					) : null}
				</View>
				<View style={styles.formgroup}>
					<Input
						placeholder="username"
						leftIcon={
							<Icon
								name="user"
								type="ant-design"
								size={24}
								color="#2A333D80"
							/>
						}
						inputStyle={{ fontFamily: "open-sans" }}
						containerStyle={styles.textInput}
						value={username}
						onChangeText={(text) =>
							onChangeHandler(text, "username")
						}
						autoCapitalize="none"
						editable={!authState.loading}
						autoCorrect={false}
					/>
				</View>
				<View style={styles.formgroup}>
					<Input
						inputStyle={{ fontFamily: "open-sans" }}
						secureTextEntry={true}
						placeholder="password"
						leftIcon={
							<Icon
								name="lock"
								type="ant-design"
								size={24}
								color="#2A333D80"
							/>
						}
						containerStyle={styles.textInput}
						value={password}
						onChangeText={(text) =>
							onChangeHandler(text, "password")
						}
						autoCapitalize="none"
						autoCorrect={false}
						editable={!authState.loading}
					/>
				</View>
				<View style={styles.btnContainer}>
					<TouchableOpacity
						style={{
							...styles.button,
							opacity:
								disableLogin || authState.loading ? 0.5 : 1,
						}}
						onPress={loginHandler}
						disabled={disableLogin || authState.loading}
					>
						{authState.loading ? (
							<ActivityIndicator color="#2A333D80" />
						) : (
							<Text style={styles.loginText}>Login</Text>
						)}
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		backgroundColor: "#EBF0F5",
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 32,
	},
	title: {
		fontSize: 24,
		color: "#2A333D80",
	},
	sideTitle: { color: "#2A333D", marginLeft: 0 },
	errorContainer: {
		alignItems: "center",
		marginBottom: 10,
	},
	errorMessage: {
		color: "red",
	},
	form: {
		marginTop: 100,
		padding: 10,
	},
	formgroup: {
		flexDirection: "row",
		marginBottom: 10,
		justifyContent: "center",
	},
	textInput: {
		width: "90%",
	},
	btnContainer: {
		marginTop: 10,
		alignItems: "center",
	},
	button: {
		backgroundColor: "#0a95ff80",
		paddingVertical: 16,
		alignItems: "center",
		width: 160,
		borderRadius: 16,
	},
	loginText: {
		color: "#2A333D",
		fontSize: 16,
		fontFamily: "open-sans",
	},
	appText: {
		color: "#0376F8",
		marginLeft: 12,
		fontFamily: "open-sans",
		letterSpacing: 3,
		fontSize: 24,
		fontWeight: "400",
		justifyContent: "flex-start",
	},
});
