import { StyleSheet, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { UserPassport } from "../app/user-passports/models/UserPassport";
import { Button, Icon, Overlay, Image, Badge } from "react-native-elements";

import { Text } from "./TextComponent";

import {
	getFormattedData,
	isFormComplete,
	isUpdatedInServer,
} from "../helper/helper";
import PassportPreviewComponent from "./PassportPreviewComponent";
import { useNavigation } from "@react-navigation/native";
import { RootNavigationProps } from "../types";
import { useAppDispatch } from "../app/hooks";
import { deleteUserPassport } from "../app/user-passports/userPassportsSlice";

type PassportListComponentType = {
	userPassport: Partial<UserPassport>;
	fromServer?: boolean;
};

const PassportListComponent: React.FC<PassportListComponentType> = ({
	userPassport,
	fromServer,
}) => {
	const navigation = useNavigation<RootNavigationProps<"HomeTab">>();
	const dispatch = useAppDispatch();

	const [visible, setVisible] = useState<boolean>(false);
	const toggleOverlay = () => {
		setVisible(!visible);
	};
	// Math.random() > 0.5 &&
	const isFormComplete_ = isFormComplete(userPassport);
	const isUpdatedInServer_ = isUpdatedInServer(userPassport);

	// console.log("userPassport", userPassport);
	const name = `${userPassport.details?.firstName} ${userPassport.details?.lastName}`;

	const handleIncompleteForm = () => {
		const id = userPassport.id!;

		if (!userPassport.signatureImage) {
			navigation.navigate("Signature", { id });
		} else if (!userPassport.iccid) {
			navigation.navigate("BarcodeScanner", { id });
		} else if (!userPassport.highlandImage) {
			navigation.navigate("AddHighlandImage", { id });
		}
		return;
	};
	const onDeleteHandler = () => {
		dispatch(deleteUserPassport(userPassport));
	};
	const getFormComponent = () => {
		return (
			<View style={styles.btn}>
				{isFormComplete_ || fromServer ? (
					<Icon
						size={20}
						name={
							fromServer || isUpdatedInServer_
								? "checkcircleo"
								: "hourglass"
						}
						type="ant-design"
						color={
							userPassport.status === "success"
								? "#0376F890"
								: "#2A333D60"
						}
					/>
				) : (
					<TouchableOpacity onPress={handleIncompleteForm}>
						<View
							style={{
								flexDirection: "row",
								backgroundColor: "#BFDDFF",
								paddingVertical: 5,
								paddingHorizontal: 7,
								borderRadius: 50,
							}}
						>
							<Icon
								size={16}
								name="edit"
								type="ant-design"
								color="#2A333D"
							/>
							<Text
								style={{
									color: "#2A333D",
									marginLeft: 7,
									fontFamily: "open-sans",
								}}
							>
								Draft
							</Text>
						</View>
					</TouchableOpacity>
				)}
			</View>
		);
	};

	const getServerComponent = () => {
		let title, backgroundColor, status;

		if (isUpdatedInServer(userPassport)) {
			title = "Done";
			status = "success";
			backgroundColor = "#3cb371";
		} else {
			title = "Pending";
			status = "warning";
			backgroundColor = "#838996";
		}

		return (
			<View>
				<View style={{ alignItems: "center" }}>
					<Text style={styles.listLabel}>Server Status</Text>
				</View>
				<Badge value={title} status={status as "success" | "warning"} />
				{/* <Chip
					icon={{
						name: "server",
						type: "font-awesome",
						size: 20,
						color: "#fff",
					}}
					title={title}
					buttonStyle={{
						padding: 1,
						backgroundColor: backgroundColor,
					}}
				/> */}
			</View>
		);
	};
	const textStyle = (title: boolean = false) => {
		return {
			color: isFormComplete_
				? title
					? "#2A333D"
					: "#2A333D80"
				: "#2A333D40",
		};
	};

	return (
		<View style={[styles.container, { borderWidth: fromServer ? 1 : 0.5 }]}>
			<Overlay
				isVisible={visible}
				onBackdropPress={toggleOverlay}
				fullScreen
				overlayStyle={{ backgroundColor: "#EBF0F5" }}
			>
				<PassportPreviewComponent
					userPassport={userPassport}
					onDeleteHandler={onDeleteHandler}
					hideDelete={!!fromServer}
				/>
				<Button
					icon={<Icon name="close" color="#ffffff" />}
					buttonStyle={{
						borderRadius: 10,
						marginLeft: 16,
						marginRight: 16,
						// elevation: 1,
						marginBottom: 0,
					}}
					onPress={toggleOverlay}
					title="Close"
				/>
			</Overlay>
			{/* <Card.Image
				style={{ padding: 0, height: 100, marginBottom: 10 }}
				resizeMode="contain"
				source={{
					uri: userPassport.passportImage,
				}}
			/> */}
			<TouchableOpacity onPress={toggleOverlay} activeOpacity={0.6}>
				<View
					style={{
						alignItems: "flex-end",
						marginTop: 5,
						marginRight: 16,
					}}
				>
					{getFormComponent()}
				</View>

				<View style={styles.contentWrapper}>
					<View style={styles.imageWrapper}>
						<Image
							source={{ uri: userPassport.passportImage }}
							style={styles.image}
						/>
					</View>
					<View style={styles.listWrapper}>
						<View
							style={{
								flex: 1,
								flexDirection: "row",
								// borderColor: "black",
								// borderWidth: 1,
							}}
						>
							<View style={{ flex: 1 }}>
								<Text style={[styles.title, textStyle(true)]}>
									{name}
								</Text>
							</View>
						</View>
						<View style={styles.listItem}>
							<Text style={[styles.textStyle, textStyle()]}>
								{userPassport.details?.documentNumber}
							</Text>
							<Text style={styles.listLabel}>Passport</Text>
						</View>
						<View style={styles.listItem}>
							<Text style={[styles.textStyle, textStyle()]}>
								{userPassport.iccid}
							</Text>
							<Text style={styles.listLabel}>ICCID</Text>
						</View>

						{/* <View style={styles.listItem}>
						<Text style={styles.listLabel}>Expiry</Text>
						<Text style={styles.textStyle}>
							{getFormattedData(
								userPassport.details?.expirationDate!
							)}
						</Text>
					</View>
					<View style={styles.listItem}>
						<Text style={styles.listLabel}>Nationality</Text>
						<Text style={styles.textStyle}>
							{userPassport.details?.nationality!}
						</Text>
					</View> */}

						{/* <Text>PassportListComponent</Text> */}
						{/* <Text> {userPassport.passportImage} </Text> */}
					</View>
				</View>
			</TouchableOpacity>
			{/* <Card.Divider /> */}
			{/* <View style={styles.footer}>
				{getFormComponent()}

				{getServerComponent()}

				<Button
					onPress={toggleOverlay}
					type="outline"
					iconRight
					icon={<Icon name="arrow-right" size={20} color="black" />}
					title="Details"
				/>
			</View> */}
		</View>
	);
};

export default PassportListComponent;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		borderRadius: 16,
		backgroundColor: "#ffffff",
		marginHorizontal: 12,
		marginBottom: 12,
		borderColor: "#0376F840",
		// borderWidth: 1,
	},
	topBar: {
		flexDirection: "row",
		borderColor: "black",
		borderWidth: 1,
	},

	imageWrapper: {
		marginRight: 16,
	},
	contentWrapper: {
		flex: 1,
		flexDirection: "row",
		marginTop: 0,
		margin: 16,
		marginLeft: 16,
	},
	listWrapper: {
		flex: 1,
		marginTop: 4,
	},
	btn: {
		justifyContent: "center",
	},
	image: {
		width: 100,
		height: undefined,
		aspectRatio: 16 / 9,
		borderRadius: 8,
	},
	title: {
		fontSize: 16,
		fontStyle: "italic",
		color: "#2A333D",
		fontWeight: "400",
		marginBottom: 11,
	},
	subtitle: {
		fontSize: 14,
		fontWeight: "bold",
	},
	highlight: {
		color: "green",
		fontSize: 14,
		// backgroundColor: "yellow",
		// fontSize: 14,
		fontWeight: "bold",
	},
	textStyle: {
		fontSize: 14,
		fontWeight: "400",
		color: "#2A333D80",
	},
	footer: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-around",
	},
	listItem: {
		flexDirection: "row",
		flex: 1,
		marginBottom: 6,
		justifyContent: "space-between",
	},

	listLabel: {
		fontSize: 14,
		fontWeight: "400",
		color: "#2A333D40",
	},
});
