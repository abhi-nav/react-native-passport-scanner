import { StyleSheet, View, ScrollView, Alert } from "react-native";
import React from "react";
import { UserPassport } from "../app/user-passports/models/UserPassport";
import { ListItem, Image, Badge, Button } from "react-native-elements";
import { Text } from "./TextComponent";
import { getFormattedData } from "../helper/helper";

type PassportListComponentType = {
	userPassport: Partial<UserPassport>;
	onDeleteHandler: () => void;
	hideDelete: boolean;
};

const PassportPreviewComponent: React.FC<PassportListComponentType> = ({
	userPassport,
	onDeleteHandler,
	hideDelete,
}) => {
	const name = `${userPassport.details?.firstName} ${userPassport.details?.lastName}`;
	const onDeleteHandler_ = () => {
		Alert.alert(
			"Are your sure?",
			"Are you sure you want to remove this Passport",
			[
				{
					text: "Yes",
					onPress: () => {
						onDeleteHandler();
					},
				},
				// The "No" button
				// Does nothing but dismiss the dialog when tapped
				{
					text: "No",
				},
			]
		);
	};
	return (
		<ScrollView>
			<View
				style={{
					backgroundColor: "#EBF0F5",
					padding: 16,
				}}
			>
				<View style={styles.contentWrapper}>
					<ListItem bottomDivider>
						<ListItem.Content>
							<ListItem.Title style={styles.textTitleStyle}>
								{name}
							</ListItem.Title>
							<ListItem.Subtitle style={styles.textStyle}>
								Name
							</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>

					<ListItem bottomDivider>
						<ListItem.Content>
							<ListItem.Title style={styles.textTitleStyle}>
								{userPassport.details?.documentNumber}
							</ListItem.Title>
							<ListItem.Subtitle style={styles.textStyle}>
								Passport
							</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>
					<ListItem bottomDivider>
						<ListItem.Content>
							<ListItem.Title style={styles.textTitleStyle}>
								<Text style={[styles.textTitleStyle]}>
									{userPassport.iccid}
								</Text>
							</ListItem.Title>
							<ListItem.Subtitle style={styles.textStyle}>
								ICCID
							</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>
					{userPassport.simNumber ? (
						<ListItem bottomDivider>
							<ListItem.Content>
								<ListItem.Title style={styles.textTitleStyle}>
									<Text style={[styles.textTitleStyle]}>
										{`${userPassport.simNumber} - ${userPassport.highlandId}`}
									</Text>
								</ListItem.Title>
								<ListItem.Subtitle style={styles.textStyle}>
									Sim Number - highland_id
								</ListItem.Subtitle>
							</ListItem.Content>
						</ListItem>
					) : null}

					<ListItem bottomDivider>
						<ListItem.Content>
							<ListItem.Title style={styles.textTitleStyle}>
								{getFormattedData(
									userPassport.details?.birthDate!
								)}
							</ListItem.Title>
							<ListItem.Subtitle style={styles.textStyle}>
								Date of Birth
							</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>

					<ListItem bottomDivider>
						<ListItem.Content>
							<ListItem.Title style={styles.textTitleStyle}>
								{userPassport.details?.sex}
							</ListItem.Title>
							<ListItem.Subtitle style={styles.textStyle}>
								Sex
							</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>

					<ListItem bottomDivider>
						<ListItem.Content>
							<ListItem.Title style={styles.textTitleStyle}>
								{userPassport.details?.nationality}
							</ListItem.Title>
							<ListItem.Subtitle style={styles.textStyle}>
								Nationality
							</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>

					<ListItem bottomDivider>
						<ListItem.Content>
							<ListItem.Title style={styles.textTitleStyle}>
								{userPassport.details?.personalNumber}
							</ListItem.Title>
							<ListItem.Subtitle style={styles.textStyle}>
								Citizen Number
							</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>

					<ListItem bottomDivider>
						<ListItem.Content>
							<ListItem.Title style={styles.textTitleStyle}>
								{getFormattedData(
									userPassport.details!.expirationDate!
								)}
							</ListItem.Title>
							<ListItem.Subtitle style={styles.textStyle}>
								Passport Expiry
							</ListItem.Subtitle>
						</ListItem.Content>
					</ListItem>

					<ListItem bottomDivider>
						<View
							style={{
								flex: 1,
								flexDirection: "row",
							}}
						>
							<ListItem.Content>
								<ListItem.Title style={styles.textTitleStyle}>
									<Badge
										status={
											userPassport.serverDBId
												? "success"
												: "warning"
										}
										value={userPassport.status}
									/>
								</ListItem.Title>
								<ListItem.Subtitle style={styles.textStyle}>
									Server Status
								</ListItem.Subtitle>
							</ListItem.Content>
							<View>
								{!hideDelete ? (
									<Button
										title="Delete"
										onPress={onDeleteHandler_}
										buttonStyle={styles.deleteBtn}
										type="outline"
										titleStyle={{ color: "#FF000080" }}
									/>
								) : null}
							</View>
						</View>
					</ListItem>

					{/* <Text>PassportListComponent</Text> */}
					{/* <Text> {userPassport.passportImage} </Text> */}
				</View>
				<View style={styles.imageWrapper}>
					<Image
						source={{ uri: userPassport.passportImage }}
						style={[styles.image]}
					/>
					<Image
						source={{ uri: userPassport.highlandImage }}
						style={[styles.image]}
					/>
					<Image
						source={{ uri: userPassport.signatureImage }}
						style={[styles.image]}
					/>
				</View>
			</View>
		</ScrollView>
	);
};

export default PassportPreviewComponent;

const styles = StyleSheet.create({
	imageWrapper: {
		alignItems: "center",
		marginTop: 10,
	},
	image: {
		// borderWidth: 1,
		// borderColor: "#00000020",
		borderRadius: 8,
		// overflow: "hidden",
		width: "100%",
		aspectRatio: 16 / 9,
		height: undefined,
		marginBottom: 10,
		resizeMode: "stretch",
	},

	textTitleStyle: {
		fontSize: 14,
		marginBottom: 5,
		color: "#2A333D",
		fontFamily: "open-sans",
	},
	textStyle: {
		fontSize: 14,
		marginBottom: 5,
		color: "#2A333D60",
		fontFamily: "open-sans",
	},
	contentWrapper: {
		flex: 1,
	},
	subtitle: {
		fontSize: 14,
		fontWeight: "400",
		fontFamily: "open-sans",
	},
	deleteBtn: {
		padding: 5,
		borderRadius: 10,
	},
});
